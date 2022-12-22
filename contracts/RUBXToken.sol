// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RUBXToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("Digital Russian Ruble", "RUBX") {
    _mint(msg.sender, initialSupply);
  }

  /*
   * RUB exponent is 2, allow 2 decimal fields to represent kopeck.
   * 1 RUB = 100 kopeck.
   */
  function decimals() public view virtual override returns (uint8) {
    return 2;
  }
}
