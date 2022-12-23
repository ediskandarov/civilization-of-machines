// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {RUBXToken} from "./RUBXToken.sol";
import {TollPass} from "./TollPass.sol";

contract TollPassShop {
  RUBXToken _rubxToken;
  TollPass _tollPass;

  constructor(RUBXToken rubxToken, TollPass tollPass) {
    _rubxToken = rubxToken;
    _tollPass = tollPass;
  }

  function purchaseTollPass(
    address vehicle,
    address shop,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public returns (uint256) {
    // Check that signature
    require(shop == address(this), "Spender should be shop contract address");

    _rubxToken.permit(vehicle, shop, value, deadline, v, r, s);
    _rubxToken.transferFrom(vehicle, shop, value);

    uint tokenId = _tollPass.sendItem(vehicle);

    return tokenId;
  }
}
