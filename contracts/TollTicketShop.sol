// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {RUBXToken} from "./RUBXToken.sol";
import {TollTicket} from "./TollTicket.sol";

contract TollTicketShop {
  RUBXToken _rubxToken;
  TollTicket _tollTicket;

  constructor(RUBXToken rubxToken, TollTicket tollTicket) {
    _rubxToken = rubxToken;
    _tollTicket = tollTicket;
  }

  function purchaseTollTicket(
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

    uint tokenId = _tollTicket.sendTicket(vehicle);

    return tokenId;
  }
}

// passToll
//комментарии по русски в тестах и методах
