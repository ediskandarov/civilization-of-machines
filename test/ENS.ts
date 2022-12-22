import { ethers, ensMock } from "hardhat";
import { assert } from "chai";
import { namehash } from "@ethersproject/hash";
import { getAddress, isAddress } from "@ethersproject/address";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("ENS", () => {
  async function deployEnsResolverFixture() {
    const { provider } = ethers;
    const ensAddress = provider.network.ensAddress!;
    const ENS_ABI = require("../abi/ENS.json");

    // The first address is reserved for ENS
    const firstAccount = provider.getSigner(0);
    const firstAccountAddress = await firstAccount.getAddress();

    const Resolver = await ethers.getContractFactory("OwnedResolver");
    const resolver = await Resolver.connect(firstAccount).deploy();

    const ens = new ethers.Contract(ensAddress, ENS_ABI, provider);

    return {
      ens,
      resolver,
      setAddress: async (domain: string, address: string) => {
        if (!isAddress(address)) throw new Error(`${address} is not a valid address`);

        const node = namehash(domain);
        // Set domain owner and domain resolver
        await ensMock.setDomainOwner(domain, firstAccountAddress);

        // @todo what's difference between mock call and using contract?
        // @todo we can potentially ENS contract hacks and `hardhat-abi-exporter`
        // dependency by using `ensMock.setDomainResolver`
        // await ensMock.setDomainResolver(domain, resolver.address);
        await ens.connect(firstAccount).setResolver(node, resolver.address);

        await resolver.functions['setAddr(bytes32,address)'](node, address)
      },
    }
  }

  it("Should resolve address", async () => {
    const { setAddress } = await loadFixture(deployEnsResolverFixture)

    const domain = "random.eth";

    // We will use the second account as a target domain address
    const secondAccount = ethers.provider.getSigner(1);
    const secondAccountAddress = await secondAccount.getAddress();

    await setAddress(domain, secondAccountAddress)

    const resolvedAddress = await ethers.provider.resolveName(domain);

    if (!resolvedAddress) assert(false, "Resolved address returned null");

    assert.strictEqual(
      getAddress(secondAccountAddress),
      getAddress(resolvedAddress),
    );
  });
});
