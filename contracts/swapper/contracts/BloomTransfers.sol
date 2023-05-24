// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BloomTreasure.sol";

// Author: @alexFiorenza
contract BloomTransfers {
    BloomTreasure private treasure;
    address private TREASURE;
    address private DAI;
    address private USDT;
    address private USDC;
    IERC20 private dai;
    IERC20 private usdt;
    IERC20 private usdc;
    event Transfer(string text);

    constructor(address _dai, address _usdc, address _usdt, address _treasure) {
        dai = IERC20(_dai);
        DAI = _dai;
        usdt = IERC20(_usdt);
        USDT = _usdt;
        usdc = IERC20(_usdc);
        USDC = _usdc;
        treasure = BloomTreasure(_treasure);
        TREASURE = _treasure;
    }

    function getTreasureAddress() public view returns (address) {
        return TREASURE;
    }

    function minimumAmount(uint256 amount) private pure {
        require(amount > 0, "Amount must be greater than 0");
    }

    /// @notice Sends Native Currency to another address
    /// @param to The address to send ETHS to
    function sendNativeToAddress(address to) external payable {
        uint256 fee = treasure.calculateFee(msg.value);
        string memory helloWorld = "Hello World from BloomTransfers";
        require(
            address(this).balance > fee,
            "Fee is greater than the amount sent"
        );
        treasure.fundTreasureWithNativeCurrency{value: fee}();
        uint256 newAmount = msg.value - fee;
        payable(to).transfer(newAmount);
        emit Transfer(helloWorld);
    }

    /// @notice Sends DAI to another address
    /// @param to The address to send DAI to
    /// @param amount Amount to send
    function sendDAIToAddress(address to, uint256 amount) public {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            dai.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        dai.transfer(to, newAmount);
        fundTreasureWithToken("DAI", fee);
    }

    /** TETHER USDT CONTRACT FUNCTIONS */
    /// @notice Sends USDC to another address
    /// @param to The address to send USDC to
    /// @param amount Amount to send
    function sendUSDTTOAddress(address to, uint256 amount) public {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        usdt.transfer(to, newAmount);
        fundTreasureWithToken("USDT", fee);
    }

    /** USDC COIN CONTRACT FUNCTIONS */
    /// @notice Sends USDC to another address
    /// @param to The address to send USDC to
    /// @param amount Amount to send
    function sendUSDCToAddress(address to, uint256 amount) public {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        usdc.transfer(to, newAmount);
        fundTreasureWithToken("USDC", fee);
    }

    function fundTreasureWithToken(
        string memory token,
        uint256 amount
    ) private {
        if (compareStrings(token, "DAI")) {
            require(dai.transfer(TREASURE, amount), "Fee payment failed");
        }
        if (compareStrings(token, "USDC")) {
            require(usdc.transfer(TREASURE, amount), "Fee payment failed");
        }
        if (compareStrings(token, "USDT")) {
            require(usdt.transfer(TREASURE, amount), "Fee payment failed");
        }
        treasure.updateInternalBalanceOfTokens();
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
