// handlers/productHandler.js
const { connectToFabric } = require('../fabric/networkConnector');

// Handles the creation of a new product in the blockchain network
exports.registerNewProduct = async (req, res) => {
    const { productID, name, description, manufacturingDate, batchNumber } = req.body;
    try {
        const { contract, gateway } = await connectToFabric('channel2', 'supplychain', 'Producer');
        await contract.submitTransaction('CreateProduct', productID, name, description, manufacturingDate, batchNumber);
        res.status(200).json({ message: 'Product successfully created.' });
        await gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: `Error creating product: ${error.message}` });
    }
};

// Handles updating product status when received by the supplier
exports.receiveProduct = async (req, res) => {
    const { productID, supplyDate, warehouseLocation } = req.body;
    try {
        const { contract, gateway } = await connectToFabric('channel2', 'supplychain', 'Supplier');
        await contract.submitTransaction('SupplyProduct', productID, supplyDate, warehouseLocation);
        res.status(200).json({ message: 'Product successfully received by supplier.' });
        await gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: `Error receiving product: ${error.message}` });
    }
};

// Handles wholesale product updates
exports.wholesaleProductHandler = async (req, res) => {
    const { productID, wholesaleDate, wholesaleLocation, quantity } = req.body;
    try {
        const { contract, gateway } = await connectToFabric('channel3', 'supplychain', 'Wholesaler');
        await contract.submitTransaction('WholesaleProduct', productID, wholesaleDate, wholesaleLocation, quantity);
        res.status(200).json({ message: 'Product successfully processed for wholesale.' });
        await gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: `Error wholesaling product: ${error.message}` });
    }
};

// Handles querying product history
exports.fetchProductDetails = async (req, res) => {
    const { productID } = req.params;
    try {
        const { contract, gateway } = await connectToFabric('channel1', 'supplychain', 'Producer');
        const result = await contract.evaluateTransaction('QueryProduct', productID);
        res.status(200).json(JSON.parse(result.toString()));
        await gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: `Error retrieving product information: ${error.message}` });
    }
};

// Handles updating product status to "sold"
exports.markProductAsSold = async (req, res) => {
    const { productID, buyerInfo } = req.body;
    try {
        const { contract, gateway } = await connectToFabric('channel1', 'supplychain', 'Wholesaler');
        await contract.submitTransaction('UpdateProductStatus', productID, 'Sold', buyerInfo);
        res.status(200).json({ message: 'Product successfully marked as sold.' });
        await gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: `Error selling product: ${error.message}` });
    }
};
    