/**
 * @file Тесты и примеры использования реестра топлива.
 *
 * @author Искандаров Эдуард
 */
import { ethers } from "hardhat";
import { expect } from "chai";

describe("FuelRegistry", () => {
  it("Should transfer fuel through the delivery chain", async () => {
    /**
     * Определим блокчейн аккаунты для цифровых двойников
     * - нефтеперерабатывающего завода(НПЗ)
     * - бензовоза
     * - АЗС
     */
    const [fuelFactoryAccount, fuelTankerAccount, fuelStationAccount] =
      await ethers.getSigners();

    // Разместим в тестовую сеть смарт контракт `FuelRegistry`.
    const FuelRegistry = await ethers.getContractFactory("FuelRegistry");
    const fuelRegistry = await FuelRegistry.connect(
      fuelFactoryAccount,
    ).deploy();

    // Цифровой двойник НПЗ произвел 1 миллион литров бензина марки `АИ-95-К5`, выпустив токен.
    await fuelRegistry.mint(
      fuelFactoryAccount.address,
      fuelRegistry.AI_95_K5(),
      1_000_000,
      "0x", // Последний аргумент не используется - передаем пустые данные.
    );

    // Следом в цепочке поставки, НПЗ отгрузил топливо в бензовоз, что отразилось
    // передачей 30 тыс. токенов соответствующих топливу марки `АИ-95-К5`.
    await fuelRegistry.safeTransferFrom(
      fuelFactoryAccount.address,
      fuelTankerAccount.address,
      fuelRegistry.AI_95_K5(),
      30_000,
      "0x", // Последний аргумент не используется - передаем пустые данные.
    );

    // Далее в цепочке поставки, бензовоз отгрузил топливо на АЗС.
    // Теперь, АЗС может осуществлять продажу топлива
    await fuelRegistry.connect(fuelTankerAccount).safeTransferFrom(
      fuelTankerAccount.address,
      fuelStationAccount.address,
      fuelRegistry.AI_95_K5(),
      fuelRegistry.balanceOf(
        fuelTankerAccount.address,
        fuelRegistry.AI_95_K5(),
      ),
      "0x", // Последний аргумент не используется - передаем пустые данные.
    );

    // В заключение, убедимся что блокчейн сохранилось состояние реестра топлива,
    // отражающее все обмены токенами в цепочке поставки.
    const balances = (
      await fuelRegistry.balanceOfBatch(
        [
          fuelFactoryAccount.address,
          fuelTankerAccount.address,
          fuelStationAccount.address,
        ],
        [
          await fuelRegistry.AI_95_K5(),
          await fuelRegistry.AI_95_K5(),
          await fuelRegistry.AI_95_K5(),
        ],
      )
    ).map((balance) => balance.toNumber());

    /**
     * У НПЗ - 970 тыс. литров.
     * бензовоз - 0.
     * АЗС - 30 тыс. литров.
     */
    expect(balances).to.be.deep.equal([970_000, 0, 30_000]);
  });
});
