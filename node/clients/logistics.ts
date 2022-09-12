import { ExternalClient,InstanceOptions,IOContext,JanusClient,RequestTracingConfig } from "@vtex/api";

import type { AuthMethod } from '../utils/tokens'
import { getRequestConfig } from '../utils/request'
import { InventoryInterface } from "../types/InventoryInput";
const baseURL = '/api/logistics'

const routes = {
    listInventoryBySku: (skuId: string) =>
    `${baseURL}/pvt/inventory/skus/${skuId}`,
    updateInventoryBySkuAndWarehouse: (skuId: string,warehouseId:string) =>
    `${baseURL}/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
  }
  
export default class LogisticsClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
        ...options,
        headers: {
          ...options?.headers,
          VtexIdclientAutCookie: ctx.authToken,
        },
      })

  }

  public listInventoryBySku(
    skuId: string,
    authMethod: AuthMethod = 'AUTH_TOKEN',
    tracingConfig?: RequestTracingConfig
  ) {
    const metric = 'logistics-listInventoryBySku'

    return this.http.get<any>(
      routes.listInventoryBySku(skuId),
      getRequestConfig(this.context, authMethod, metric, tracingConfig)
    )
  }

  public updateInventoryBySkuIdAndWarehouseId(
    skuId: string,
    warehouseId:string,
    body:InventoryInterface,
    authMethod: AuthMethod = 'AUTH_TOKEN',
    tracingConfig?: RequestTracingConfig
  ){
    const metric = 'logistics-updateInventoryBySkuAndWarehouse'

    return this.http.put<any>(
        routes.updateInventoryBySkuAndWarehouse(skuId,warehouseId),
        body,
        getRequestConfig(this.context, authMethod, metric, tracingConfig)
      )
  }
  
}
