// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BloomTreasure {
    address private DAI;
    address private USDC;
    address private USDT;
    IERC20 private dai;
    IERC20 private usdc;
    IERC20 private usdt;
    struct Token {
        uint256 balance;
    }
    struct Treasure {
        Token native;
        Token dai;
        Token usdt;
        Token usdc;
    }
    string[] private tokens = ["NATIVE", "DAI", "USDC", "USDT"];
    address[] private owners;
    uint256 private percentage = 100; // 1% in basis points
    Treasure treasure;

    constructor(
        address[] memory _owners,
        address _dai,
        address _usdc,
        address _usdt
    ) {
        //Set an array of owners that can withdrawl the balance
        owners = _owners;
        DAI = _dai;
        dai = IERC20(DAI);
        USDT = _usdt;
        usdt = IERC20(USDT);
        USDC = _usdc;
        usdc = IERC20(USDC);
    }

    function addOwner(address newOwner) public {
        bool isOwner = checkOwnership(owners, msg.sender);
        if (!isOwner) {
            revert("You are not an owner");
        } else {
            owners.push(newOwner);
        }
    }

    function deleteOwner(address ownerToDelete) public {
        bool isOwner = checkOwnership(owners, msg.sender);
        if (!isOwner) {
            revert("You are not an owner");
        } else {
            for (uint256 i = 0; i < owners.length; i++) {
                if (owners[i] == ownerToDelete) {
                    owners[i] = owners[owners.length - 1];
                    owners.pop();
                }
            }
        }
    }

    function amIAnOwner(address addressToCheck) public view returns (bool) {
        //Check if the caller is an owner
        bool ownership = checkOwnership(owners, addressToCheck);
        return ownership;
    }

    function calculateFee(uint256 amount) public view returns (uint256) {
        return (amount * percentage) / 10000;
    }

    function fundTreasureWithNativeCurrency() external payable {
        treasure.native.balance += msg.value;
    }

    function updateInternalBalanceOfTokens() public {
        treasure.dai.balance = dai.balanceOf(address(this));
        treasure.usdc.balance = usdc.balanceOf(address(this));
        treasure.usdt.balance = usdt.balanceOf(address(this));
    }

    function getPublicBalanceOfNativeCurrency() public view returns (uint256) {
        return treasure.native.balance;
    }

    function getPublicBalanceOfDAI() public view returns (uint256) {
        return treasure.dai.balance;
    }

    function getPublicBalanceOfUSDT() public view returns (uint256) {
        return treasure.usdt.balance;
    }

    function getPublicBalanceOfUSDC() public view returns (uint256) {
        return treasure.usdc.balance;
    }

    function withdrawl(
        string memory tokenToRetrieve,
        uint256 amountToRetrieve
    ) public {
        bool isOwner = false;
        isOwner = checkOwnership(owners, msg.sender);
        require(isOwner, "You are not an owner");
        if (compareStrings(tokenToRetrieve, "NATIVE")) {
            require(
                amountToRetrieve < treasure.native.balance,
                "Not enough Native Currency in the treasure"
            );
            payable(msg.sender).transfer(amountToRetrieve);
            treasure.native.balance -= amountToRetrieve;
        }
        if (compareStrings(tokenToRetrieve, "DAI")) {
            require(
                amountToRetrieve <= treasure.dai.balance,
                "Not enough DAI in the treasure"
            );
            require(
                dai.transfer(msg.sender, amountToRetrieve),
                "DAI transfer failed"
            );
            treasure.dai.balance -= amountToRetrieve;
        }
        if (compareStrings(tokenToRetrieve, "USDC")) {
            require(
                amountToRetrieve <= treasure.usdc.balance,
                "Not enough USDC in the treasure"
            );
            require(
                usdc.transfer(msg.sender, amountToRetrieve),
                "USDC transfer failed"
            );
            treasure.usdc.balance -= amountToRetrieve;
        }
        if (compareStrings(tokenToRetrieve, "USDT")) {
            require(
                amountToRetrieve <= treasure.usdt.balance,
                "Not enough USDT in the treasure"
            );
            require(
                usdt.transfer(msg.sender, amountToRetrieve),
                "USDT transfer failed"
            );
            treasure.usdt.balance -= amountToRetrieve;
        }
    }

    function checkOwnership(
        address[] memory _owners,
        address sender
    ) internal pure returns (bool) {
        bool isOwner = false;
        for (uint256 j = 0; j < _owners.length; j++) {
            if (_owners[j] == sender) {
                isOwner = true;
            }
        }
        return isOwner;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
