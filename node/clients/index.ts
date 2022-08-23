import { IOClients } from '@vtex/api'
import ShopifyClient from './Shopify'
import {Catalog,Suggestions } from '@vtex/clients'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get ShopifyShop() {
        return this.getOrSet('Shopify',ShopifyClient)
    }

    public get catalog() {
        return this.getOrSet('catalog', Catalog)
      }

    public get suggestion() {
        return this.getOrSet('suggestion',Suggestions)
    }  

}
