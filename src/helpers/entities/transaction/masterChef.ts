import {
  AddLp,
  Deposit,
  PoolUpdated,
  SetAllocPoint,
  UpdateEmissionRate,
  Withdraw,
} from "../../../../generated/templates/MasterChef/MasterChef";
import {
  McAddLp,
  McDeposit,
  McPoolUpdated,
  McSetAllocPoint,
  McUpdateEmissionRate,
  McWithdraw,
} from "../../../../generated/schema";
import { getOrCreateMasterChef } from "../masterChef";
import { getOrCreateToken } from "../../token";

export function createMcDeposit(event: Deposit): void {
  let entity = new McDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.address);
  entity.masterChef = masterChef.id;

  entity.user = event.params.user;
  entity.pid = event.params.pid;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcWithdraw(event: Withdraw): void {
  let entity = new McWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.address);
  entity.masterChef = masterChef.id;

  entity.user = event.params.user;
  entity.pid = event.params.pid;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcAddLp(event: AddLp): void {
  let entity = new McAddLp(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.address);
  entity.masterChef = masterChef.id;

  entity.poolId = event.params.poolId;

  const lpToken = getOrCreateToken(event.params.poolInfo.lpToken)
  entity.lpToken = lpToken.id;
  entity.allocPoint = event.params.poolInfo.allocPoint;
  entity.lastRewardBlock = event.params.poolInfo.lastRewardBlock;
  entity.accSushiPerShare = event.params.poolInfo.accSushiPerShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcSetAllocPoint(event: SetAllocPoint): void {
  let entity = new McSetAllocPoint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.address);
  entity.masterChef = masterChef.id;

  entity.poolId = event.params.poolId;

  const lpToken = getOrCreateToken(event.params.poolInfo.lpToken)
  entity.lpToken = lpToken.id;
  entity.allocPoint = event.params.poolInfo.allocPoint;
  entity.lastRewardBlock = event.params.poolInfo.lastRewardBlock;
  entity.accSushiPerShare = event.params.poolInfo.accSushiPerShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcPoolUpdated(event: PoolUpdated): void {
  let entity = new McPoolUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.address);
  entity.masterChef = masterChef.id;

  entity.poolId = event.params.poolId;

  const lpToken = getOrCreateToken(event.params.poolInfo.lpToken)
  entity.lpToken = lpToken.id;
  entity.allocPoint = event.params.poolInfo.allocPoint;
  entity.lastRewardBlock = event.params.poolInfo.lastRewardBlock;
  entity.accSushiPerShare = event.params.poolInfo.accSushiPerShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcUpdateEmissionRate(event: UpdateEmissionRate): void {
    let entity = new McUpdateEmissionRate(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    const masterChef = getOrCreateMasterChef(event.address);
    entity.masterChef = masterChef.id;
  
    entity.user = event.params.user;
    entity.sushiPerBlock = event.params.sushiPerBlock;
  
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
  
    entity.save();
  }
  