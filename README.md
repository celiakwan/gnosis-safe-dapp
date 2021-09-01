# gnosis-safe-dapp
A DApp integrated with Gnosis Safe Core SDK to demonstrate how to deploy Safes, create Safe transactions, sign the transactions off-line, and execute the transactions on Rinkeby testnet using multisigs. This project serves as a submodule for [gnosis-safe-popcat](https://github.com/celiakwan/gnosis-safe-popcat).

### Version
- [React](https://reactjs.org/): 17.0.2
- [Safe Core SDK](https://gnosis-safe.io/): 0.3.1
- [MetaMask](https://metamask.io/): 10.0.2
- [ethers](https://docs.ethers.io/): 5.4.6
- [Node.js](https://nodejs.org/en/): 16.7.0

### Installation
Install Node.js.
```
brew install node
```

Install the required Node.js packages in this project including `React`, `Safe Core SDK` and `ethers`.
```
npm install
```

### MetaMask
1. Install MetaMask extension in Chrome.

2. Create 3 accounts in the MetaMask wallet. To test on Rinkeby, you may probably need to get fake ETH for your accounts from https://faucet.rinkeby.io/.

### Configuration
In the project root directory, create a `.env` file containing the addresses of the deployed Popcat smart contract and 3 signer accounts. In this example, 2 out of 3 account owners are required to sign the transactions. Since this project is created from `create-react-app`, the environment variables should start with `REACT_APP_`.
```
REACT_APP_CONTRACT_ADDRESS="0x24674C1f7403f58E2dAd2157C6782870f5d3a733"
REACT_APP_SIGNER_1="0x8ba7f1A17474590c2f42fC271EAc5e812fD610A8"
REACT_APP_SIGNER_2="0x3d54ec55B8b34f796a3c5EEc2A668B4F2e22bC28"
REACT_APP_SIGNER_3="0x6E7C3D3b970a7C36c15ef45184A04cc64d47ec06"
```

Since the DApp needs to use the ABI in the artifacts, we have to compile the smart contract from the project [gnosis-safe-popcat](https://github.com/celiakwan/gnosis-safe-popcat) so that the artifacts are output to `./src/artifacts`. To compile the smart contract, you may refer to [Installation](https://github.com/celiakwan/gnosis-safe-popcat#installation) and [Compilation](https://github.com/celiakwan/gnosis-safe-popcat#compilation).

### Get Started
Run the application.
```
npm start
```

1. Open Chrome and go to `http://localhost:3000/`. Current Popcat champion will be empty if no transactions have been executed.
    <br/>
    ![Initialization](./img/1.png)

2. Connect MetaMask to Rinkeby testnet.
    <br/>
    ![Connect to Rinkeby](./img/2.png)

3. Create a Safe and wait until the transaction is confirmed.
    <br/>
    ![Create a Safe](./img/3.png)
    <br/>
    ![Safe address](./img/4.png)

4. Set a new Popcat champion and sign the transaction with Account 1.
    <br/>
    ![Set new champion](./img/5.png)
    <br/>
    ![Sign with Account 1](./img/6.png)
    <br/>
    ![Signed by Account 1](./img/7.png)

5. Select Account 2 in MetaMask and sign the transaction with Account 2.
    <br/>
    ![Select Account 2](./img/8.png)
    <br/>
    ![Sign with Account 2](./img/9.png)
    <br/>
    ![Signed by Account 2](./img/10.png)

6. Execute the transaction.
    <br/>
    ![Execute](./img/11.png)

7. Search the transaction in https://rinkeby.etherscan.io/ using the Safe address.
    <br/>
    ![Search](./img/12.png)
    <br/>
    ![Search result](./img/13.png)

8. Click Refresh after the transaction is confirmed.
    <br/>
    ![Refresh](./img/14.png)

9. You can use the same Safe address to sign and execute more transactions.
    <br/>
    ![Add existing Safe](./img/15.png)
    <br/>
    ![Execute a new transaction](./img/16.png)