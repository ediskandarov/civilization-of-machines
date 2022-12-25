/**
 * @file Тесты и примеры использования магазина NFT билетов за проезд.
 *
 * @author Искандаров Эдуард
 */
import { ethers } from "hardhat";
import { expect } from "chai";
import { signERC2612Permit } from "eth-permit";

describe("TollTicketShop", () => {
  it("should allow vehicle to purchase toll ticket", async () => {
    /**
     * Определим блокчейн аккаунты для цифровых двойников
     * - Центробанк(ЦБР)
     * - авторизованный аккаунт для выпуска билетов
     * - аккаунт магазина билетов
     * - автомобиль
     */
    const [cbrAccount, tollTicketAccount, tollTicketShopOwner, vehicleAccount] =
      await ethers.getSigners();

    // Разместим в тестовую сеть смарт контракт `RUBXToken`.
    const RUBXToken = await ethers.getContractFactory("RUBXToken");
    const rubxToken = await RUBXToken.connect(cbrAccount).deploy(
      100_000_00, // Эмиссия 100 тыс. рублей
    );

    // Разместим в тестовую сеть смарт контракт `TollTicket`.
    const TollTicket = await ethers.getContractFactory("TollTicket");
    const tollTicket = await TollTicket.connect(tollTicketAccount).deploy();

    // Разместим в тестовую сеть смарт контракт `TollTicketShop`.
    const TollTicketShop = await ethers.getContractFactory("TollTicketShop");
    const tollTicketShop = await TollTicketShop.connect(
      tollTicketShopOwner,
    ).deploy(rubxToken.address, tollTicket.address);

    // Для целей тестирования, передадим 10 тыс. рублей на аккаунт автомобиля.
    await rubxToken.transfer(vehicleAccount.address, 10_000_00);

    // Установим стоимость билета в 200 рублей.
    const tollTicketPrice = 200_00;

    // Процесс покупки билета автомобилем.
    // Для того, чтобы смарт контракт магазина смог получить оплату за билет,
    // покупатель должен сформировать цифровую подпись на отправку токенов цифрового рубля.
    const permit = await signERC2612Permit(
      ethers.provider,
      rubxToken.address,
      vehicleAccount.address,
      tollTicketShop.address,
      tollTicketPrice,
    );

    // Автомобиль покупает билет за проезд в магазине.
    const purchaseResult = await tollTicketShop
      .connect(vehicleAccount)
      .purchaseTollTicket(
        vehicleAccount.address,
        tollTicketShop.address,
        tollTicketPrice,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
      );

    // Проверим, что в блокчейн сохранилось соответствие адреса аккаунта автомобиля для токена билета.
    const { value: tollTicketTokenId } = purchaseResult;
    expect(await tollTicket.ownerOf(tollTicketTokenId)).to.be.equal(
      vehicleAccount.address,
    );

    // Убедимся, что баланс аккаунта автомобиля уменьшился на стоимость билета.
    expect(await rubxToken.balanceOf(vehicleAccount.address)).to.be.equal(
      9_800_00,
    );

    // Баланс аккаунта магазина увеличился на стоимость билета.
    expect(await rubxToken.balanceOf(tollTicketShop.address)).to.be.equal(
      200_00,
    );

    // Дополнительно проверим, что количество NFT в контракте билетов у аккаунта автомобиля = 1.
    expect(await tollTicket.balanceOf(vehicleAccount.address)).to.be.equal(1);
  });
});
