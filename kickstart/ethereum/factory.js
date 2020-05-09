import web3 from './web3.js';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x29f7669dC28CF56030c66314ce6135C1055CDCc6'
);

export default instance;