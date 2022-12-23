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
   * RUB exponent is 2, allow 2 decimal fields to represent kopeck.
   * 1 RUB = 100 kopeck.
   */
  function decimals() public view virtual override returns (uint8) {
    return 2;
  }
}
