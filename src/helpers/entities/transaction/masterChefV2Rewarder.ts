import {
  RewarderLogPoolAddition,
  RewarderLogRewardPerSecond,
  RewarderLogSetPool,
  RewarderLogUpdatePool,
} from "../../../../generated/schema";
import {
  LogPoolAddition,
  LogRewardPerSecond,
  LogSetPool,
  LogUpdatePool,
} from "../../../../generated/templates/Rewarder/MasterChefV2Rewarder";
import { getOrCreateMCV2Rewarder } from "../masterChefV2";

export function createRewarderLogPoolAddition(event: LogPoolAddition): void {
  let entity = new RewarderLogPoolAddition(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  entity.rewarder = rewarder.id;

  entity.pid = event.params.pid;
  entity.allocPoint = event.params.allocPoint;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createRewarderLogSetPool(event: LogSetPool): void {
  let entity = new RewarderLogSetPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  entity.rewarder = rewarder.id;

  entity.pid = event.params.pid;
  entity.allocPoint = event.params.allocPoint;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createRewarderLogRewardPerSecond(
  event: LogRewardPerSecond
): void {
  let entity = new RewarderLogRewardPerSecond(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const rewarder = getOrCreateMCV2Rewarder(event.address);
  entity.rewarder = rewarder.id;

  entity.rewardPerSecond = event.params.rewardPerSecond;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createRewarderLogUpdatePool(
    event: LogUpdatePool
  ): void {
    let entity = new RewarderLogUpdatePool(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    const rewarder = getOrCreateMCV2Rewarder(event.address);
    entity.rewarder = rewarder.id;
  
    entity.pid = event.params.pid;
    entity.lastRewardTime = event.params.lastRewardTime
    entity.lpSupply = event.params.lpSupply
    entity.accSushiPerShare = event.params.accSushiPerShare
  
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
  
    entity.save();
  }
  