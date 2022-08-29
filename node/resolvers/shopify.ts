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
        }
    },
    Mutation:{
        createSellerOnMarketplace:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop,catalog,masterdata}
            } = ctx

            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
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
                
            // return catalog.createSeller(ConvertedSellerData,token)

            
        },
        syncProductsWithMarketplace:async (_:any,{apiKey,apiPassword,shopifyStoreName}:{apiKey:String,apiPassword:String,shopifyStoreName:String},ctx:any) =>{
            const {
                clients:{ShopifyShop,suggestion,catalog}
            } = ctx
            const token = 'ADMIN_TOKEN'
            const result = await ShopifyShop.getShopConfiguration(apiKey,apiPassword,shopifyStoreName)
            const shopifyProducts = await ShopifyShop.getProducts(apiKey,apiPassword,shopifyStoreName)
            // console.log(result.shop.id)
            const transformedProduct = await shopifyProducts?.products.map((item:any)=>{
                    // const convertedImages:Image[] = item.images.map((itemTwo:any)=>{
                    //         const tempImage:Image = {
                    //             ImageName:item.title,
                    //             ImageUrl:itemTwo.src
                    //         } 
                    //     return tempImage
                    // }
                       
                    // )

                    let tempVariants = item.variants.map((variants:any)=>{
                         const filteredImage =   item?.images.filter((itemImage:any)=>{return variants.image_id === itemImage.id})
                         const ImageToAdd:Image[] = filteredImage?.map((filterImage:any)=>{return {ImageName:String(filterImage.id),ImageUrl:filterImage.src}})
                         const temp = TransformSkuSuggestion(item,variants,result.shop.id as string, ImageToAdd)
                         return temp
                    })

                    console.log(tempVariants)
                    // const temp = TransformSkuSuggestion(item,result.shop.id as string, convertedImages)
                    return tempVariants
            })
            const productToSend = transformedProduct[0]
            // try {
            //     await catalog.changeNotification({
            //         sellerId: result.shop.id as string,
            //         sellerSkuId: productToSend[0]?.SellerStockKeepingUnitId as string,
            //     })
            //     ctx.body = 'SKU already exists on Marketplace'
            //     ctx.status = 304
                
            // } catch (e) {
            //     if (e.response.status === 404) {
            //       suggestion.sendSkuSuggestion(productToSend[0],token)            
            //       ctx.body = 'Suggestion was successfully sent'
            //       ctx.status = 200                
            //     } else {
            //       // eslint-disable-next-line no-console
            //       console.log(`Error: ${e.response.message}`)
            //     }
            //   }

             productToSend.forEach(async(item:any)=>{
                
                try {
                     await catalog.changeNotification({
                        sellerId: result.shop.id as string,
                        sellerSkuId: item.SellerStockKeepingUnitId as string,
                    })
                    ctx.body = 'SKU already exists on Marketplace'
                    ctx.status = 304
                    
                } catch (e) {
                    if (e.response.status === 404) {
                      suggestion.sendSkuSuggestion(item,token)            
                      ctx.body = 'Suggestion was successfully sent'
                      ctx.status = 200                
                    } else {
                      // eslint-disable-next-line no-console
                      console.log(`Error: ${e.response.message}`)
                    }
                  }
            })
                


            // const token = 'ADMIN_TOKEN'
            
            // const ConvertedSellerData = TransformSeller(result.shop);
            //     console.log(ConvertedSellerData)
            //     return catalog.createSeller(ConvertedSellerData,token)

            
        }
    }
}