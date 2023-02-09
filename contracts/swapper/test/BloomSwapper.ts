const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("BloomSwapper", function () {
    let swapFactory, swap: any;
    this.beforeEach(async () => {
        swapFactory = await ethers.getContractFactory("BloomSwapper");
        swap = await swapFactory.deploy();
    });
    //Run tests here
});
