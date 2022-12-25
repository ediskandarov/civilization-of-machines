import { ethers } from "hardhat";
/**
 * @file Тесты и примеры использования цифрового двойника АЗС.
 *
 * @author Искандаров Эдуард
 */
import { signERC2612Permit } from "eth-permit";
import { expect } from "chai";

describe("FuelStation", () => {
  it("Should be able for vehicle to purchase fuel", async () => {
    /**
     * Определим блокчейн аккаунты для цифровых двойников
     * - Центробанк(ЦБР)
     * - АЗС
     * - автомобиль
     */
    const [cbrAccount, fuelStationAccount, consumerVehicleAccount] =
      await ethers.getSigners();

    // Разместим в тестовую сеть смарт контракт `RUBXToken`.
    const RUBXToken = await ethers.getContractFactory("RUBXToken");
    const rubxToken = await RUBXToken.connect(cbrAccount).deploy(1_000_000_00); // Эмиссий 1 млн. рублей

    // Разместим в тестовую сеть смарт контракт `FuelRegistry`.
    const FuelRegistry = await ethers.getContractFactory("FuelRegistry");
    const fuelRegistry = await FuelRegistry.connect(
      fuelStationAccount,
    ).deploy();

    // Разместим в тестовую сеть смарт контракт `FuelStation`.
    const FuelStation = await ethers.getContractFactory("FuelStation");
    const fuelStation = await FuelStation.connect(fuelStationAccount).deploy(
      rubxToken.address,
      fuelRegistry.address,
    );

    // Для целей тестирования, передадим 10 тыс. рублей на аккаунт автомобиля.
    await rubxToken.transfer(consumerVehicleAccount.address, 10_000_00);

    // Минуя цепочку поставки, сразу наполним АЗС на 100 тыс. литров дизеля.
    await fuelRegistry.mint(
      fuelStation.address,
      fuelRegistry.DIESEL(),
      100_000,
      "0x", // Последний аргумент не используется - передаем пустые данные.
    );

    // Убедимся, что в реестра топлива на балансе АЗС числится 100 тыс. литров дизельного топлива.
    expect(
      await fuelRegistry.balanceOf(fuelStation.address, fuelRegistry.DIESEL()),
    ).to.be.equal(100_000);

    // Процесс покупки топлива автомобилем.
    // Для того, чтобы смарт контракт АЗС смог получить оплату за топливо,
    // покупатель должен сформировать цифровую подпись на отправку токенов цифрового рубля.
    const permit = await signERC2612Permit(
      ethers.provider,
      rubxToken.address,
      consumerVehicleAccount.address,
      fuelStation.address,
      1_000_00,
    );

    // Автомобиль покупает дизельное топливо на 1 тыс. рублей у АЗС.
    await fuelStation
      .connect(consumerVehicleAccount)
      .purchaseFuel(
        fuelRegistry.DIESEL(),
        consumerVehicleAccount.address,
        fuelStation.address,
        1_000_00,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
      );

    // Проверим, что баланс токенов цифрового рубля у автомобиля уменьшился на 1 тыс.
    expect(
      await rubxToken.balanceOf(consumerVehicleAccount.address),
    ).to.be.equal(9_000_00);

    // Количество дизельного топлива у автомобиля по данным реестра должно увеличиться.
    expect(
      await fuelRegistry.balanceOf(
        consumerVehicleAccount.address,
        fuelRegistry.DIESEL(),
      ),
    ).to.be.equal(18);

    // АЗС должна получить токены цифрового рубля за продажу топлива.
    expect(await rubxToken.balanceOf(fuelStation.address)).to.be.equal(
      1_000_00,
    );

    // Количество токенов дизельного топлива на балансе АЗС должно уменьшиться на объем заправки.
    expect(
      await fuelRegistry.balanceOf(fuelStation.address, fuelRegistry.DIESEL()),
    ).to.be.equal(99_982);
  });
});
