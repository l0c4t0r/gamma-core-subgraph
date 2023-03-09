import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Rebalance as RebalanceEvent,
  ZeroBurn as ZeroBurnEvent,
} from "../../../../generated/templates/Hypervisor/Hypervisor";
import {
  HypervisorDeposit,
  HypervisorWithdraw,
  HypervisorRebalance,
  HypervisorZeroBurn,
} from "../../../../generated/schema";
import { getOrCreateHypervisor } from "../general";

export function createHypervisorDeposit(event: DepositEvent): void {
  let entity = new HypervisorDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const hypervisor = getOrCreateHypervisor(event.address);
  entity.hypervisor = hypervisor.id;

  entity.sender = event.params.sender;
  entity.to = event.params.to;
  entity.shares = event.params.shares;
  entity.amount0 = event.params.amount0;
  entity.amount1 = event.params.amount1;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createHypervisorWithdraw(event: WithdrawEvent): void {
  let entity = new HypervisorWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const hypervisor = getOrCreateHypervisor(event.address);
  entity.hypervisor = hypervisor.id;

  entity.sender = event.params.sender;
  entity.to = event.params.to;
  entity.shares = event.params.shares;
  entity.amount0 = event.params.amount0;
  entity.amount1 = event.params.amount1;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createHypervisorRebalance(event: RebalanceEvent): void {
  let entity = new HypervisorRebalance(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const hypervisor = getOrCreateHypervisor(event.address);
  entity.hypervisor = hypervisor.id;

  entity.tick = event.params.tick;
  entity.totalAmount0 = event.params.totalAmount0;
  entity.totalAmount1 = event.params.totalAmount1;
  entity.feeAmount0 = event.params.feeAmount0;
  entity.feeAmount1 = event.params.feeAmount1;
  entity.totalSupply = event.params.totalSupply;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createHypervisorZeroBurn(event: ZeroBurnEvent): void {
  let entity = new HypervisorZeroBurn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const hypervisor = getOrCreateHypervisor(event.address);
  entity.hypervisor = hypervisor.id;

  entity.fee = event.params.fee;
  entity.fee0 = event.params.fees0;
  entity.fee1 = event.params.fees1;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMcDeposit(event: ZeroBurnEvent): void {
  let entity = new HypervisorZeroBurn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const hypervisor = getOrCreateHypervisor(event.address);
  entity.hypervisor = hypervisor.id;

  entity.fee = event.params.fee;
  entity.fee0 = event.params.fees0;
  entity.fee1 = event.params.fees1;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
