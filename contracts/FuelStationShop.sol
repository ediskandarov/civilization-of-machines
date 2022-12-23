// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import {RUBXToken} from "./RUBXToken.sol";
import {FuelStationSKU} from "./FuelStationSKU.sol";

contract FuelStationShop is ERC1155Holder {
  RUBXToken _rubxToken;
  FuelStationSKU _fuelStationSKU;

  constructor(RUBXToken rubxToken, FuelStationSKU gasStationSKU) {
    _rubxToken = rubxToken;
    _fuelStationSKU = gasStationSKU;
  }

  function getFuelPrice(
    uint256 fuelSkuTokenId
  ) public view returns (int64 price) {
    if (fuelSkuTokenId == _fuelStationSKU.AI_92_K5()) {
      return 45_00;
    } else if (fuelSkuTokenId == _fuelStationSKU.AI_95_K5()) {
      return 50_00;
    } else if (fuelSkuTokenId == _fuelStationSKU.DIESEL()) {
      return 55_00;
    } else {
      return -1;
    }
  }

  function purchaseFuel(
    uint256 fuelSkuTokenId,
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
    int64 gasPrice = getFuelPrice(fuelSkuTokenId);
    require(gasPrice > 0, "Invalid gas price");

    uint256 fuelAmount = value / SafeCast.toUint256(gasPrice);
    _fuelStationSKU.safeTransferFrom(
      address(this),
      vehicle,
      fuelSkuTokenId,
      fuelAmount,
      "0x0"
    );
  }
}
