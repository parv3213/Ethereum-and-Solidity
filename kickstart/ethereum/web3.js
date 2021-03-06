import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    //we are in the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
}
else {
    //We are on the server or user is not running metamask
    const provider = new Web3.providers.HttpProvider( 
    'https://rinkeby.infura.io/v3/d86472cd92044b469829164e5ba4c51e'
    );

    web3 = new Web3(provider);
}

export default web3;