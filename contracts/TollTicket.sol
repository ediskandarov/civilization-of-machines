// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TollTicket is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("TollTicket", "TTK") {}

  function _baseURI() internal pure override returns (string memory) {
    return "https://nft.goznak.ru/metadata/";
  }

  function sendTicket(address vehicle) public returns (uint256) {
    uint256 newTicketId = _tokenIds.current();
    _mint(vehicle, newTicketId);
    _tokenIds.increment();
    return newTicketId;
  }

  // The following functions are overrides required by Solidity.
  // @see https://docs.openzeppelin.com/contracts/4.x/wizard

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
