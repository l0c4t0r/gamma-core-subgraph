import {
  HypeAdded as HypeAddedEvent,
  HypeRemoved as HypeRemovedEvent,
} from "../../generated/HypeRegistry/HypeRegistry";
import { Hypervisor } from "../../generated/schema";

import {
  createHypeAdded,
  createHypeRemoved,
} from "../helpers/entities/transaction/hypeRegistry";
import { processHypeAdded } from "../helpers/hypeRegistry";

export function handleHypeAdded(event: HypeAddedEvent): void {
  createHypeAdded(event);
  processHypeAdded(event.params.hype);
}

export function handleHypeRemoved(event: HypeRemovedEvent): void {
  createHypeRemoved(event);
  const hypervisor = Hypervisor.load(event.params.hype);
  if (hypervisor) {
    hypervisor.onRegistry = true;
    hypervisor.save();
  }
}
