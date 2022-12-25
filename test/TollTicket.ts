import { ethers } from "hardhat";
import { expect } from "chai";
import {
  deployEnsResolverFixture,
  setAddressFunc,
} from "./deploy-ens-resolver.fixture";

describe("TollTicket", () => {
  let setAddress: setAddressFunc;

  beforeEach(async () => {
    const ensItems = await deployEnsResolverFixture();
    setAddress = ensItems.setAddress;
  });

  it("Should give toll pass to vehicle", async () => {
    const plateNumber = "A592CY02RUS";
    const plateNumberDomain = `${plateNumber}.eth`;

    // We will use the first account as owner for TollPass contract
    const [tollPassOwnerAccount, vehicleAccount] = await ethers.getSigners();

    await setAddress(plateNumberDomain, vehicleAccount.address);

    const TollTicket = await ethers.getContractFactory("TollTicket");
    const tollTicket = await TollTicket.connect(tollPassOwnerAccount).deploy();

    const vehicleAddress = await ethers.provider.resolveName("random.eth");
    if (!vehicleAddress) {
      return expect(false, "Resolved address returned null").to.be.true;
    }

    // @todo double check on metadata URI
    const { value: tokenId } = await tollTicket.sendTicket(vehicleAddress);

    // Test that token owner is the same as set in `sendItem`
    const tokenOwner = await tollTicket.ownerOf(tokenId);
    expect(tokenOwner).to.be.equal(vehicleAddress);

    // Test metadata URI
    expect(await tollTicket.tokenURI(tokenId)).to.be.equal(
      `https://nft.goznak.ru/metadata/${tokenId.toString()}`,
    );

    // Test enumerable extension
    // This case is useful to check token details
    const totalTokens = await tollTicket.balanceOf(vehicleAddress);
    expect(totalTokens.toNumber()).to.be.equal(1);
    const vehicleTokenAt0 = await tollTicket.tokenOfOwnerByIndex(
      vehicleAddress,
      0,
    );
    expect(vehicleTokenAt0).to.be.equal(tokenId);
  });
});
