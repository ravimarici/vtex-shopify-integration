import { MarketplaceOrderInput } from '../types/orderPlacement'

export const processAllOrderInputs = (
  ctx: Context,
  requests: MarketplaceOrderInput[]
) => {
  const {
    clients: { externalSeller },
  } = ctx
      console.log(requests)
  return requests.map((order) => externalSeller.placeOrder(order))
}
