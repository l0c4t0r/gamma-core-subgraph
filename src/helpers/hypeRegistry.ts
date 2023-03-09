import { Address, log } from "@graphprotocol/graph-ts";
import { Hypervisor as HypervisorContract } from "../../generated/HypeRegistry/Hypervisor";
import { UniswapV3Pool as UniswapV3PoolContract } from "../../generated/HypeRegistry/UniswapV3Pool";
import { AlgebraPool as AlgebraPoolContract } from "../../generated/HypeRegistry/AlgebraPool";
import { Hypervisor as HypervisorTemplate } from "../../generated/templates";
import { Hypervisor } from "../../generated/schema";
import { getOrCreateHypervisor, getOrCreateProtocol } from "./entities/general";
import { PROTOCOL_ALGEBRA } from "./constants";

export function processHypeAdded(hypervisorAddress: Address): void {
  let hypervisor = Hypervisor.load(hypervisorAddress);

  if (hypervisor) {
    return;
  }

  let hypervisorContract = HypervisorContract.bind(hypervisorAddress);
  let test_amount = hypervisorContract.try_getTotalAmounts();
  if (test_amount.reverted) {
    log.warning("Could not add {}, does not appear to be a hypervisor", [
      hypervisorAddress.toHex(),
    ]);
    return;
  }

  const protocol = getOrCreateProtocol();
  if (protocol.underlyingProtocol == PROTOCOL_ALGEBRA) {
    const algebraPoolContract = AlgebraPoolContract.bind(
      hypervisorContract.pool()
    );
    const test_globalState = algebraPoolContract.try_globalState();
    if (test_globalState.reverted) {
      log.warning(
        "Pool associated with {} does not appear to be a valid algebra pool",
        [hypervisorAddress.toHex()]
      );
      return;
    }
  } else {
    const uniswapPoolContract = UniswapV3PoolContract.bind(
      hypervisorContract.pool()
    );
    const test_slot0 = uniswapPoolContract.try_slot0();
    if (test_slot0.reverted) {
      log.warning(
        "Pool associated with {} does not appear to be a valid uniswap pool",
        [hypervisorAddress.toHex()]
      );
      return;
    }
  }

  hypervisor = getOrCreateHypervisor(hypervisorAddress);
  hypervisor.onRegistry = true;
  hypervisor.save();

  HypervisorTemplate.create(hypervisorAddress);
}
