import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);




const createCheckoutSession = async (amount: number) => {

    const session = await stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        line_items: [
            {
                price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
                quantity: 2,
            },
        ],
        mode: 'payment',
    });
    return session;
}

export const StripeService = {
    createCheckoutSession
}