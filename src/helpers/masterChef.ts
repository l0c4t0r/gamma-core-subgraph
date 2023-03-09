import { Address, BigInt } from "@graphprotocol/graph-ts";
import { MasterChef as MasterChefContract } from "../../generated/templates/MasterChef/MasterChef";

export function getHypervisorFromPoolId(
  masterChefAddress: Address,
  poolId: BigInt
): Address | null {
  let masterChefContract = MasterChefContract.bind(masterChefAddress);
  const poolInfo = masterChefContract.try_poolInfo(poolId);
  if (poolInfo.reverted) {
    return null;
  }
  return poolInfo.value.getLpToken();
}
