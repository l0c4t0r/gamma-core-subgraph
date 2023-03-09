import {
  Deposit,
  EmergencyWithdraw,
  LogPoolAddition,
  LogRewarderAdded,
  LogSetPool,
  LogSushiPerSecond,
  LogUpdatePool,
  Withdraw,
} from "../../../generated/templates/MasterChefV2/MasterChefV2";
import { Rewarder as RewarderTemplate } from "../../../generated/templates";
import {
  getOrCreateMasterChefV2,
  getOrCreateMCV2Pool,
  getOrCreateMCV2Rewarder,
  getOrCreateMCV2RewarderPool,
} from "../../helpers/entities/masterChefV2";
import { ZERO_BI } from "../../helpers/constants";
import { Address } from "@graphprotocol/graph-ts";
import {
  createMcV2Deposit,
  createMcV2EmergencyWithdraw,
  createMcV2LogPoolAddition,
  createMcV2LogRewarderAdded,
  createMcV2LogSetPool,
  createMcV2LogSushiPerSecond,
  createMcV2LogUpdatePool,
  createMcV2Withdraw,
} from "../../helpers/entities/transaction/masterChefV2";
import {
  getHypervisorFromPoolId,
  incrementAccountAmount,
  isValidRewarder,
  syncRewarderPoolInfo,
} from "../../helpers/masterChefV2";

incrementAccountAmount;

export function handleDeposit(event: Deposit): void {
  createMcV2Deposit(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  incrementAccountAmount(
    event.address,
    event.params.user,
    hypervisorAddress,
    event.params.amount
  );
}

export function handleWithdraw(event: Withdraw): void {
  createMcV2Withdraw(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  incrementAccountAmount(
    event.address,
    event.params.user,
    hypervisorAddress,
    ZERO_BI.minus(event.params.amount)
  );
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  createMcV2EmergencyWithdraw(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  incrementAccountAmount(
    event.address,
    event.params.user,
    hypervisorAddress,
    ZERO_BI.minus(event.params.amount)
  );
}

export function handleLogPoolAddition(event: LogPoolAddition): void {
  createMcV2LogPoolAddition(event);
  const masterChefPool = getOrCreateMCV2Pool(
    event.address,
    event.params.lpToken
  );
  masterChefPool.poolId = event.params.pid;
  masterChefPool.allocPoint = event.params.allocPoint;
  masterChefPool.lastRewardTimestamp = event.block.timestamp;
  masterChefPool.save();
}

export function handleLogSetPool(event: LogSetPool): void {
  createMcV2LogSetPool(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  const masterChefPool = getOrCreateMCV2Pool(event.address, hypervisorAddress);

  masterChefPool.allocPoint = event.params.allocPoint;
  masterChefPool.save();
}

export function handleLogUpdatePool(event: LogUpdatePool): void {
  createMcV2LogUpdatePool(event);
  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  const masterChefPool = getOrCreateMCV2Pool(event.address, hypervisorAddress);

  masterChefPool.totalStaked = event.params.lpSupply;
  masterChefPool.accSushiPerShare = event.params.accSushiPerShare;
  masterChefPool.lastRewardTimestamp = event.params.lastRewardTime;
  masterChefPool.save();
}

export function handleLogSushiPerSecond(event: LogSushiPerSecond): void {
  createMcV2LogSushiPerSecond(event);
  const masterChef = getOrCreateMasterChefV2(event.address);
  masterChef.rewardPerSecond = event.params.sushiPerSecond;
  masterChef.save();
}

export function handleLogRewarderAdded(event: LogRewarderAdded): void {
  createMcV2LogRewarderAdded(event);
  // This event triggers rewarders to be tracked
  // Check if rewarder is valid
  if (!isValidRewarder(event.params.rewarder)) {
    return;
  }

  const hypervisorAddress = getHypervisorFromPoolId(
    event.address,
    event.params.pid
  );

  if (!hypervisorAddress) {
    return;
  }

  const masterChefPool = getOrCreateMCV2Pool(event.address, hypervisorAddress);
  const rewarderList = masterChefPool.rewarderList;
  rewarderList.push(event.params.rewarder.toHex());
  masterChefPool.rewarderList = rewarderList;
  masterChefPool.save();

  // Create the rewarder entity, and sync pool info in case state was changed prior
  const rewarder = getOrCreateMCV2Rewarder(event.params.rewarder);
  getOrCreateMCV2RewarderPool(
    event.params.rewarder,
    Address.fromBytes(rewarder.masterChef),
    hypervisorAddress
  );
  syncRewarderPoolInfo(event.params.rewarder);

  RewarderTemplate.create(event.params.rewarder);
}
