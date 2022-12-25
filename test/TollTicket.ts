/**
 * @file Тесты и примеры использования NFT билета за проезд.
 *
 * @author Искандаров Эдуард
 */
import { ethers } from "hardhat";
import { expect } from "chai";
import {
  deployEnsResolverFixture,
  setAddressFunc,
} from "./deploy-ens-resolver.fixture";

describe("TollTicket", () => {
  // `setAddress` - функция для регистрации домена в ENS.
  let setAddress: setAddressFunc;

  beforeEach(async () => {
    // Перед запуском каждого сценария теста, разворачиваем ENS инфраструктуру.
    const ensItems = await deployEnsResolverFixture();
    setAddress = ensItems.setAddress;
  });

  it("Should give toll ticket to vehicle", async () => {
    /**
     * Определим блокчейн аккаунты для цифровых двойников
     * - авторизованный аккаунт для выпуска билетов
     * - автомобиль
     */
    const [tollTicketAccount, vehicleAccount] = await ethers.getSigners();

    // Разместим в тестовую сеть смарт контракт `TollTicket`.
    const TollTicket = await ethers.getContractFactory("TollTicket");
    const tollTicket = await TollTicket.connect(tollTicketAccount).deploy();

    // Зададим тестовый номер автомобиля и соответствующий ему ENS домен.
    const plateNumber = "A592CY02RUS";
    const plateNumberDomain = `${plateNumber}.gibdd`;

    // Регистрируем домен номера автомобиля в ENS.
    await setAddress(plateNumberDomain, vehicleAccount.address);

    // Для целей тестирования минуя оплату,
    // отправим токен билета на проезд на аккаунт автомобиля.
    const { value: tokenId } = await tollTicket.sendTicket(
      vehicleAccount.address,
    );

    // Убедимся, что крипто адрес автомобиля определяется по регистрационному ТС.
    // Такую же операцию проводит программное обеспечение КПП.
    const resolvedVehicleAddress = await ethers.provider.resolveName(
      plateNumberDomain,
    );

    // Убедимся, что адрес владельца токена и адрес на который указывает домен - один и тот же.
    expect(await tollTicket.ownerOf(tokenId)).to.be.equal(
      resolvedVehicleAddress,
    );

    // Проверим, что ссылка на метаданные токена соответствует шаблону.
    expect(await tollTicket.tokenURI(tokenId)).to.be.equal(
      `https://nft.goznak.ru/toll-ticket/metadata/${tokenId.toString()}`,
    );

    // Проверки `ERC721Enumerable` дополнения.
    // Количество билетов на балансе аккаунте автомобиля должно быть = 1
    expect(await tollTicket.balanceOf(vehicleAccount.address)).to.be.equal(1);

    // Идентификатор токена билета автомобиля должен соответствовать ранее выпущенному.
    const vehicleTokenAt0 = await tollTicket.tokenOfOwnerByIndex(
      vehicleAccount.address,
      0,
    );
    expect(vehicleTokenAt0).to.be.equal(tokenId);
  });
});
