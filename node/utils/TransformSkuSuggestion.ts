import { SuggestionRequest , Image} from '@vtex/clients'

// export const TransformSkuSuggestion=(input:any,variants:any,sellerId:string,image:Image[])=>{
//     let transformedObject={
         
//          ProductId:String(input.id),
//          BrandName:input.vendor,
//          CategoryFullPath:`${"Jeans"}`,
//          EAN:[variants.barcode],
//          Height:0,
//          Images:image,
//          SellerId:sellerId,
//          Length:0,
//          ListPrice:variants.price,
//          Price:variants.price,
//          ProductDescription:input.body_html,
//          ProductName:input.title,
//          ProductSpecifications:input.options,
//          MeasurementUnit: "un",
//          UnitMultiplier: 1,
//          RefId:variants.barcode,
//          SellerStockKeepingUnitId:variants.id,
//          SkuName:variants.title,
//          SkuSpecifications:input.options,
//          WeightKg:0,
//          Width:0,
//          AvailableQuantity:variants.inventory_quantity,
//          Pricing: {
//             Currency: "USD",
//             SalePrice: variants.price,
//             CurrencySymbol: "$"
//        }
//     }
    
//     return transformedObject
// }

export const TransformSkuSuggestion=(input:any,variants:any,sellerId:string,image:Image[])=>{
    let transformedObject={
         
         ProductId:String(input.id),
         BrandName:input.vendor,
         CategoryFullPath:`${"Jeans / Shorts / Shirts"}`,
         EAN:[variants.barcode],
         Height:20,
         Images:image,
         SellerId:sellerId,
         Length:10,
         ListPrice:variants.price,
         Price:variants.price,
         ProductDescription:input.body_html,
         ProductName:"JeansDemo",
         ProductSpecifications:[
            {
                 "fieldName": "prodspec1",
                 "fieldValues": [
                      "value1",
                      "value2"
                 ]
            }
       ],
         MeasurementUnit: "un",
         UnitMultiplier: 1,
         RefId:variants.barcode,
         SellerStockKeepingUnitId:variants.id,
         SkuName:variants.title,
         SkuSpecifications:[
            {
                 "fieldName": "color",
                 "fieldValues": [
                      "black",
                      "yellow"
                 ]
            }
       ],
         WeightKg:0,
         Width:0,
         AvailableQuantity:variants.inventory_quantity,
         Pricing: {
            Currency: "USD",
            SalePrice: variants.price,
            CurrencySymbol: "$"
       }
    }
    
    return transformedObject
}