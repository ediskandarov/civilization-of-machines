import { ethers, ensMock } from "hardhat";
import { assert } from "chai";
import { namehash } from "@ethersproject/hash";
import { getAddress } from "@ethersproject/address";

describe("ENS", () => {
  const ENS_ABI = require("../abi/ENS.json");
  const { provider } = ethers;
  const ensAddress = provider.network.ensAddress!;

  it("Should resolve address", async () => {
    const domain = "random.eth";
    const firstAccount = provider.getSigner(0);
    const firstAccountAddress = await firstAccount.getAddress();
    await ensMock.setDomainOwner(domain, firstAccountAddress);

    // We will use the second account as a target domain address
    const secondAccount = provider.getSigner(1);
    const secondAccountAddress = await secondAccount.getAddress();

    const ens = new ethers.Contract(ensAddress, ENS_ABI, provider);

    const Resolver = await ethers.getContractFactory("OwnedResolver");
    const resolver = await Resolver.connect(firstAccount).deploy();

    const node = namehash(domain);
    await ens.connect(firstAccount).setResolver(node, resolver.address);
    await resolver.functions["setAddr(bytes32,address)"](
      node,
      secondAccountAddress,
    );

    const resolvedAddress = await provider.resolveName(domain);

    if (!resolvedAddress) assert(false, "Resolved address returned null");

    assert.strictEqual(
      getAddress(secondAccountAddress),
      getAddress(resolvedAddress),
    );
  });
});
