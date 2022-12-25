/**
 * @file Смарт контракт АЗС. АЗС принимает токены `RUBXToken` для оплаты топлива.
 * В ответ на оплату, АЗС отправляет токены топлива, что должно быть отражено в реальном мире
 * заправкой автомобиля.
 * АЗС участвует в цепочке поставки топлива и может принимать токены топлива от топливозаправщиков.
 *
 * @see https://docs.openzeppelin.com/contracts/4.x/erc1155#sending-to-contracts
 *
 * @author Искандаров Эдуард
 */
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import {RUBXToken} from "./RUBXToken.sol";
import {FuelRegistry} from "./FuelRegistry.sol";

contract FuelStation is ERC1155Holder {
  RUBXToken _rubxToken;
  FuelRegistry _fuelRegistry;

  /**
   * Конструктор инициализируется ссылками на контракты токенов цифрового рубля
   * и токена с реестром топлива.
   *
   * @param rubxToken - Ссылка на смарт контракт токенов цифрового рубля.
   * @param fuelRegistry - Ссылка на смарт контракт токенов реестра топлива.
   */
  constructor(RUBXToken rubxToken, FuelRegistry fuelRegistry) {
    _rubxToken = rubxToken;
    _fuelRegistry = fuelRegistry;
  }

  /**
   * Возвращает цену топлива по продукт коду.
   *
   * @param fuelProductCode - Продукт код марки топлива.
   */
  function getFuelPrice(
    uint256 fuelProductCode
  ) public view returns (int64 price) {
    if (fuelProductCode == _fuelRegistry.AI_92_K5()) {
      return 45_00;
    } else if (fuelProductCode == _fuelRegistry.AI_95_K5()) {
      return 50_00;
    } else if (fuelProductCode == _fuelRegistry.DIESEL()) {
      return 55_00;
    } else {
      return -1;
    }
  }

  /**
   * Покупка топлива автомобилем.
   *
   * @param fuelProductCode - Продукт код марки топлива.
   * @param vehicle - Крипто адрес автомобиля покупателя.
   * @param station - Крипто адрес АЗС.
   * @param value - Количество токенов цифрового рубля для оплаты топлива.
   * @param deadline, v, r, s - Компоненты цифровой подписи покупки.
   */
  function purchaseFuel(
    uint256 fuelProductCode,
    address vehicle,
    address station,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    // Проверка соответствия адреса АЗС и адреса смарт контракта в цифровой подписи.
    require(
      station == address(this),
      "`station` should be fuel station contract address"
    );

    // Разрешение покупателем на перевод докенов цифрового рубля для покупки.
    // @see https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit
    _rubxToken.permit(vehicle, station, value, deadline, v, r, s);

    // После разрешения, смарт контракт АЗС может перевести себе токены
    // цифрового рубля в качестве оплаты топлива.
    _rubxToken.transferFrom(vehicle, station, value);

    // Расчет стоимости топлива.
    int64 fuelPrice = getFuelPrice(fuelProductCode);
    require(fuelPrice > 0, "Invalid fuel price or fuel product code");

    // Расчет количества топлива для заправки автомобиля.
    uint256 fuelAmount = value / SafeCast.toUint256(fuelPrice);

    // Перевод токенов топлива отражает заправку. Вместе с отправкой токенов,
    // АЗС активирует бензоколонку для заправки автомобиля. 
    _fuelRegistry.safeTransferFrom(
      station,
      vehicle,
      fuelProductCode,
      fuelAmount,
      "0x" // Последний аргумент не используется - передаем пустые данные.
    );
  }
}
