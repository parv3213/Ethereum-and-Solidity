const HDWalletProvider = require ('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledfactory  = require ('./build/Campaignfactory.json');

const provider = new HDWalletProvider(
    'local useless film shield gas mention stairs post side script slender flight',  
    'https://rinkeby.infura.io/v3/d86472cd92044b469829164e5ba4c51e'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result= await new web3.eth
        .Contract(JSON.parse(compiledfactory.interface))
        .deploy({ data: '0x' + compiledfactory.bytecode})
        .send({gas : '1000000', from : accounts[0]});

    console.log('Contract deployed to', result.options.address);
};
deploy();

