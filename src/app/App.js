import React from 'react';
import { ethers } from 'ethers';
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk';
import Popcat from '../artifacts/contracts/Popcat.sol/Popcat.json';
import '../style/App.css';

const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_SIGNER_1, REACT_APP_SIGNER_2, REACT_APP_SIGNER_3 } = process.env;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const owners = [REACT_APP_SIGNER_1, REACT_APP_SIGNER_2, REACT_APP_SIGNER_3];
const threshold = 2;
let safeSdk, safeTransaction;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      champion: '',
      newChampion: '',
      safeAddress: '',
      oldSafeAddress: '',
      signers: []
    };
    this.getChampion = this.getChampion.bind(this);
    this.createSafe = this.createSafe.bind(this);
    this.setSafeAddress = this.setSafeAddress.bind(this);
    this.sign = this.sign.bind(this);
    this.execute = this.execute.bind(this);
  }

  componentDidMount() {
    this.getChampion();
  }
  
  async getChampion() {
    const contract = new ethers.Contract(REACT_APP_CONTRACT_ADDRESS, Popcat.abi, provider);
    const champion = await contract.getChampion();
    this.setState({
      champion
    });
  }

  async createSafe() {
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ ethers, signer });
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeAccountConfig = { owners, threshold };
    safeSdk = await safeFactory.deploySafe(safeAccountConfig);
    const safeAddress = safeSdk.getAddress();
    this.setState({
      safeAddress
    });
  }

  async setSafeAddress() {
    this.setState({
      safeAddress: this.state.oldSafeAddress
    });
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ ethers, signer });
    safeSdk = await Safe.create({ ethAdapter, safeAddress: this.state.safeAddress });
  }

  async sign() {
    if (!safeTransaction) {
      const contract = new ethers.Contract(REACT_APP_CONTRACT_ADDRESS, Popcat.abi, provider);
      const transactions = [{
          to: REACT_APP_CONTRACT_ADDRESS,
          value: '0',
          data: contract.interface.encodeFunctionData('updateChampion', [this.state.newChampion]),
          safeTxGas: 0
      }];
      safeTransaction = await safeSdk.createTransaction(...transactions);
    }

    // Sign the transaction off-chain
    await safeSdk.signTransaction(safeTransaction);

    const signers = [];
    safeTransaction.signatures.forEach(element => {
      signers.push(element.signer);
    });
    this.setState({
      signers
    });
  }

  async execute() {      
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ ethers, signer });
    const safeSdk2 = await safeSdk.connect({ ethAdapter, safeAddress: this.state.safeAddress });
    await safeSdk2.executeTransaction(safeTransaction);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app-body">
          <div className="app-form">
            <div className="form-container">
              <div className="form-title">Current Popcat champion: {this.state.champion}</div>
              <button onClick={this.getChampion}>Refresh</button>
            </div>
            <div className="form-container">
              <div className="form-title">Gnosis Safe address: {this.state.safeAddress}</div>
              <button className="form-row" onClick={this.createSafe}>Create Safe</button>
              <input className="input-l" id="oldSafeAddress" onChange={e => this.handleChange(e)} placeholder="Safe address" />
              <button className="btn-padding" onClick={this.setSafeAddress}>Add Existing Safe</button>
            </div>
            <div className="form-container">
              <div className="form-title">Set new champion:</div>
              <div className="form-row">
                <input className="input-m" id="newChampion" onChange={e => this.handleChange(e)} placeholder="Country" disabled={!this.state.safeAddress} />
                <button className="btn-padding" onClick={this.sign} disabled={!this.state.safeAddress}>Sign</button>
                <button className="btn-padding" onClick={this.execute} disabled={this.state.signers.length < threshold}>Execute</button>
              </div>
              <div className="text-highlight">{`Signed by (required ${threshold} signers):`}</div>
              {this.state.signers.map(item => {
                return <div className="text-highlight" key={item}>{item}</div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;