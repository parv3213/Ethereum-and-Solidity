const assert = require ('assert');
const ganache = require ("ganache-cli");
const Web3 = require ('web3');
const web3 = new Web3 (ganache.provider());

const compiledfactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach (async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledfactory.interface))
        .deploy({data: compiledfactory.bytecode})
        .send({from: accounts[0], gas: '1000000'})

    await factory.methods.createCampaign('100')
        .send({
            from: accounts[0],
            gas : '1000000'
    });
    
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), 
        campaignAddress);

});

describe('Campaigns', () => {
    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the manager', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager,accounts[0]);
    });

    it("allows  peopel to contribute money and mark the as approvers"
        , async ()=> {
            await  campaign.methods.contribute().send({
                value: 200,
                from: accounts[1]
            });
            const isContributor = await campaign.methods.approvers(accounts[1]).call();
            assert(isContributor);
        });
    
    it ("requires a minimun contribution", async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '5' 
            });
            assert(false);
        }
        catch(err){
            assert(err);
        }
    });

    it ("allows a manager to make a payment request", async () => {
        await campaign.methods.
            createRequest('Buy it', '100', accounts[1])
            .send({
                from:accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.description, 'Buy it');
    });

    it ('proccesses request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods
            .createRequest("a",web3.utils.toWei('5','ether'),accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        console.log("Hye");
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);

        });
});