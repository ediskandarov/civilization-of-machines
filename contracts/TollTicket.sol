/**
 * @file NFT смарт контракт(ERC721) билетов на платную дорогу.
 * Смарт контракт сгенерирован с использованием OpenZeppelin Contracts Wizard.
 * 
 * @see https://docs.openzeppelin.com/contracts/4.x/erc721
 * @see https://wizard.openzeppelin.com/#erc721
 * @see https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
 * 
 * @author Искандаров Эдуард
 */
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TollTicket is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("TollTicket", "TTK") {}

  /**
   * Определяем базовой URL для ссылки метаданных.
   */
  function _baseURI() internal pure override returns (string memory) {
    return "https://nft.goznak.ru/toll-ticket/metadata/";
  }

  /**
   * Отправляет токен билета на автомобиль.
   * 
   * @param vehicle - Крипто адрес автомобиля покупателя
   */
  function sendTicket(address vehicle) public returns (uint256) {
    uint256 newTicketId = _tokenIds.current();
    _mint(vehicle, newTicketId);
    _tokenIds.increment();
    return newTicketId;
  }

  // Функции `_beforeTokenTransfer` и `supportsInterface` нужны для имплементации `ERC721Enumerable`.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
