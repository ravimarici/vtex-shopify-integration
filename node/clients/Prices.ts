import { ExternalClient,InstanceOptions,IOContext,JanusClient,RequestTracingConfig } from "@vtex/api";

import type { AuthMethod } from '../utils/tokens'
import { getRequestConfig } from '../utils/request'
import { InventoryInterface } from "../types/InventoryInput";
const baseURL = '/api/catalog_system'

const routes = {
    getPriceBySkuId: (skuId: string) =>
    `pricing/prices/${skuId}`,
    
  }
  
export default class PricesClient extends ExternalClient  {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/${ctx.account}`,ctx, {
        ...options,
        headers: {
            ...options?.headers,
            ...{ Accept: 'application/vnd.vtex.ds.v10+json' },
            ...(ctx.adminUserAuthToken
              ? { VtexIdclientAutCookie: ctx.adminUserAuthToken }
              : null),
            ...(ctx.storeUserAuthToken
              ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
              : null),
          },
      })

  }

  public getPriceBySkuId(
    SkuId: string,
    authMethod: AuthMethod = 'AUTH_TOKEN',
    tracingConfig?: RequestTracingConfig
  ) {
    const metric = 'pricing-getPricingBySku'

    return this.http.get<any>(
      routes.getPriceBySkuId(SkuId),
      getRequestConfig(this.context, authMethod, metric, tracingConfig)
    )
  }
  
}
