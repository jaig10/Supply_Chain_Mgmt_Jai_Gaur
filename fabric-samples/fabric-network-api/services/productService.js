// services/productService.js
const { connectToFabric } = require('../fabric/networkConnector');

// Service to create a new product
exports.addProduct = async (productID, name, description, manufacturingDate, batchNumber) => {
    const { contract, gateway } = await connectToFabric('channel2', 'supplychain', 'Producer');
    await contract.submitTransaction('CreateProduct', productID, name, description, manufacturingDate, batchNumber);
    await gateway.disconnect();
};

// Service to update product as supplied
exports.updateSupply = async (productID, supplyDate, warehouseLocation) => {
    const { contract, gateway } = await connectToFabric('channel2', 'supplychain', 'Supplier');
    await contract.submitTransaction('SupplyProduct', productID, supplyDate, warehouseLocation);
    await gateway.disconnect();
};

// Service to mark product as sold
exports.sellProduct = async (productID, buyerInfo) => {
    const { contract, gateway } = await connectToFabric('channel1', 'supplychain', 'Wholesaler');
    await contract.submitTransaction('UpdateProductStatus', productID, 'Sold', buyerInfo);
    await gateway.disconnect();
};
