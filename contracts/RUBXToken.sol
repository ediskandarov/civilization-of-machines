/**
 * @file Токен смарт контракт(ERC20) цифрового рубля.
 * Смарт контракт сгенерирован с использованием OpenZeppelin Contracts Wizard.
 * Из особенностей - использование EIP-2612 для оплаты в одну транзакцию.
 * 
 * @see https://docs.openzeppelin.com/contracts/4.x/erc20
 * @see https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit
 * @see https://wizard.openzeppelin.com/#erc20
 * @see https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
 * @see https://eips.ethereum.org/EIPS/eip-2612
 * 
 * @author Искандаров Эдуард
 */
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract RUBXToken is ERC20, ERC20Permit {
  constructor(
    uint256 initialSupply
  )
    ERC20("Digital Russian Ruble", "RUBX")
    ERC20Permit("Digital Russian Ruble")
  {
    _mint(msg.sender, initialSupply);
  }

  /*
   * Рубль делится на 100 копеек. Токен хранит значения в наименьшем номинале.
   * 1 РУБ = 100 копеек, экспонента рубля = 2.
   */
  function decimals() public view virtual override returns (uint8) {
    return 2;
  }
}
