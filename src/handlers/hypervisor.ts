import {
  Deposit,
  Rebalance,
  Withdraw,
  ZeroBurn,
} from "../../generated/templates/Hypervisor/Hypervisor";
import { Hypervisor as HypervisorContract } from "../../generated/templates/Hypervisor/Hypervisor";
import { ZERO_BI } from "../helpers/constants";
import { getOrCreateHypervisorAccount } from "../helpers/entities/general";
import {
  createHypervisorDeposit,
  createHypervisorRebalance,
  createHypervisorWithdraw,
  createHypervisorZeroBurn,
} from "../helpers/entities/transaction/hypervisor";
import { updateTotalSupply } from "../helpers/hypervisor";

export function handleDeposit(event: Deposit): void {
  createHypervisorDeposit(event);
  const holderAddress = event.params.to;
  const hypervisorAccount = getOrCreateHypervisorAccount(
    event.address,
    holderAddress
  );
  if (hypervisorAccount.shares == ZERO_BI) {
    const hypervisorContract = HypervisorContract.bind(event.address);
    const shares = hypervisorContract.try_balanceOf(holderAddress);
    if (shares.reverted) {
      // Balance is zero and could not get value
      hypervisorAccount.shares = hypervisorAccount.shares.plus(
        event.params.shares
      );
    } else {
      // Got latest value so update directly
      hypervisorAccount.shares = shares.value;
    }
  } else {
    // Balance is non-zero which means already activated. Add shares as normal
    hypervisorAccount.shares = hypervisorAccount.shares.plus(
      event.params.shares
    );
  }

  hypervisorAccount.save();

  updateTotalSupply(event.address, event.params.shares);
}

export function handleWithdraw(event: Withdraw): void {
  createHypervisorWithdraw(event);
  const holderAddress = event.params.sender;
  const hypervisorAccount = getOrCreateHypervisorAccount(
    event.address,
    holderAddress
  );

  const newShares = hypervisorAccount.shares.minus(event.params.shares);

  if (newShares < ZERO_BI) {
    const hypervisorContract = HypervisorContract.bind(event.address);
    const shares = hypervisorContract.try_balanceOf(holderAddress);
    if (shares.reverted) {
      // Balance is negative and could not get value
      hypervisorAccount.shares = ZERO_BI;
    } else {
      // Got latest value so update directly
      hypervisorAccount.shares = shares.value;
    }
  } else {
    hypervisorAccount.shares = newShares;
  }

  hypervisorAccount.save();
  updateTotalSupply(event.address, ZERO_BI.minus(event.params.shares));
}

export function handleRebalance(event: Rebalance): void {
  createHypervisorRebalance(event);
}

export function handleZeroBurn(event: ZeroBurn): void {
  createHypervisorZeroBurn(event);
}
