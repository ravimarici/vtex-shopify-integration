# Shopify <-> Vtex Connector
## configure the shopify seller in vtex marketplace 

# Introduction

This is service api for configuring and synchronising the seller and seller information.

## Features

- Configure Seller 
- Synchronize Seller
- Synchronize Product and Catalogue 
- Synchronize Pricing and Inventory
- Fullfilment Simulator
- Order Synchronization


## Tech

Shopify <-> Vtex Connector uses below technologies

- [VTEX](https://developers.vtex.com/) - Vtex io framework
- [Graphql](https://graphql.org/) - Graphql API's
- [node.js] - evented I/O for the backend

## Installation

Dillinger requires [Node.js](https://nodejs.org/) and [VTEX CLI](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference) v10+ to run.

Using VTEX CLI link the service to your vtex workspace

```sh
cd vtex-shopify-integration-service
vtex link
```

## Plugins

used sonarqube for code quality. run below command to upload the sonar analysis issued to your local sonarqube 

```sh
cd vtex-shopify-integration-service
npm install --save-dev sonarqube-scanner
node sonarqube-scanner.js
```

access the below url for the Graphql API's
```sh
https://{vtex-account}.myvtex.com/_v/private/vtex.backend-course@0.0.2/graphiql/v1
```

## License

Private

**Private Software**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [VTEX] : <https://developers.vtex.com/>

