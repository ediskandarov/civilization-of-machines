/**
 * @file Вспомогательный файл для разворачивания ENS инфраструктуры.
 * 
 * @author Искандаров Эдуард
 */
import { ethers, ensMock } from "hardhat";
import { isAddress } from "@ethersproject/address";
import { namehash } from "@ethersproject/hash";
import { ENS_REGISTRY_ADDRESS } from "hardhat-ens-mock/dist/src/constants";

export async function deployEnsResolverFixture() {
  // Workaround for ethers network issue
  ethers.provider._networkPromise.then(
    (network) => (network.ensAddress = ENS_REGISTRY_ADDRESS),
  );

  const { provider } = ethers;
  // const ensAddress = provider.network.ensAddress!;
  const ensAddress = ENS_REGISTRY_ADDRESS;
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
      if (!isAddress(address))
        throw new Error(`${address} is not a valid address`);

      const node = namehash(domain);
      // Set domain owner and domain resolver
      await ensMock.setDomainOwner(domain, firstAccountAddress);

      // @todo what's difference between mock call and using contract?
      // @todo we can potentially ENS contract hacks and `hardhat-abi-exporter`
      // dependency by using `ensMock.setDomainResolver`
      // await ensMock.setDomainResolver(domain, resolver.address);
      await ens.connect(firstAccount).setResolver(node, resolver.address);

      await resolver.functions["setAddr(bytes32,address)"](node, address);
    },
  };
}

export type setAddressFunc = Awaited<
  ReturnType<typeof deployEnsResolverFixture>
>["setAddress"];
