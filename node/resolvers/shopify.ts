import { TransformSeller } from "../utils/TransformSeller"
import { TransformSkuSuggestion } from "../utils/TransformSkuSuggestion"
import { Image } from '@vtex/clients'
import { InventoryInterface } from "../types/InventoryInput"

export const resolvers = {
    Query:{
        getShop:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop}
            } = ctx
            const token = 'ADMIN_TOKEN'
            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            
            console.log(result)
           
        },
        getSellers:async(_:any,{sellerId,size}:{sellerId:string,size:Number},ctx:any)=>{
            const {
                clients:{masterdata}
            } = ctx

            const result = await masterdata.searchDocuments({
                dataEntity:"Shopify_Seller",
                fields :["_all"],
                schema:"v0",
                pagination: {
                    page: 1,
                    pageSize: size,
                  }
            })
            
            return result
        },

        getInventory:async(_:any,{skuId}:{skuId:string},ctx:any)=>{
            const {
                clients:{myLogistics}
            } = ctx
            const token = 'ADMIN_TOKEN'

           const result =  await myLogistics.listInventoryBySku(skuId,token)

           console.log(result)  
        },

        getPricesBySku:async(_:any,{skuId}:{skuId:string},ctx:any)=>{
            const {
                clients:{prices}
            } = ctx
            const token = 'ADMIN_TOKEN'

           const result =  await prices.getPriceBySkuId(skuId,token)

           console.log(result)  
        }
    },
    Mutation:{
        createSellerOnMarketplace:async (_:any,
            {
                apiKey,
                apiPassword,
                shopifyStoreName}:
                {
                    apiKey:String,
                    apiPassword:String,
                    shopifyStoreName:String
                },
                    ctx:any) =>{
            const {
                clients:{
                    ShopifyShop,
                    catalog,
                    masterdata}
            } = ctx

            const result = await ShopifyShop.
                                        getShopConfiguration(apiKey,apiPassword,shopifyStoreName)

            const token = 'ADMIN_TOKEN'
            
            const ConvertedSellerData = TransformSeller(result.shop);
                       
            await catalog.createSeller(ConvertedSellerData,token)   
            return masterdata.createDocument({
                dataEntity:"Shopify_Seller",
                fields:{
                    id:String(result.shop.id),
                    sellerId:String(result.shop.id),
                    sellerName:String( result.shop.shop_owner),
                    sellerEmail: String(result.shop.email) ,
                    sellerAddress:String(result.shop.address1),
                    storeName:String(result.shop.name) ,
                    apiKey:String(apiKey) ,
                    apiPassword:String(apiPassword),
                } ,
                schema:"v0",
            }).then((res:any) => {
                    
                return res.DocumentId
            }).catch((err: any) => {
            console.log("Error",err.response)
            return err.response
            })
                
            

            
        },
        syncProductsWithMarketplace:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop,suggestion,catalog}
            } = ctx
            const token = 'ADMIN_TOKEN'
            let ProductMigration:any = []
            const result = await ShopifyShop.
                                        getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            const shopifyProducts = await ShopifyShop.
                                        getProducts(apiKey,apiPassword,shopifyStoreName)
            // console.log(result.shop.id)
             await shopifyProducts?.products.map((item:any)=>{
                    item.variants.map((variants:any)=>{
                         const filteredImage =   item?.images.filter((itemImage:any)=>{return variants.image_id === itemImage.id})
                         const ImageToAdd:Image[] = filteredImage?.map((filterImage:any)=>{return {ImageName:String(filterImage.id),ImageUrl:filterImage.src}})
                         const temp = TransformSkuSuggestion(item,variants,result.shop.id as string, ImageToAdd)
                         ProductMigration.push(temp)                         
                    })                                
            })
            
            
             ProductMigration.forEach(async(item:any)=>{
                
                try {
                     await catalog.changeNotification({
                        sellerId: result.shop.id as string,
                        sellerSkuId: item.SellerStockKeepingUnitId as string,
                    })
                    ctx.body = 'SKU already exists on Marketplace'
                    ctx.status = 304
                    
                } catch (e) {
                    
                    if ( //@ts-ignore 
                        e.response.status === 404) {
                      suggestion.sendSkuSuggestion(item,token)            
                      ctx.body = 'Suggestion was successfully sent'
                      ctx.status = 200                
                    } else {
                      // eslint-disable-next-line no-console 
                     //@ts-ignore
                      console.log(`Error: ${e.response.message}`)
                    }
                  }
            })
                

            
        },
        syncInventoryWithMarketplace:async(_:any,
            {
                apiKey,
                apiPassword,
                shopifyStoreName,
                sellerId
                    }:
            {   
                apiKey:String,
                apiPassword:String,
                shopifyStoreName:String,
                sellerId:String
               },
                ctx:any)=>{
                const {
                    clients:{
                        ShopifyShop,                        
                        myLogistics,
                        skuBindings
                    }
                } = ctx

                const shopifyProducts = await ShopifyShop.
                                                getProducts(apiKey,apiPassword,shopifyStoreName)
                const allSkuBindings = await skuBindings.
                                                listSkuBindingsBySellerId(sellerId)
                let InventoryUpdate:any = []
               await shopifyProducts?.products.map((item:any)=>{
                    item.variants.map((variants:any)=>{
                       allSkuBindings.filter((Bindings:any)=>(Bindings.SellerStockKeepingUnitId == variants.id))
                        .map((tempItem:any)=>{
                            InventoryUpdate.push( 
                                        {   
                                            skuId:tempItem.StockKeepingUnitId,
                                            inventory:{
                                                quantity:variants.inventory_quantity,                            
                                                unlimitedQuantity: false,
                                                dateUtcOnBalanceSystem: ""
                                            }
                                        })
                                    })
                        
                        })
               })
               InventoryUpdate.forEach((item:any)=>{
                    try{
                        
                        return myLogistics.updateInventoryBySkuIdAndWarehouseId(item.skuId,'1_1',item.inventory);
                    }catch(e){
                        //@ts-ignore
                        console.log(`Error: ${e.response.message}`)
                    }
               })

            },
        syncPricesWithMarketplace:async(_:any,
                {
                    apiKey,
                    apiPassword,
                    shopifyStoreName,
                    sellerId
                        }:
                {   
                    apiKey:String,
                    apiPassword:String,
                    shopifyStoreName:String,
                    sellerId:String
                   },
                    ctx:any)=>{
                    const {
                        clients:{
                            ShopifyShop,                        
                            prices,
                            skuBindings
                        }
                    } = ctx
    
                    const shopifyProducts = await ShopifyShop.
                                                    getProducts(apiKey,apiPassword,shopifyStoreName)
                    const allSkuBindings = await skuBindings.
                                                    listSkuBindingsBySellerId('61852483746')
                    let PriceUpdate:any = []
                   await shopifyProducts?.products.map((item:any)=>{
                        item.variants.map((variants:any)=>{
                           allSkuBindings.filter((Bindings:any)=>(Bindings.SellerStockKeepingUnitId == variants.id))
                            .map((tempItem:any)=>{
                                PriceUpdate.push( 
                                            {   
                                                skuId:tempItem.StockKeepingUnitId,
                                                price:{
                                                    costPrice:Number(variants.price),                            
                                                    markup: 0
                                                    
                                                }
                                            })
                                        })
                            
                            })
                   })

                   console.log(PriceUpdate)
                   const token = 'ADMIN_TOKEN'

                   PriceUpdate?.forEach((item:any)=>{
                        try{
                            
                            return prices.updatePricesBySkuId(item.skuId,item.price,token);
                        }catch(e){
                            //@ts-ignore
                            console.log(`Error: ${e.response.message}`)
                        }
                   })
    
                }
        
    }
}