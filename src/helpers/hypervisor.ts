import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ZERO_BI } from "./constants";
import { Hypervisor as HypervisorContract } from "../../generated/templates/Hypervisor/Hypervisor";
import { getOrCreateHypervisor } from "./entities/general";

export function updateTotalSupply(
  hypervisorAddress: Address,
  totalSupplyDelta: BigInt
): void {
  const hypervisor = getOrCreateHypervisor(hypervisorAddress);

  if (hypervisor.totalSupply == ZERO_BI) {
    const hypervisorContract = HypervisorContract.bind(hypervisorAddress);
    const totalSupply = hypervisorContract.try_totalSupply();
    if (totalSupply.reverted) {
      hypervisor.totalSupply = hypervisor.totalSupply.plus(totalSupplyDelta);
    } else {
      hypervisor.totalSupply = totalSupply.value;
    }
  } else {
    hypervisor.totalSupply = hypervisor.totalSupply.plus(totalSupplyDelta);
  }
}
