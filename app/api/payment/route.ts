import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
import { type NextRequest } from "next/server"
import db from "@/utils/db"

export const POST = async (req: NextRequest) => {
  // Parse the JSON body to get orderId and cartId
  const { orderId, cartId } = await req.json()

  // Fetch the order and cart from the database
  const order = await db.order.findUnique({ where: { id: orderId } })
  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: { cartItems: { include: { product: true } } },
  })

  // If the order or cart is not found, return a 404 response
  if (!order || !cart)
    return new Response("Order or Cart Not found", {
      status: 404,
      statusText: "Order or Cart Not found",
    })

  // Create line items for each cart item
  const lineItems = cart.cartItems.map((cartItem) => {
    return {
      quantity: cartItem.amount,
      price_data: {
        currency: "usd",
        product_data: {
          name: cartItem.product.name,
          images: [cartItem.product.image],
        },
        unit_amount: cartItem.product.price * 100, //in cents
      },
    }
  })

  // Get the origin from the request headers
  const origin = req.headers.get("origin")

  // Try to create a Stripe Checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId: order.id },
      line_items: lineItems,
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    })
    return Response.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.log(error)
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    })
  }
}
