/**
 * @file Смарт контракт магазина билетов на платную дорогу. Магазин принимает
 * токены `RUBXToken` для оплаты проезда. В ответ на оплату, магазин отправляет
 * билет на проезд в виде токена. В дальнейшем, КПП может определить наличие токена
 * через блокчейн.
 * Магазин не участвует в цепочке поставки билетов. NFT контракт
 * билетов отправляет токен напрямую автомобилю.
 *
 * @author Искандаров Эдуард
 */
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {RUBXToken} from "./RUBXToken.sol";
import {TollTicket} from "./TollTicket.sol";

contract TollTicketShop {
  RUBXToken _rubxToken;
  TollTicket _tollTicket;

  /**
   * Конструктор инициализируется ссылками на контракты токенов цифрового рубля
   * и токена с реестром топлива.
   *
   * @param rubxToken - Ссылка на смарт контракт токенов цифрового рубля.
   * @param tollTicket - Ссылка на смарт контракт токенов билета на проезд.
   */
  constructor(RUBXToken rubxToken, TollTicket tollTicket) {
    _rubxToken = rubxToken;
    _tollTicket = tollTicket;
  }

  /**
   * Покупка билета на проезд автомобилем.
   *
   * @param vehicle - Крипто адрес автомобиля покупателя.
   * @param shop - Крипто адрес АЗС.
   * @param value - Количество токенов цифрового рубля для оплаты топлива.
   * @param deadline, v, r, s - Компоненты цифровой подписи покупки.
   */

  function purchaseTollTicket(
    address vehicle,
    address shop,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public returns (uint256) {
    // Проверка соответствия адреса магазина и адреса смарт контракта в цифровой подписи.
    require(shop == address(this), "`shop` should be shop contract address");

    // Разрешение покупателем на перевод докенов цифрового рубля для покупки.
    // @see https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit
    _rubxToken.permit(vehicle, shop, value, deadline, v, r, s);

    // После разрешения, смарт контракт магазина может перевести себе токены
    // цифрового рубля в качестве оплаты билета.
    _rubxToken.transferFrom(vehicle, shop, value);

    // Отправка токена билета автомобилю.
    uint tokenId = _tollTicket.sendTicket(vehicle);

    return tokenId;
  }
}
