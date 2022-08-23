import { TransformSeller } from "../utils/TransformSeller"
import { TransformSkuSuggestion } from "../utils/TransformSkuSuggestion"
import { Image } from '@vtex/clients'

export const resolvers = {
    Query:{
        getShop:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop}
            } = ctx
            const token = 'ADMIN_TOKEN'
            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            
            console.log(result)
           
        }
    },
    Mutation:{
        createSellerOnMarketplace:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop,catalog}
            } = ctx

            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            const token = 'ADMIN_TOKEN'
            
            const ConvertedSellerData = TransformSeller(result.shop);
               
                return catalog.createSeller(ConvertedSellerData,token)

            
        },
        syncProductsWithMarketplace:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop,suggestion,catalog}
            } = ctx
            const token = 'ADMIN_TOKEN'
            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            const shopifyProducts = await ShopifyShop.getProducts(apiKey,apiPassword,shopifyStoreName)
            // console.log(result.shop.id)
            const transformedProduct = shopifyProducts?.products.map((item:any)=>{
                    const convertedImages:Image[] = item.images.map((itemTwo:any)=>{
                            const tempImage:Image = {
                                ImageName:item.title,
                                ImageUrl:itemTwo.src
                            } 
                        return tempImage
                    }
                       
                    )
                    const temp = TransformSkuSuggestion(item,result.shop.id as string, convertedImages)
                    return temp
            })

            console.log(transformedProduct[0])
                try {
                    await catalog.changeNotification({
                        sellerId: result.shop.id as string,
                        sellerSkuId: shopifyProducts.products[0].id as string,
                    })
                    ctx.body = 'SKU already exists on Marketplace'
                    ctx.status = 304
                } catch (e) {
                    if (e.response.status === 404) {
                      suggestion.sendSkuSuggestion(transformedProduct[0],token)            
                      ctx.body = 'Suggestion was successfully sent'
                      ctx.status = 200
                    } else {
                      // eslint-disable-next-line no-console
                      console.log(`Error: ${e.response.message}`)
                    }
                  }


            // const token = 'ADMIN_TOKEN'
            
            // const ConvertedSellerData = TransformSeller(result.shop);
            //     console.log(ConvertedSellerData)
            //     return catalog.createSeller(ConvertedSellerData,token)

            
        }
    }
}