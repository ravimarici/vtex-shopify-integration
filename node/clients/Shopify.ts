import { ExternalClient,InstanceOptions,IOContext } from "@vtex/api";


export default class ShopifyClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
        '',
        context,
        {
          ...(options ?? {}),
        }
      )
  }
  public async getShopConfiguration(apiKey:String,apiPassword:String,shopifyStoreName:String) : Promise<String> {
    return this.http.get(`https://${apiKey}:${apiPassword}@${shopifyStoreName}.myshopify.com/admin/api/2022-07/shop.json`,{
      headers:{
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  }
  public async getProducts(apiKey:String,apiPassword:String,shopifyStoreName:String) : Promise<String> {
    return this.http.get(`https://${apiKey}:${apiPassword}@${shopifyStoreName}.myshopify.com/admin/api/2022-07/products.json`,{
      headers:{
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  }
}
