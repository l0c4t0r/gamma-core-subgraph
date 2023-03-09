import {
  McV2Deposit,
  McV2EmergencyWithdraw,
  McV2LogPoolAddition,
  McV2LogRewarderAdded,
  McV2LogSetPool,
  McV2LogSushiPerSecond,
  McV2LogUpdatePool,
  McV2Withdraw,
} from "../../../../generated/schema";
import {
  Deposit,
  EmergencyWithdraw,
  LogPoolAddition,
  LogRewarderAdded,
  LogSetPool,
  LogSushiPerSecond,
  LogUpdatePool,
  Withdraw,
} from "../../../../generated/templates/MasterChefV2/MasterChefV2";
import { LogRewardPerSecond } from "../../../../generated/templates/Rewarder/MasterChefV2Rewarder";
import {
  getOrCreateMasterChefV2,
  getOrCreateMCV2Rewarder,
} from "../masterChefV2";
import { getOrCreateToken } from "../../token";

export function createMcV2Deposit(event: Deposit): void {
  let entity = new McV2Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.user = event.params.user;
  entity.pid = event.params.pid;
  entity.amount = event.params.amount;
  entity.to = event.params.to;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2Withdraw(event: Withdraw): void {
  let entity = new McV2Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.user = event.params.user;
  entity.pid = event.params.pid;
  entity.amount = event.params.amount;
  entity.to = event.params.to;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2EmergencyWithdraw(event: EmergencyWithdraw): void {
  let entity = new McV2EmergencyWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.user = event.params.user;
  entity.pid = event.params.pid;
  entity.amount = event.params.amount;
  entity.to = event.params.to;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2LogPoolAddition(event: LogPoolAddition): void {
  let entity = new McV2LogPoolAddition(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.pid = event.params.pid;
  entity.allocPoint = event.params.allocPoint;

  const lpToken = getOrCreateToken(event.params.lpToken);
  entity.lpToken = lpToken.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2LogSetPool(event: LogSetPool): void {
  let entity = new McV2LogSetPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.pid = event.params.pid;
  entity.allocPoint = event.params.allocPoint;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2LogUpdatePool(event: LogUpdatePool): void {
  let entity = new McV2LogUpdatePool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.pid = event.params.pid;
  entity.lastRewardTime = event.params.lastRewardTime;
  entity.lpSupply = event.params.lpSupply;
  entity.accSushiPerShare = event.params.accSushiPerShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2LogSushiPerSecond(event: LogSushiPerSecond): void {
  let entity = new McV2LogSushiPerSecond(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.sushiPerSecond = event.params.sushiPerSecond;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcV2LogRewarderAdded(event: LogRewarderAdded): void {
  let entity = new McV2LogRewarderAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.address);
  entity.masterChef = masterChef.id;

  entity.pid = event.params.pid;

  const rewarder = getOrCreateMCV2Rewarder(event.params.rewarder);
  entity.rewarder = rewarder.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
