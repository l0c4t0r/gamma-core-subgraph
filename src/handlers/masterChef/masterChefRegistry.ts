import { log } from "@graphprotocol/graph-ts";
import { HypeAdded } from "../../../generated/MasterChefRegistry/HypeRegistry";
import { HypeAdded as HypeAddedV2 } from "../../../generated/MasterChefV2Registry/HypeRegistry";
import { MasterChef as MasterChefContract } from "../../../generated/templates/MasterChef/MasterChef";
import { MasterChefV2 as MasterChefV2Contract } from "../../../generated/templates/MasterChefV2/MasterChefV2";
import { MasterChef as MasterChefTemplate } from "../../../generated/templates";
import { MasterChefV2 as MasterChefV2Template } from "../../../generated/templates";
import { getOrCreateMasterChef } from "../../helpers/entities/masterChef";
import { getOrCreateMasterChefV2 } from "../../helpers/entities/masterChefV2";
import {
  createMasterChefAdded,
  createMasterChefV2Added,
} from "../../helpers/entities/transaction/masterChefRegistry";

export function handleHypeAdded(event: HypeAdded): void {
  createMasterChefAdded(event);
  const masterChefContract = MasterChefContract.bind(event.params.hype);
  const testAllocPoints = masterChefContract.try_totalAllocPoint();
  if (testAllocPoints.reverted) {
    log.warning("Could not add {}, does not appear to be a masterchef", [
      event.params.hype.toHex(),
    ]);
    return;
  }

  const masterChef = getOrCreateMasterChef(event.params.hype);
  masterChef.save();

  MasterChefTemplate.create(event.params.hype);
}

export function handleHypeAddedV2(event: HypeAddedV2): void {
  createMasterChefV2Added(event);
  const masterChefContract = MasterChefV2Contract.bind(event.params.hype);
  const testAllocPoints = masterChefContract.try_totalAllocPoint();
  if (testAllocPoints.reverted) {
    log.warning("Could not add {}, does not appear to be a masterchef", [
      event.params.hype.toHex(),
    ]);
    return;
  }

  const masterChefV2 = getOrCreateMasterChefV2(event.params.hype);
  masterChefV2.save();

  MasterChefV2Template.create(event.params.hype);
}
