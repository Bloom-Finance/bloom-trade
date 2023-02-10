// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BloomTreasure.sol";

contract Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {}

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {}

    function WETH() external pure returns (address) {}

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {}
}

// Author: @alexFiorenza
contract BloomSwapper {
    //TODO: Add dinamic router address
    address private constant UNISWAP_V2_ROUTER =
        0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    Router private router = Router(UNISWAP_V2_ROUTER);
    BloomTreasure private treasure;
    address private TREASURE;
    address private DAI;
    address private USDT;
    address private USDC;
    IERC20 private dai;
    IERC20 private usdt;
    IERC20 private usdc;

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

    function minimumAmount(uint256 amount) private pure {
        require(amount > 0, "Amount must be greater than 0");
    }

    function getTreasureAddress() public view returns (address) {
        return TREASURE;
    }

    /** DAI CONTRACT FUNCTIONS */

    /// @notice Swaps DAI for Native currency
    /// @param amount Amount of DAI to swap to eth
    /// @param nativeAddress Address to send eths
    /// @return Amount of eths sent
    function sendDAIToNativeAddress(
        address nativeAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            dai.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("DAI", fee);
        require(
            dai.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](2);
        path[0] = DAI;
        path[1] = router.WETH();

        uint256[] memory amounts = router.swapExactTokensForETH(
            newAmount,
            0,
            path,
            nativeAddress,
            block.timestamp
        );
        return amounts[1];
    }

    /// @notice Swaps Native currency for DAI
    /// @param daiAddress dai address to be sent the money
    /// @return Amount of DAI received
    /// @dev Native currency must be sent with the transaction in msg.value
    function sendNativeToDAIAddress(
        address daiAddress
    ) external payable returns (uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = router.WETH();
        path[1] = DAI;
        uint256 fee = treasure.calculateFee(msg.value);
        require(
            address(this).balance > fee,
            "Fee is greater than the amount sent"
        );
        treasure.fundTreasureWithNativeCurrency{value: fee}();
        uint256[] memory amounts = router.swapExactETHForTokens{
            value: msg.value - fee
        }(0, path, daiAddress, block.timestamp);
        return amounts[1];
    }

    /// @notice Swaps DAI for USDT
    /// @param amount Amount of DAI to swap
    /// @param usdtAddress usdt address to be sent the money
    /// @return Amount of USDT received
    function sendDAIToUSDTAddress(
        address usdtAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            dai.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("DAI", fee);
        require(
            dai.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = DAI;
        path[1] = router.WETH();
        path[2] = USDT;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            usdtAddress,
            block.timestamp
        );
        return amounts[2];
    }

    /// @notice Swaps DAI for USDC
    /// @param amount Amount of DAI to swap
    /// @param usdcAddress USDC address to be sent the money
    /// @return Amount of USDC received
    function sendDAIToUSDCAddress(
        address usdcAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            dai.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("DAI", fee);
        require(
            dai.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = DAI;
        path[1] = router.WETH();
        path[2] = USDC;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            usdcAddress,
            block.timestamp
        );
        return amounts[2];
    }

    /// @notice Swaps ETH for USDT
    /// @param usdtAddress USDT address to be sent the money
    /// @return Amount of USDT received
    /// @dev Native Currency must be sent with the transaction in msg.value
    function sendNativeToUSDTAddress(
        address usdtAddress
    ) external payable returns (uint256) {
        minimumAmount(msg.value);
        address[] memory path;
        path = new address[](2);
        path[0] = router.WETH();
        path[1] = USDT;
        uint256 fee = treasure.calculateFee(msg.value);
        require(
            address(this).balance > fee,
            "Fee is greater than the amount sent"
        );
        treasure.fundTreasureWithNativeCurrency{value: fee}();
        uint256[] memory amounts = router.swapExactETHForTokens{
            value: msg.value - fee
        }(0, path, usdtAddress, block.timestamp);
        return amounts[1];
    }

    /// @notice Swaps USDT for Native Currency of current blockchain
    /// @param nativeAddress ETH address to be sent the money
    /// @param amount Amount of USDT to swap
    /// @return Amount of native Currency received
    function sendUSDTToNativeAddress(
        address nativeAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDT", fee);
        require(
            usdt.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](2);
        path[0] = USDT;
        path[1] = router.WETH();

        uint256[] memory amounts = router.swapExactTokensForETH(
            newAmount,
            0,
            path,
            nativeAddress,
            block.timestamp
        );
        return amounts[1];
    }

    /// @notice Swaps USDT for DAI
    /// @param amount Amount of USDT to swap
    /// @param daiAddress DAI address to be sent the money
    /// @return Amount of DAI received
    function sendUSDToDAIAddress(
        address daiAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDT", fee);
        require(
            usdt.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = USDT;
        path[1] = router.WETH();
        path[2] = DAI;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            daiAddress,
            block.timestamp
        );
        return amounts[2];
    }

    /// @notice Swaps USDT for USDC
    /// @param amount Amount of USDT to swap
    /// @param usdcAddress USDC address to be sent the money
    /// @return Amount of USDC received
    function sendUSDTToUSDCAddress(
        address usdcAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDT", fee);
        require(
            usdt.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = USDT;
        path[1] = router.WETH();
        path[2] = USDC;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            usdcAddress,
            block.timestamp
        );
        return amounts[2];
    }

    /// @notice Swaps Native currency for USDC
    /// @return Amount of USDC received
    /// @param usdcAddress USDC address to be sent the money
    /// @dev Native Currency must be sent with the transaction in msg.value
    function sendNativeToUSDCAddress(
        address usdcAddress
    ) external payable returns (uint256) {
        minimumAmount(msg.value);
        address[] memory path;
        path = new address[](2);
        path[0] = router.WETH();
        path[1] = USDC;
        uint256 fee = treasure.calculateFee(msg.value);
        uint256 amountToSwap = msg.value - fee;
        treasure.fundTreasureWithNativeCurrency{value: fee}();
        uint256[] memory amounts = router.swapExactETHForTokens{
            value: amountToSwap
        }(0, path, usdcAddress, block.timestamp);
        return amounts[1];
    }

    /// @notice Swaps USDC for ETH
    /// @param amount Amount of USDT to swap
    /// @param nativeAddress ETH address to be sent the money
    /// @return Amount of Native currency received
    function sendUSDCToNativeAddress(
        address nativeAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDC", fee);
        require(
            usdc.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](2);
        path[0] = USDC;
        path[1] = router.WETH();

        uint256[] memory amounts = router.swapExactTokensForETH(
            newAmount,
            0,
            path,
            nativeAddress,
            block.timestamp
        );
        return amounts[1];
    }

    /// @notice Swaps USDC for DAI
    /// @param amount Amount of USDC to swap
    /// @param daiAddress DAI address to be sent the money
    /// @return Amount of DAI received
    function sendUSDCToDAIAddress(
        address daiAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDC", fee);
        require(
            usdc.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = USDC;
        path[1] = router.WETH();
        path[2] = DAI;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            daiAddress,
            block.timestamp
        );
        return amounts[2];
    }

    /// @notice Swaps USDC for USDT
    /// @param amount Amount of USDC to swap
    /// @param usdtAddress USDT Address to be sent the money
    /// @return Amount of USDT received
    function sendUSDCToUSDTAddress(
        address usdtAddress,
        uint256 amount
    ) external returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDC", fee);
        require(
            usdc.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = USDC;
        path[1] = router.WETH();
        path[2] = USDT;
        uint256[] memory amounts = router.swapExactTokensForTokens(
            newAmount,
            0,
            path,
            usdtAddress,
            block.timestamp
        );
        return amounts[2];
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
