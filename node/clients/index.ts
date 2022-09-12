import { IOClients } from '@vtex/api'
import ShopifyClient from './Shopify'
import LogisticsClient  from './logistics'
import {Catalog,Suggestions } from '@vtex/clients'
import SkuBindingsClient from './SkuBindings'
import PricesClient from './Prices'

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

    public get myLogistics() {
        return this.getOrSet('logistics', LogisticsClient)
      }

    public get skuBindings(){
        return this.getOrSet('sku Binding', SkuBindingsClient)
    }  

    public get prices(){
        return this.getOrSet('Prices',PricesClient)
    }

}



