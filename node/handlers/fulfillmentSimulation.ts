import { json } from 'co-body'

import { SimulationInput } from '../types/fulfillmentSimulation'

export async function fullfilmentSimulation(ctx: Context) {
  const {
    clients: { externalSeller, },
    vtex:{
        route:{
            params:{sellerName}
        }
    }
  } = ctx

  const body: SimulationInput = await json(ctx.req)
    console.log("BODY",body)

  ctx.body = externalSeller.fullfilmentSimulation(body,sellerName as String)

  ctx.status = 200
}
