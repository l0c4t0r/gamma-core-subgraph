import { Address, BigInt } from "@graphprotocol/graph-ts";
import { MasterChefV2 as MasterChefContract } from "../../generated/templates/MasterChefV2/MasterChefV2";
import { MasterChefV2Rewarder as RewarderContract } from "../../generated/templates/Rewarder/MasterChefV2Rewarder";
import {
  getOrCreateMCV2Pool,
  getOrCreateMCV2PoolAccount,
  getOrCreateMCV2Rewarder,
  getOrCreateMCV2RewarderPool,
  getOrCreateMCV2RewarderPoolAccount,
} from "./entities/masterChefV2";

export function getHypervisorFromPoolId(
  masterChefAddress: Address,
  poolId: BigInt
): Address | null {
  const masterChefContract = MasterChefContract.bind(masterChefAddress);
  const lpToken = masterChefContract.try_lpToken(poolId);
  if (lpToken.reverted) {
    return null;
  }
  return lpToken.value;
}

export function isValidRewarder(rewarderAddress: Address): bool {
  const rewarderContract = RewarderContract.bind(rewarderAddress);
  const rewardToken = rewarderContract.try_rewardToken();

  return !rewardToken.reverted;
}

export function updateRewarderAllocPoint(
  rewarderAddress: Address,
  hypervisorAddress: Address,
  allocPoint: BigInt
): void {
  // This is the point where a rewarder is attached to a pool, so this is where RewarderPool should be created
  const rewarder = getOrCreateMCV2Rewarder(rewarderAddress);
  const rewarderContract = RewarderContract.bind(rewarderAddress);

  const rewarderPool = getOrCreateMCV2RewarderPool(
    rewarderAddress,
    Address.fromBytes(rewarder.masterChef),
    hypervisorAddress
  );

  rewarderPool.allocPoint = allocPoint;
  rewarderPool.save();

  rewarder.totalAllocPoint = rewarderContract.totalAllocPoint();
  rewarder.save();
}

export function syncRewarderPoolInfo(rewarderAddress: Address): void {
  const rewarder = getOrCreateMCV2Rewarder(rewarderAddress);
  const rewarderContract = RewarderContract.bind(rewarderAddress);

  const masterChefAddress = Address.fromBytes(rewarder.masterChef);

  for (let i = 0; i < rewarderContract.poolLength().toI32(); i++) {
    const iBI = BigInt.fromI32(i);
    const poolInfo = rewarderContract.poolInfo(iBI);
    const allocPoint = poolInfo.getAllocPoint();

    const rewarderPool = getOrCreateMCV2RewarderPool(
      rewarderAddress,
      masterChefAddress,
      getHypervisorFromPoolId(masterChefAddress, iBI)!
    );
    rewarderPool.allocPoint = allocPoint;
    rewarderPool.save();
  }
  rewarder.totalAllocPoint = rewarderContract.totalAllocPoint();
  rewarder.save();
}

export function incrementAccountAmount(
  masterChefAddress: Address,
  accountAddress: Address,
  hypervisorAddress: Address,
  amount: BigInt
): void {
  const masterChefPool = getOrCreateMCV2Pool(
    masterChefAddress,
    hypervisorAddress
  );
  masterChefPool.totalStaked = masterChefPool.totalStaked.plus(amount);
  masterChefPool.save();

  let poolAccount = getOrCreateMCV2PoolAccount(
    masterChefAddress,
    hypervisorAddress,
    accountAddress
  );
  poolAccount.amount = poolAccount.amount.plus(amount);
  poolAccount.save();

  for (let i = 0; i < masterChefPool.rewarderList.length; i++) {
    const rewarderAccount = getOrCreateMCV2RewarderPoolAccount(
      Address.fromString(masterChefPool.rewarderList[i]),
      masterChefAddress,
      hypervisorAddress,
      accountAddress
    );

    rewarderAccount.amount = rewarderAccount.amount.plus(amount);
    rewarderAccount.save();
  }
}
