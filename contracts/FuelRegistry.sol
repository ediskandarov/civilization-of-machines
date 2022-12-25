/**
 * @file Мультитокен смарт контракт(ERC1155) отражающий наличие топлива разных марок у участников рынка.
 * Смарт контракт сгенерирован с использованием OpenZeppelin Contracts Wizard.
 * 
 * @see https://docs.openzeppelin.com/contracts/4.x/erc1155
 * @see https://wizard.openzeppelin.com/#erc1155
 * @see https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/
 * 
 * @author Искандаров Эдуард
 */
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuelRegistry is ERC1155, Ownable {
  /**
   * Продукт коды разных марок топлива.
   */
  uint256 public constant AI_92_K5 = 0;
  uint256 public constant AI_95_K5 = 1;
  uint256 public constant DIESEL = 2;

  /**
   * Конструктор инициализируется базовой URL для ссылки метаданных.
   */
  constructor() ERC1155("https://nft.goznak.ru/fuel-registry/metadata/") {}

  /**
   * Методы `mint` и `mintBatch` предложены OpenZeppelin Contracts Wizard.
   */
  function mint(
    address account,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public onlyOwner {
    _mint(account, id, amount, data);
  }

  function mintBatch(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public onlyOwner {
    _mintBatch(to, ids, amounts, data);
  }
}
