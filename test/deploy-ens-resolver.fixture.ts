import { ethers, ensMock } from "hardhat";
import { getAddress, isAddress } from "@ethersproject/address";
import { namehash } from "@ethersproject/hash";

export async function deployEnsResolverFixture() {
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
