import {
  LRUCache,
  Service,
  ServiceContext,
  ParamsContext,
  RecorderState,
  method,
} from '@vtex/api'
import { Clients } from './clients'
import { fullfilmentSimulation } from './handlers/fulfillmentSimulation'
import { placeOrder } from './handlers/orderPlacement'
// import { analytics } from './handlers/analytics'
import { resolvers } from './resolvers/shopify'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })
metrics.trackCache('status', memoryCache)

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: 10000,
      },
    },
  },
  graphql:{    
    resolvers,
  },
  routes: {
    fullfilmentSimulation: method({
      POST: fullfilmentSimulation,
    }),
    orderPlacement: method({
      POST: placeOrder,
    }),
  },
})
