// blockchain-contract/src/product_utils.go
package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// QueryProduct fetches product details from the ledger
func (cc *ChaincodeContract) QueryProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
	productAsBytes, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read product from ledger: %s", err.Error())
	}
	if productAsBytes == nil {
		return nil, fmt.Errorf("Product %s does not exist", id)
	}

	var product Product
	err = json.Unmarshal(productAsBytes, &product)
	if err != nil {
		return nil, fmt.Errorf("Failed to unmarshal product: %s", err.Error())
	}

	return &product, nil
}

// UpdateProductStatus updates the status of a product (e.g., Sold, Shipped)
func (cc *ChaincodeContract) UpdateProductStatus(ctx contractapi.TransactionContextInterface, id string, newStatus string) error {
	product, err := cc.QueryProduct(ctx, id)
	if err != nil {
		return err
	}

	product.Status = newStatus

	productAsBytes, err := json.Marshal(product)
	if err != nil {
		return fmt.Errorf("Failed to marshal product: %s", err.Error())
	}

	return ctx.GetStub().PutState(id, productAsBytes)
}
