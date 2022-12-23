// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import {RUBXToken} from "./RUBXToken.sol";
import {GasStationSKU} from "./GasStationSKU.sol";

contract GasStationShop {
  RUBXToken _rubxToken;
  GasStationSKU _gasStationSKU;

  constructor(RUBXToken rubxToken, GasStationSKU gasStationSKU) {
    _rubxToken = rubxToken;
    _gasStationSKU = gasStationSKU;
  }

  function getGasPrice(
    uint256 gasSkuTokenId
  ) public view returns (int64 price) {
    if (gasSkuTokenId == _gasStationSKU.AI_92_K5()) {
      return 45_00;
    } else if (gasSkuTokenId == _gasStationSKU.AI_95_K5()) {
      return 50_00;
    } else if (gasSkuTokenId == _gasStationSKU.DIESEL()) {
      return 55_00;
    } else {
      return -1;
    }
  }

  function purchaseGas(
    uint256 gasSkuTokenId,
    // the following arguments are required for permit to work
    // @todo simplify, by removing addresses that we can get in runtime
    address vehicle,
    address shop,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    // Check that signature
    require(shop == address(this), "Spender should be shop contract address");

    // take payment
    _rubxToken.permit(vehicle, shop, value, deadline, v, r, s);
    _rubxToken.transferFrom(vehicle, shop, value);

    // transfer gas
    int64 gasPrice = getGasPrice(gasSkuTokenId);
    require(gasPrice > 0, "Invalid gas price");

    uint256 gasAmount = value / SafeCast.toUint256(gasPrice);
    _gasStationSKU.safeTransferFrom(
      address(this),
      vehicle,
      gasSkuTokenId,
      gasAmount,
      "0x0"
    );
  }
}
