import { Address } from "@graphprotocol/graph-ts";
import {
  AddLp,
  Deposit as DepositEvent,
  SetAllocPoint,
  Withdraw as WithdrawEvent,
  PoolUpdated,
  UpdateEmissionRate,
} from "../../../generated/templates/MasterChef/MasterChef";
import {
  createMcAddLp,
  createMcDeposit,
  createMcPoolUpdated,
  createMcSetAllocPoint,
  createMcWithdraw,
} from "../../helpers/entities/transaction/masterChef";
import {
  getOrCreateMasterChef,
  getOrCreateMasterChefPool,
  getOrCreateMasterChefPoolAccount,
} from "../../helpers/entities/masterChef";
import { getHypervisorFromPoolId } from "../../helpers/masterChef";

export function handleDeposit(event: DepositEvent): void {
  createMcDeposit(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  const masterChefPoolAccount = getOrCreateMasterChefPoolAccount(
    event.address,
    hypervisorAddress,
    event.params.user
  );
  masterChefPoolAccount.amount = masterChefPoolAccount.amount.plus(
    event.params.amount
  );
  masterChefPoolAccount.save();

  const masterChefPool = getOrCreateMasterChefPool(
    event.address,
    hypervisorAddress
  );
  masterChefPool.totalStaked = masterChefPool.totalStaked.plus(
    event.params.amount
  );
  masterChefPool.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  createMcWithdraw(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  const masterChefPoolAccount = getOrCreateMasterChefPoolAccount(
    event.address,
    hypervisorAddress,
    event.params.user
  );
  masterChefPoolAccount.amount = masterChefPoolAccount.amount.minus(
    event.params.amount
  );
  masterChefPoolAccount.save();

  const masterChefPool = getOrCreateMasterChefPool(
    event.address,
    hypervisorAddress
  );
  masterChefPool.totalStaked = masterChefPool.totalStaked.minus(
    event.params.amount
  );
  masterChefPool.save();
}

export function handleAddLp(event: AddLp): void {
  createMcAddLp(event);
  const masterChefPool = getOrCreateMasterChefPool(
    event.address,
    event.params.poolInfo.lpToken
  );
  masterChefPool.allocPoint = event.params.poolInfo.allocPoint;
  masterChefPool.lastRewardBlock = event.params.poolInfo.lastRewardBlock;
  masterChefPool.poolId = event.params.poolId;
  masterChefPool.save();

  const masterChef = getOrCreateMasterChef(
    Address.fromBytes(masterChefPool.masterChef)
  );
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(
    event.params.poolInfo.allocPoint
  );
  masterChef.save();
}

export function handleSetAllocPoint(event: SetAllocPoint): void {
  createMcSetAllocPoint(event);
  const masterChefPool = getOrCreateMasterChefPool(
    event.address,
    event.params.poolInfo.lpToken
  );
  const oldAllocPoints = masterChefPool.allocPoint;
  masterChefPool.allocPoint = event.params.poolInfo.allocPoint;
  masterChefPool.save();

  const masterChef = getOrCreateMasterChef(
    Address.fromBytes(masterChefPool.masterChef)
  );
  masterChef.totalAllocPoint = masterChef.totalAllocPoint
    .plus(event.params.poolInfo.allocPoint)
    .minus(oldAllocPoints);
  masterChef.save();
}

export function handlePoolUpdated(event: PoolUpdated): void {
  createMcPoolUpdated(event);
  const masterChefPool = getOrCreateMasterChefPool(
    event.address,
    event.params.poolInfo.lpToken
  );
  masterChefPool.lastRewardBlock = event.params.poolInfo.lastRewardBlock;
  masterChefPool.save();
}

export function handleUpdateEmissionRate(event: UpdateEmissionRate): void {
  const masterChef = getOrCreateMasterChef(event.address);
  masterChef.rewardPerBlock = event.params.sushiPerBlock;
  masterChef.save();
}
