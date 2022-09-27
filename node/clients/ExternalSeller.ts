import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { getItemsInfoFromInput } from '../utils/simulationMock'

import {
    SimulationInput,
    SimulationResponse,
  } from '../types/fulfillmentSimulation'

export class ExternalSeller extends ExternalClient {
    constructor(ctx: IOContext, options?: InstanceOptions) {
        super(`baseUrl`, ctx, {
          ...options,
        })
      }

      public fullfilmentSimulation(input: SimulationInput,sellerName:String) {
        const items = getItemsInfoFromInput(input)
            console.log(sellerName)
            console.log
        const body: SimulationResponse = {
          country: 'USA',
          items,
          logisticsInfo: [
            {
              itemIndex: 0,
              quantity: 1,
              shipsTo: ['USA'],
              slas: [
                {
                    id: "Regular",
                    deliveryChannel: "delivery",
                    name: "Regular Delivery",
                    price: 1046,
                    shippingEstimate: "19bd"
                 },
                 {
                    id: "Express",
                    deliveryChannel: "delivery",
                    name: "Express Delivery",
                    price: 846,
                    shippingEstimate: "1bd"
                 },
                 {
                    id: "Economy",
                    deliveryChannel: "delivery",
                    name: "Economy",
                    price: 0,
                    shippingEstimate: "8bd"
                 },
                 {
                    id: "Standard",
                    deliveryChannel: "delivery",
                    name: "Standard",
                    price: 0,
                    shippingEstimate: "11bd"
                 },
                 {
                    id: "Curbside pickup",
                    deliveryChannel: "pickup-in-point",
                    name: "Curbside pickup",
                    shippingEstimate: "0bd",
                    price: 0,
                    availableDeliveryWindows: [
                     {
                        startDateUtc: "2013-02-04T08:00:00+00:00",
                        endDateUtc: "2013-02-04T13:00:00+00:00",
                        price: 0
                     }
                   ],
                    pickupStoreInfo: {
                       isPickupStore: true,
                       friendlyName: "Santa Felicidade",
                       address: {
                          addressType: "pickup",
                          receiverName: null,
                          addressId: "548304ed-dd40-4416-b12b-4b32bfa7b1e0",
                          postalCode: "82320-040",
                          city: "Curitiba",
                          state: "PR",
                          country: "BRA",
                          street: "Rua Domingos Strapasson",
                          number: "100",
                          neighborhood: "Santa Felicidade",
                          complement: "Loja 10",
                          reference: null,
                          geoCoordinates: [
                             -49.334934,
                             -25.401705
                          ]
                       },
                       additionalInfo: ""
                    }
                 }
              ],
              stockBalance: 199,
              deliveryChannels: [
                {
                  id: 'delivery',
                  stockBalance: 179,
                },
                {
                  id: 'pickup-in-point',
                  stockBalance: 20,
                },
              ],
            },
          ],
          postalCode: input.postalCode,
        }
    
        return body
      }

      public placeOrder(request: any) {
        const body: any = {
          ...request,
          orderId: '123456',
          followUpEmail: 'tanishq.sharma@maricisolutions.com',
        }
    
        return body
      }

      public async dispatchOrder(orderId: string, marketplaceOrderId: string) {
        const body: OrderDispatch = {
          date: new Date().toISOString(),
          marketplaceOrderId,
          orderId,
          receipt: null,
        }
    
        return body
      }
    
      public async invoiceOrder(_: string) {
        const invoiceData: any = {
          type: 'Output',
          invoiceNumber: 'NFe-00001',
          issuanceDate: '2020-11-21T00:00:00',
          invoiceValue: 38500,
          invoiceUrl: 'https://7dfd0931fce9d4b74d20fd70d48eb714.m.pipedream.net',
          courier: '',
          trackingNumber: '',
          trackingUrl: '',
          items: [
            {
              id: '345117',
              quantity: 1,
              price: 9003,
            },
          ],
        }
    
        return invoiceData
      }
    
      public async cancelOrder(orderId: string, marketplaceOrderId: string) {
        const body = {
          date: '2020-11-02 18:52:00',
          marketplaceOrderId,
          orderId,
          receipt: 'e39d05f9-0c54-4469-a626-8bb5cff169f8',
        }
    
        return body
      }
    }
    
    interface OrderDispatch {
      date: string
      marketplaceOrderId: string
      orderId: string
      receipt: string | null
    }
    

      
