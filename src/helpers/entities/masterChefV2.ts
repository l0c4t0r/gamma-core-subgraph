import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  MasterChefV2,
  MasterChefV2Pool,
  MasterChefV2PoolAccount,
  MasterChefV2Rewarder,
  MasterChefV2RewarderPool,
  MasterChefV2RewarderPoolAccount,
} from "../../../generated/schema";
import { MasterChefV2 as MasterChefContract } from "../../../generated/templates/MasterChefV2/MasterChefV2";
import { MasterChefV2Rewarder as RewarderContract } from "../../../generated/templates/Rewarder/MasterChefV2Rewarder";
import { ADDRESS_ZERO, ZERO_BI } from "../constants";
import { getOrCreateAccount } from "./general";
import { getOrCreateToken } from "../token";
import { getOrCreateHypervisor } from "./general";

export function getOrCreateMasterChefV2(address: Address): MasterChefV2 {
  let masterChefV2 = MasterChefV2.load(address);
  if (!masterChefV2) {
    const masterChefContract = MasterChefContract.bind(address);
    const rewardToken = getOrCreateToken(masterChefContract.SUSHI());

    masterChefV2 = new MasterChefV2(address);
    masterChefV2.rewardToken = rewardToken.id;
    masterChefV2.rewardPerSecond = masterChefContract.sushiPerSecond();
    masterChefV2.totalAllocPoint = ZERO_BI;
    masterChefV2.save();
  }

  return masterChefV2;
}

export function getOrCreateMCV2Pool(
  masterChefAddress: Address,
  hypervisorAddress: Address
): MasterChefV2Pool {
  const id = masterChefAddress.toHex() + "-" + hypervisorAddress.toHex();

  let masterChefPool = MasterChefV2Pool.load(id);
  if (!masterChefPool) {
    const masterChef = getOrCreateMasterChefV2(masterChefAddress);
    const hypervisor = getOrCreateHypervisor(hypervisorAddress);
    const stakeToken = getOrCreateToken(hypervisorAddress);

    masterChefPool = new MasterChefV2Pool(id);
    masterChefPool.hypervisor = hypervisor.id;
    masterChefPool.masterChef = masterChef.id;
    masterChefPool.poolId = ZERO_BI;
    masterChefPool.allocPoint = ZERO_BI;
    masterChefPool.stakeToken = stakeToken.id;
    masterChefPool.totalStaked = ZERO_BI;
    masterChefPool.accSushiPerShare = ZERO_BI;
    masterChefPool.rewarderList = [];
    masterChefPool.lastRewardTimestamp = ZERO_BI;
    masterChefPool.save();
  }

  return masterChefPool;
}

export function getOrCreateMCV2Rewarder(
  rewarderAddress: Address
): MasterChefV2Rewarder {
  let rewarder = MasterChefV2Rewarder.load(rewarderAddress.toHex());
  if (!rewarder) {
    const rewarderContract = RewarderContract.bind(rewarderAddress);

    const masterChef = getOrCreateMasterChefV2(
      rewarderContract.MASTERCHEF_V2()
    );

    rewarder = new MasterChefV2Rewarder(rewarderAddress.toHex());
    rewarder.masterChef = masterChef.id;
    rewarder.rewardPerSecond = rewarderContract.rewardPerSecond();
    rewarder.totalAllocPoint = ZERO_BI;
    rewarder.lastRewardTimestamp = ZERO_BI;

    const rewardTokenCall = rewarderContract.try_rewardToken();
    if (rewardTokenCall) {
      const rewardToken = getOrCreateToken(rewardTokenCall.value);
      rewarder.rewardToken = rewardToken.id;
    } else {
      rewarder.rewardToken = Bytes.fromHexString(ADDRESS_ZERO);
    }

    rewarder.save();
  }
  return rewarder;
}

export function getOrCreateMCV2RewarderPool(
  rewarderAddress: Address,
  masterChefAddress: Address,
  hypervisorAddress: Address
): MasterChefV2RewarderPool {
  const poolId = masterChefAddress.toHex() + "-" + hypervisorAddress.toHex();
  const id = rewarderAddress.toHex() + "-" + poolId;

  let rewarderPool = MasterChefV2RewarderPool.load(id);
  if (!rewarderPool) {
    rewarderPool = new MasterChefV2RewarderPool(id);
    rewarderPool.rewarder = rewarderAddress.toHex();
    rewarderPool.pool = poolId;
    rewarderPool.allocPoint = ZERO_BI;
    rewarderPool.save();
  }
  return rewarderPool;
}

export function getOrCreateMCV2PoolAccount(
  masterChefAddress: Address,
  hypervisorAddress: Address,
  accountAddress: Address
): MasterChefV2PoolAccount {
  const mcV2PoolAccountId = masterChefAddress
    .toHex()
    .concat("-")
    .concat(hypervisorAddress.toHex())
    .concat("-")
    .concat(accountAddress.toHex());

  let poolAccount = MasterChefV2PoolAccount.load(mcV2PoolAccountId);

  if (!poolAccount) {
    poolAccount = new MasterChefV2PoolAccount(mcV2PoolAccountId);
    const pool = getOrCreateMCV2Pool(masterChefAddress, hypervisorAddress);
    const account = getOrCreateAccount(accountAddress);
    poolAccount.pool = pool.id;
    poolAccount.account = account.id;
    poolAccount.amount = ZERO_BI;

    poolAccount.save();
  }
  return poolAccount;
}

export function getOrCreateMCV2RewarderPoolAccount(
  rewarderAddress: Address,
  masterChefAddress: Address,
  hypervisorAddress: Address,
  userAccount: Address
): MasterChefV2RewarderPoolAccount {
  const id =
    rewarderAddress.toHex() +
    "-" +
    masterChefAddress.toHex() +
    "-" +
    hypervisorAddress.toHex() +
    "-" +
    userAccount.toHex();

  const rewarderPool = getOrCreateMCV2RewarderPool(
    rewarderAddress,
    masterChefAddress,
    hypervisorAddress
  );
  const account = getOrCreateAccount(userAccount);

  let rewarderPoolAccount = MasterChefV2RewarderPoolAccount.load(id);
  if (!rewarderPoolAccount) {
    rewarderPoolAccount = new MasterChefV2RewarderPoolAccount(id);
    rewarderPoolAccount.account = account.id;
    rewarderPoolAccount.rewarderPool = rewarderPool.id;

    rewarderPoolAccount.amount = ZERO_BI;
    rewarderPoolAccount.save();
  }

  return rewarderPoolAccount;
}
