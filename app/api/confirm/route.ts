import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"
import db from "@/utils/db"

/**
 * Handles GET requests to confirm a Stripe checkout session.
 *
 * Retrieves the session ID from the request URL, fetches the session details from Stripe,
 * and checks if the session is complete. If complete, updates the corresponding order as paid
 * and deletes the associated cart from the database. Redirects to the orders page upon completion.
 *
 * @param request - The incoming Next.js request object.
 * @returns A redirect to the orders page or a JSON error response if an error occurs.
 */
export const GET = async (req: NextRequest) => {
  // Retrieve the session ID from the request URL
  const sessionId = new URL(req.url).searchParams.get("session_id") as string

  try {
    // Retrieve the session from Stripe using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Retrieve orderId and cartId from session metadata
    const orderId = session.metadata?.orderId
    const cartId = session.metadata?.cartId

    if (session.status === "complete") {
      // Update the order status to paid in the database
      await db.order.update({
        where: { id: orderId },
        data: { isPaid: true },
      })
      await db.cart.delete({ where: { id: cartId } })
    }
  } catch (error) {
    console.log(error)
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    })
  }
  redirect("/orders")
}
