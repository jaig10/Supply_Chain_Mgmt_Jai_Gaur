// blockchain-contract/src/product.go
package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Product defines the structure of a product in the supply chain
type Product struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	Description       string `json:"description"`
	ManufactureDate   string `json:"manufactureDate"`
	Batch             string `json:"batch"`
	Status            string `json:"status"`
	SupplyDate        string `json:"supplyDate,omitempty"`
	WarehouseLocation string `json:"warehouseLocation,omitempty"`
	WholesaleDate     string `json:"wholesaleDate,omitempty"`
	WholesaleLocation string `json:"wholesaleLocation,omitempty"`
	Quantity          int    `json:"quantity,omitempty"`
}

// AddProduct adds a new product to the ledger
func (cc *ChaincodeContract) AddProduct(ctx contractapi.TransactionContextInterface, id string, name string, description string, manufactureDate string, batch string) error {
	product := Product{
		ID:              id,
		Name:            name,
		Description:     description,
		ManufactureDate: manufactureDate,
		Batch:           batch,
		Status:          "Manufactured",
	}

	productAsBytes, err := json.Marshal(product)
	if err != nil {
		return fmt.Errorf("Failed to marshal product: %s", err.Error())
	}

	return ctx.GetStub().PutState(id, productAsBytes)
}

// SupplyProduct updates product details when received by the supplier
func (cc *ChaincodeContract) SupplyProduct(ctx contractapi.TransactionContextInterface, id string, supplyDate string, warehouseLocation string) error {
	product, err := cc.QueryProduct(ctx, id)
	if err != nil {
		return err
	}

	product.SupplyDate = supplyDate
	product.WarehouseLocation = warehouseLocation
	product.Status = "Supplied"

	productAsBytes, err := json.Marshal(product)
	if err != nil {
		return fmt.Errorf("Failed to marshal product: %s", err.Error())
	}

	return ctx.GetStub().PutState(id, productAsBytes)
}
