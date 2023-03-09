import { Address, dataSource } from "@graphprotocol/graph-ts";
import { Hypervisor as HypervisorContract } from "../../../generated/templates/Hypervisor/Hypervisor";
import {
  Account,
  Hypervisor,
  HypervisorAccount,
  Protocol,
  Pool,
} from "../../../generated/schema";
import { ZERO_BI, PROTOCOL_UNISWAP_V3, VERSION } from "../constants";
import { protocolLookup } from "../lookups";
import { getOrCreateToken } from "../token";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load("0");
  if (!protocol) {
    protocol = new Protocol("0");
    let network = dataSource.network();
    if (network == "arbitrum-one") {
      network = "arbitrum";
    }
    let name = "uniswap";
    let underlyingProtocol = PROTOCOL_UNISWAP_V3;
    const protocolInfo = protocolLookup.get(
      network.concat(":").concat(dataSource.address().toHex())
    );
    if (protocolInfo) {
      name = protocolInfo.name;
      underlyingProtocol = protocolInfo.underlyingProtocol;
    }

    protocol.name = "gammaMinimal"
      .concat("-")
      .concat(name)
      .concat("-")
      .concat(underlyingProtocol)
      .concat("-")
      .concat(network)
      .concat("-")
      .concat(VERSION);
    protocol.underlyingProtocol = underlyingProtocol;
    protocol.network = network;
    protocol.version = VERSION;
    protocol.save();
  }
  return protocol;
}

export function getOrCreateAccount(accountAddress: Address): Account {
  let entity = Account.load(accountAddress);
  if (!entity) {
    entity = new Account(accountAddress);
    entity.save();
  }
  return entity;
}

export function getOrCreatePool(poolAddress: Address): Pool {
  let entity = Pool.load(poolAddress);
  if (!entity) {
    entity = new Pool(poolAddress);
    entity.save();
  }
  return entity;
}

export function getOrCreateHypervisor(hypervisorAddress: Address): Hypervisor {
  let entity = Hypervisor.load(hypervisorAddress);
  if (!entity) {
    const hypervisorContract = HypervisorContract.bind(hypervisorAddress);
    const pool = getOrCreatePool(hypervisorContract.pool());
    const token0 = getOrCreateToken(hypervisorContract.token0());
    const token1 = getOrCreateToken(hypervisorContract.token1());

    entity = new Hypervisor(hypervisorAddress);
    entity.onRegistry = false;
    entity.totalSupply = ZERO_BI;
    entity.pool = pool.id;
    entity.token0 = token0.id;
    entity.token1 = token1.id;
    entity.save();
  }
  return entity;
}

export function getOrCreateHypervisorAccount(
  hypervisorAddress: Address,
  accountAddress: Address
): HypervisorAccount {
  const id = hypervisorAddress
    .toHex()
    .concat("-")
    .concat(accountAddress.toHex());
  let entity = HypervisorAccount.load(id);
  if (!entity) {
    entity = new HypervisorAccount(id);
    const hypervisor = getOrCreateHypervisor(hypervisorAddress);
    const account = getOrCreateAccount(accountAddress);

    entity.hypervisor = hypervisor.id;
    entity.account = account.id;
    entity.shares = ZERO_BI;
    entity.save();
  }
  return entity;
}
