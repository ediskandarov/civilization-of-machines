// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuelRegistry is ERC1155, Ownable {
  // Sample token ids
  uint256 public constant AI_92_K5 = 0;
  uint256 public constant AI_95_K5 = 1;
  uint256 public constant DIESEL = 2;

  constructor() ERC1155("https://nft.goznak.ru/metadata/") {}

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
