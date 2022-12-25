/**
 * @file Тест ENS инфраструктуры. Проверяем корректность работы.
 * Рабочая ENS нужна в смежных тестах.
 * 
 * @author Искандаров Эдуард
 */
import { ethers } from "hardhat";
import { assert } from "chai";
import { getAddress } from "@ethersproject/address";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  deployEnsResolverFixture,
  setAddressFunc,
} from "./deploy-ens-resolver.fixture";

describe("ENS", () => {
  let setAddress: setAddressFunc;

  beforeEach(async () => {
    const ensItems = await deployEnsResolverFixture();
    setAddress = ensItems.setAddress;
  });

  it("Should resolve address", async () => {
    // @todo file a ticket to hardhat
    // somehow loadFixture breaks `ethers.provider.network`
    // const { setAddress } = await loadFixture(deployEnsResolverFixture)

    const domain = "random.eth";

    // We will use the second account as a target domain address
    const [, account] = await ethers.getSigners();

    await setAddress(domain, account.address);

    const resolvedAddress = await ethers.provider.resolveName(domain);

    if (!resolvedAddress) assert(false, "Resolved address returned null");

    assert.strictEqual(
      getAddress(account.address),
      getAddress(resolvedAddress),
    );
  });

  it("Should resolve address one more time", async () => {
    const { setAddress } = await loadFixture(deployEnsResolverFixture);

    const domain = "random-2.eth";

    // We will use the third account as a target domain address
    const [, , account] = await ethers.getSigners();

    await setAddress(domain, account.address);

    const resolvedAddress = await ethers.provider.resolveName(domain);

    if (!resolvedAddress) assert(false, "Resolved address returned null");

    assert.strictEqual(
      getAddress(account.address),
      getAddress(resolvedAddress),
    );
  });
});
