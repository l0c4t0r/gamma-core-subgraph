import { HypeAdded } from "../../../../generated/MasterChefRegistry/HypeRegistry";
import { HypeAdded as HypeAddedV2 } from "../../../../generated/MasterChefV2Registry/HypeRegistry";
import { MasterChefAdded, MasterChefV2Added } from "../../../../generated/schema";
import { getOrCreateMasterChef } from "../masterChef";
import { getOrCreateMasterChefV2 } from "../masterChefV2";

export function createMasterChefAdded(event: HypeAdded): void {
  let entity = new MasterChefAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChef(event.params.hype);
  entity.masterChef = masterChef.id;

  entity.hype = event.params.hype;
  entity.index = event.params.index;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function createMasterChefV2Added(event: HypeAddedV2): void {
  let entity = new MasterChefV2Added(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  const masterChef = getOrCreateMasterChefV2(event.params.hype);
  entity.masterChef = masterChef.id;

  entity.hype = event.params.hype;
  entity.index = event.params.index;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
