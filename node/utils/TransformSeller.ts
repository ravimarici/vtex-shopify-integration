import { Seller } from '@vtex/clients'

interface SellerGraphqlVars {
    seller: Seller
  }
export const TransformSeller=(input:any)=>{
    let newObject:Seller = {
        SellerId:String(input.id),
        CatalogSystemEndpoint:String(null),
        CSCIdentification:String(null),
        Email:input.email,
        FreightCommissionPercentage:0,
        Name:input.name,
        FulfillmentEndpoint:"https://"+input.domain,
        ProductCommissionPercentage:0,
        UseHybridPaymentOptions:false
   }

    return newObject
}