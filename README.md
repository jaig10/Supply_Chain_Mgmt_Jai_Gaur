
---

# Supply Chain Management System on Hyperledger Fabric

This project implements a decentralized **Supply Chain Management System** using **Hyperledger Fabric 2.4.9**. The system tracks products across their lifecycle from creation to sale, involving three organizations: **Producer**, **Supplier**, and **Wholesaler**. The project supports interaction with multiple channels, and provides a set of REST APIs for interacting with the blockchain network using the **Fabric SDK** in **Node.js**.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Network Setup](#1-network-setup)
  - [2. Chaincode Deployment](#2-chaincode-deployment)
  - [3. API Development](#3-api-development)
- [REST API Endpoints](#rest-api-endpoints)
- [Chaincode Functions](#chaincode-functions)
- [Testing with Postman](#testing-with-postman)

---

## Project Overview

This project provides a robust, blockchain-based supply chain management system where products move through the following stages:

1. **Producer** creates a product and adds details such as product ID, name, description, manufacturing date, and batch number.
2. **Supplier** receives products from the Producer, updates the product details with supply date and warehouse location.
3. **Wholesaler** receives the products from the Supplier, updates the product with wholesale date, location, and quantity.
4. Any organization can query the complete history of the product to trace its journey from creation to sale.
5. The system also includes a feature for updating the product status to `sold`, marking the completion of its journey.

### Key Features:
- **Multiple Channels** for secure interaction between specific organizations.
- **Raft Consensus** for ordering service.
- **Fabric Gateway & REST APIs** to interact with the blockchain network.
- **Chaincode** implemented in **Go** for tracking the product lifecycle.

---

## Architecture

The project involves the following core components:

- **Organizations**: Producer, Supplier, and Wholesaler, each with 2 peers.
- **Orderers**: Raft-based ordering service with 3 orderer nodes.
- **Channels**:
  - **Channel 1**: All organizations (for product queries and final sale).
  - **Channel 2**: Between Producer and Supplier.
  - **Channel 3**: Between Producer and Wholesaler.
- **Chaincode**: Written in Go, deployed on all three channels, with different endorsement policies for each channel.
- **REST APIs**: Developed using Fabric SDK (Node.js) to interact with the smart contract.

---

## Prerequisites

To run this project, you'll need the following:

- **Docker** and **Docker Compose** installed.
- **Node.js** (version 14 or higher) and **npm**.
- **Hyperledger Fabric 2.4.9** binaries and Docker images.
- **Postman** or any API testing tool for testing the REST APIs.

---

## Setup Instructions

### 1. Network Setup

1. Clone this repository:

    ```bash
    git clone https://github.com/jaig10/Supply_Chain_Mgmt_Jai_Gaur.git
    cd Supply_Chain_Mgmt_Jai_Gaur
    ```

2. Start the Hyperledger Fabric network:

    ```bash
    cd fabric-supply-chain/
    ./network.sh up
    ```

3. Generate crypto material and create the required channels:

    ```bash
    ./network.sh createChannel
    ```

### 2. Chaincode Deployment

1. Package the chaincode:

    ```bash
    ./network.sh packageChaincode
    ```

2. Install and approve the chaincode on all organizations, and commit the chaincode to the channels:

    ```bash
    ./network.sh deployChaincode
    ```

### 3. API Development

1. Navigate to the API directory:

    ```bash
    cd api/
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the API server:

    ```bash
    node app.js
    ```

---

## REST API Endpoints

Here are the main API endpoints to interact with the blockchain:

### POST /createProduct
Create a new product on **Channel 2** and **Channel 3** by the **Producer**.

- **URL**: `/api/createProduct`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "productID": "P001",
    "name": "Product1",
    "description": "First Product",
    "manufacturingDate": "2024-09-25",
    "batchNumber": "B001"
  }
  ```

### POST /supplyProduct
Update product status when received by the **Supplier** on **Channel 2**.

- **URL**: `/api/supplyProduct`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "productID": "P001",
    "supplyDate": "2024-09-28",
    "warehouseLocation": "Warehouse A"
  }
  ```

### POST /wholesaleProduct
Update product status when received by the **Wholesaler** on **Channel 3**.

- **URL**: `/api/wholesaleProduct`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "productID": "P001",
    "wholesaleDate": "2024-09-30",
    "wholesaleLocation": "Warehouse B",
    "quantity": 100
  }
  ```

### GET /queryProduct/{productID}
Query product details and its journey across the supply chain on **Channel 1**.

- **URL**: `/api/queryProduct/:productID`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "productID": "P001",
    "name": "Product1",
    "description": "First Product",
    "status": "Wholesaled",
    "history": [
      {
        "status": "Created",
        "timestamp": "2024-09-25"
      },
      {
        "status": "Supplied",
        "timestamp": "2024-09-28"
      },
      {
        "status": "Wholesaled",
        "timestamp": "2024-09-30"
      }
    ]
  }
  ```

### POST /sellProduct
Marks the product as sold by the **Wholesaler** on **Channel 1**.

- **URL**: `/api/sellProduct`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "productID": "P001",
    "buyerInfo": "Buyer ABC"
  }
  ```

---

## Chaincode Functions

- **CreateProduct**: Adds a new product to the ledger.
- **SupplyProduct**: Updates product details when the Supplier receives it.
- **WholesaleProduct**: Updates product status when received by the Wholesaler.
- **QueryProduct**: Retrieves the product history from the ledger.
- **UpdateProductStatus**: Updates the product status to "sold".

---

## Testing with Postman

1. Import the Postman collection from this repository (`postman_collection.json`).
2. Use the pre-configured requests to interact with the deployed network.
3. Make sure the API server is running at `http://localhost:3000`.
