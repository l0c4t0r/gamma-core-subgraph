import { Address } from "@graphprotocol/graph-ts";
import { MasterChef as MasterChefContract } from "../../../generated/templates/MasterChef/MasterChef";
import {
  MasterChef,
  MasterChefPool,
  MasterChefPoolAccount,
} from "../../../generated/schema";
import { getOrCreateAccount, getOrCreateHypervisor } from "../entities/general";
import { getOrCreateToken } from "../token";
import { ZERO_BI } from "../constants";

export function getOrCreateMasterChef(address: Address): MasterChef {
  let masterChef = MasterChef.load(address);
  if (!masterChef) {
    let masterChefContract = MasterChefContract.bind(address);
    let rewardToken = getOrCreateToken(masterChefContract.sushi());

    masterChef = new MasterChef(address);
    masterChef.rewardToken = rewardToken.id;
    masterChef.rewardPerBlock = masterChefContract.sushiPerBlock();
    masterChef.totalAllocPoint = ZERO_BI;
    masterChef.save();
  }

  return masterChef;
}

export function getOrCreateMasterChefPool(
  masterChefAddress: Address,
  hypervisorAddress: Address
): MasterChefPool {
  const id = masterChefAddress.toHex() + "-" + hypervisorAddress.toHex();

  let masterChefPool = MasterChefPool.load(id);
  if (!masterChefPool) {
    let masterChef = getOrCreateMasterChef(masterChefAddress);
    let hypervisor = getOrCreateHypervisor(hypervisorAddress);
    let stakeToken = getOrCreateToken(hypervisorAddress);

    masterChefPool = new MasterChefPool(id);
    masterChefPool.masterChef = masterChef.id;
    masterChefPool.hypervisor = hypervisor.id;
    masterChefPool.allocPoint = ZERO_BI;
    masterChefPool.lastRewardBlock = ZERO_BI;
    masterChefPool.stakeToken = stakeToken.id;
    masterChefPool.totalStaked = ZERO_BI;
    masterChefPool.poolId = ZERO_BI;
    masterChefPool.save();
  }

  return masterChefPool;
}

export function getOrCreateMasterChefPoolAccount(
  masterChefAddress: Address,
  hypervisorAddress: Address,
  userAccount: Address
): MasterChefPoolAccount {
  const masterChefPoolId =
    masterChefAddress.toHex() + "-" + hypervisorAddress.toHex();
  const id = masterChefPoolId + "-" + userAccount.toHex();

  let masterChefPool = getOrCreateMasterChefPool(
    masterChefAddress,
    hypervisorAddress
  );
  let account = getOrCreateAccount(userAccount);

  let masterChefPoolAccount = MasterChefPoolAccount.load(id);
  if (!masterChefPoolAccount) {
    masterChefPoolAccount = new MasterChefPoolAccount(id);
    masterChefPoolAccount.account = account.id;
    masterChefPoolAccount.pool = masterChefPool.id;
    masterChefPoolAccount.amount = ZERO_BI;
    masterChefPoolAccount.save();
  }

  return masterChefPoolAccount;
}
