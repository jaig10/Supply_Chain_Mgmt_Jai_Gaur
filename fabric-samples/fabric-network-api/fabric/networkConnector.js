// fabric/networkConnector.js
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Connects to the network and retrieves the contract for a specified channel
const connectToFabric = async (channelName, contractName, organizationName) => {
    try {
        const networkConfigPath = path.resolve(__dirname, '..', 'connections', `connection-${organizationName}.json`);
        const networkConfig = JSON.parse(fs.readFileSync(networkConfigPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get(organizationName);
        if (!identity) {
            console.error(`No identity found for "${organizationName}" in the wallet.`);
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(networkConfig, { wallet, identity: organizationName, discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(contractName);

        return { contract, gateway };
    } catch (error) {
        console.error(`Error connecting to network: ${error.message}`);
        throw new Error('Network connection failed');
    }
};

module.exports = { connectToFabric };
