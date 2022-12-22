import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-ens-mock";
import "hardhat-abi-exporter";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: ['ENS'],
    spacing: 2,
    pretty: true,
  },
};

export default config;
