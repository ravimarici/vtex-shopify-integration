import { SuggestionRequest , Image} from '@vtex/clients'

export const TransformSkuSuggestion=(input:any,sellerId:string,image:Image[])=>{
    let transformedObject={
         ProductId:input.id,
         BrandName:input.vendor,
         CategoryFullPath:input.product_type,
         EAN:[input.id],
         Height:0,
         Images:image,
         SellerId:sellerId,
         Length:0,
         ListPrice:39,
         Price:40,
         ProductDescription:input.body_html,
         ProductName:input.title,
         ProductSpecifications:input.options,
         RefId:input.id,
         SellerStockKeepingUnitId:"43218314592491",
         SkuName:"Medium / Black",
         SkuSpecifications:input.options,
         WeightKg:0,
         Width:0
    }
    
    return transformedObject
}