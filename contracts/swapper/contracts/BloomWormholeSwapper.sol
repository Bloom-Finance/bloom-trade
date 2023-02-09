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
contract BloomWormholeSwapper {
    BloomTreasure private treasure;
    address private TREASURE;
    address private DAI;
    address private USDT;
    address private USDC;
    address private WDAI;
    IERC20 private dai;
    IERC20 private usdt;
    IERC20 private usdc;
    IERC20 private wdai;
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    Router private router = Router(UNISWAP_V2_ROUTER);

    constructor(
        address _dai,
        address _usdc,
        address _usdt,
        address _treasure,
        address _wdai
    ) {
        dai = IERC20(_dai);
        DAI = _dai;
        usdt = IERC20(_usdt);
        USDT = _usdt;
        usdc = IERC20(_usdc);
        USDC = _usdc;
        treasure = BloomTreasure(_treasure);
        TREASURE = _treasure;
        WDAI = _wdai;
    }

    function getTreasureAddress() public view returns (address) {
        return TREASURE;
    }

    function minimumAmount(uint256 amount) private pure {
        require(amount > 0, "Amount must be greater than 0");
    }

    function sendWormholeDAIToDAIAddress(
        uint256 amount,
        address daiAddress
    ) public returns (uint256) {
        minimumAmount(amount);
        uint256 fee = treasure.calculateFee(amount);
        uint256 newAmount = amount - fee;
        require(
            wdai.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        fundTreasureWithToken("USDT", fee);
        require(
            wdai.approve(UNISWAP_V2_ROUTER, amount),
            "Approval failed: Try approving the contract  token"
        );
        address[] memory path;
        path = new address[](3);
        path[0] = WDAI;
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
        if (compareStrings(token, "WDAI")) {
            require(wdai.transfer(TREASURE, amount), "Fee payment failed");
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
