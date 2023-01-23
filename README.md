<p align="center">
  <a href="https://www.bloom.trade/">
    <img alt="babel" src="https://www.bloom.trade/logo.svg" width="546">
  </a>
</p>

<h1 align="center">
  Boost your business checking out with crypto
</h1>

<p align="center">Supported wallets</p>

<p align="center">
  <a href="https://www.binance.com/en"><img alt="Binance logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Binance_Logo.svg/2048px-Binance_Logo.svg.png" width="50" /></a>
  <a href="https://www.coinbase.com/"><img alt="Coinbase logo" src="https://i.seadn.io/gae/YW6CQaHLhbh4FydpShgQUqBU_RJUqpeYh9twG3BB8PlwgSjyucmWVlEeddKjLXChk7CSHDUEcTjIAlHRMtT8_ztOm5QjU08Q7KqImw?auto=format&w=1000" width="50" /></a>
  <a href="https://metamask.io/"><img alt="Metamask logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" width="50" /></a>
   <a href="https://trustwallet.com/"><img alt="Trust logo" src="https://trustwallet.com/assets/images/media/assets/TWT.png" width="50" /></a>
   <a href="https://walletconnect.com/"><img alt="Wallet connect protocol" src="https://workablehr.s3.amazonaws.com/uploads/account/open_graph_logo/492879/social?1667288171000" width="70" /></a>
</p>

## Intro

Bloom is a set of tools that allow you to accept crypto payments in your store. We have a set of public packages to be integrated bloom in your own in your own custom checkout.

## Monorepo get started 🎬🎬

This is a monorepo, so you need to install all the dependencies in the root folder.

```bash
yarn setup
```

## Packages

- [bloom-themes](./packages/bloom-themes) - Bloom Themes and custom visuals
- [bloom-react-sdk](./packages/bloom-react-sdk) - Bloom SDK
- [bloom-utilities](./packages/bloom-utilities) - Bloom Utils to be used freely
- [bloom-erp](./packages/bloom-erp) - Bloom connector with erps
- [bloom-positions-connector](./packages/bloom-positions-connector) - Bloom connector that allows you to get your balances in different providers

## Husky 🐕 and Lerna 🐉

We use husky and lerna to manage the hooks and the packages. You can find the hooks in the root folder.

```bash
git commit -m "commit message"
```

Before each commit, husky will run the builder and the linter. If you want to skip the hooks, you can use the flag --no-verify.

```bash
git commit -m "commit message" --no-verify
```

## Graph of monorepo 📊

```bash
yarn graph
```

## License

[MIT](./LICENSE)
