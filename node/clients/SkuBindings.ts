import { ExternalClient,InstanceOptions,IOContext,JanusClient,RequestTracingConfig } from "@vtex/api";

import type { AuthMethod } from '../utils/tokens'
import { getRequestConfig } from '../utils/request'
import { InventoryInterface } from "../types/InventoryInput";
const baseURL = '/api/catalog_system'

const routes = {
    listSkuBindingBySellerId: (sellerId: string) =>
    `${baseURL}/pvt/skuseller/list/bysellerId/${sellerId}`,
    
  }
  
export default class SkuBindingsClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
        ...options,
        headers: {
          ...options?.headers,
          VtexIdclientAutCookie: ctx.authToken,
        },
      })

  }

  public listSkuBindingsBySellerId(
    sellerId: string,
    authMethod: AuthMethod = 'AUTH_TOKEN',
    tracingConfig?: RequestTracingConfig
  ) {
    const metric = 'skuBindings-getAllSkuBindingsBySellerId'

    return this.http.get<any>(
      routes.listSkuBindingBySellerId(sellerId),
      getRequestConfig(this.context, authMethod, metric, tracingConfig)
    )
  }
  
}
