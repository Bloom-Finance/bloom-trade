import { Web3AuthSessionPayloadSocialMedia, Web3AuthSessionPayloadWeb3 } from "../type";

function manageWeb3AuthWallets(userData: Web3AuthSessionPayloadSocialMedia | Web3AuthSessionPayloadWeb3) {
  const wallets = userData.wallets;
  const proccesedWallets: { address: string; type: "web3" | "social" }[] = [];
  wallets.forEach((wallet) => {
    if (Object.keys(wallet).includes("address")) {
      proccesedWallets.push({
        address: (wallet as any).address,
        type: "web3",
      });
    } else {
      proccesedWallets.push({
        address: (wallet as any).public_key,
        type: "social",
      });
      // Do something with the wallet.public_key
    }
  });
  return proccesedWallets;
}

function isWeb3WalletByAddress(address: string) {
  if (address.startsWith("0x")) {
    return true;
  }
  return false;
}

const formatWalletAddress = (address: string): string => {
  if (!address) return "";
  if (address.startsWith("0x")) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  return address.slice(0, 6) + "..." + address.slice(-4);
};

export { manageWeb3AuthWallets, isWeb3WalletByAddress, formatWalletAddress };
