import { SuggestionRequest , Image} from '@vtex/clients'

export const TransformSkuSuggestion=(input:any,variants:any,sellerId:string,image:Image[])=>{
    let transformedObject={
         
         ProductId:String(input.id),
         BrandName:input.vendor,
         CategoryFullPath:`${"yes"}`,
         EAN:[variants.barcode],
         Height:0,
         Images:image,
         SellerId:sellerId,
         Length:0,
         ListPrice:variants.price,
         Price:variants.price,
         ProductDescription:input.body_html,
         ProductName:input.title,
         ProductSpecifications:input.options,
         RefId:'',
         SellerStockKeepingUnitId:variants.id,
         SkuName:variants.title,
         SkuSpecifications:input.options,
         WeightKg:0,
         Width:0,
         AvailableQuantity:variants.inventory_quantity,
         Pricing: {
            Currency: "INR",
            SalePrice: variants.price,
            CurrencySymbol: "Rs"
       }
    }
    
    return transformedObject
}