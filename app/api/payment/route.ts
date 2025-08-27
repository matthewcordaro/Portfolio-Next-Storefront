import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
import { type NextRequest } from "next/server"
import db from "@/utils/db"
import { nodeEnvironment } from "@/utils/env"

/**
 * Handles the POST request to initiate a Stripe Checkout session for payment.
 *
 * This endpoint expects a JSON body containing `orderId` and `cartId`.
 * It fetches the corresponding order and cart from the database, constructs
 * Stripe line items from the cart contents, and creates an embedded Stripe
 * Checkout session. The client secret for the session is returned in the response.
 *
 * @param req - The incoming Next.js request object containing the order and cart IDs.
 * @returns A JSON response with the Stripe Checkout session client secret,
 *          or an error response if the order or cart is not found, or if an internal error occurs.
 */
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
  const lineItems = [
    ...cart.cartItems.map((cartItem) => {
      return {
        quantity: cartItem.amount,
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.product.name,
            images: [cartItem.product.image],
          },
          unit_amount: cartItem.product.price, // Price in cents
        },
      }
    }),
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: cart.shipping,
      },
    },
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: { name: "Tax" },
        unit_amount: cart.tax,
      },
    },
  ]

  // Get the origin from the request headers
  const origin = req.headers.get("origin")

  let fakeData={}
  if (nodeEnvironment !== "production") {
    fakeData = {
      customer_email: "example@check.out",
      custom_text: {
        submit: {
          message:
            "Card: 4242424242424242; Exp: 0150; CVC, Name, Zip: Whatever",
        },
      },
    }
  }

  // Try to create a Stripe Checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      ...fakeData,
      ui_mode: "embedded",
      metadata: { orderId, cartId },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
      payment_method_types: ["card"],
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
