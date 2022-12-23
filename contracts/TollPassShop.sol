// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {RUBXToken} from "./RUBXToken.sol";

contract TollPassShop {
  RUBXToken _rubxToken;

  constructor(RUBXToken rubxToken) {
    _rubxToken = rubxToken;
  }

  function purchaseTollPass(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    _rubxToken.permit(owner, spender, value, deadline, v, r, s);
    _rubxToken.transferFrom(owner, spender, value);
  }
}
