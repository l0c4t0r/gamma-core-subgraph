import { Address, log } from "@graphprotocol/graph-ts";
import {
  LogPoolAddition,
  LogSetPool,
  LogRewardPerSecond,
  LogUpdatePool,
} from "../../../generated/templates/Rewarder/MasterChefV2Rewarder";
import {
  createRewarderLogPoolAddition,
  createRewarderLogRewardPerSecond,
  createRewarderLogSetPool,
  createRewarderLogUpdatePool,
} from "../../helpers/entities/transaction/masterChefV2Rewarder";
import { getOrCreateMCV2Rewarder } from "../../helpers/entities/masterChefV2";
import {
  getHypervisorFromPoolId,
  updateRewarderAllocPoint,
} from "../../helpers/masterChefV2";

export function handleLogPoolAddition(event: LogPoolAddition): void {
  createRewarderLogPoolAddition(event);
  // This is the point where a rewarder is attached to a pool, so this is where RewarderPool should be created
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  const hypervisorAddress = getHypervisorFromPoolId(
    Address.fromBytes(rewarder.masterChef),
    event.params.pid
  );

  if (!hypervisorAddress) {
    log.warning("Invalid hypervisor for poolId: {} in rewarder: {}", [
      event.params.pid.toString(),
      event.address.toHex(),
    ]);
    return;
  }

  updateRewarderAllocPoint(
    event.address,
    hypervisorAddress,
    event.params.allocPoint
  );
}

export function handleLogSetPool(event: LogSetPool): void {
  createRewarderLogSetPool(event);
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  const hypervisorAddress = getHypervisorFromPoolId(
    Address.fromBytes(rewarder.masterChef),
    event.params.pid
  );

  if (!hypervisorAddress) {
    log.warning("Invalid hypervisor for poolId: {} in rewarder: {}", [
      event.params.pid.toString(),
      event.address.toHex(),
    ]);
    return;
  }

  updateRewarderAllocPoint(
    event.address,
    hypervisorAddress,
    event.params.allocPoint
  );
}

export function handleLogRewardPerSecond(event: LogRewardPerSecond): void {
  createRewarderLogRewardPerSecond(event);
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  rewarder.rewardPerSecond = event.params.rewardPerSecond;
  rewarder.save();
}

export function handleLogUpdatePool(event: LogUpdatePool): void {
  createRewarderLogUpdatePool(event);
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  rewarder.lastRewardTimestamp = event.params.lastRewardTime;
  rewarder.save();
}
