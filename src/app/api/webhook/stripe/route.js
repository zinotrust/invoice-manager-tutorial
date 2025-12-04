import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendEmail, updateMailAPIEmail } from "@/actions/emailActions";

const stripe = new Stripe(process.env.STRIPE_SECRET);
const webhookSecret = process.env.STRIPE_WEBHOOK;

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  //   verify webhook
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const eventType = event.type;

  try {
    // checkout.session.completed
    switch (eventType) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const customerEmail = session.customer_details.email;
        const amount = session.amount_total / 100;

        console.log("✅ Payment completed:", customerEmail, amount);

        // update postgresql
        const invoice = await prisma.invoice.findFirst({
          where: {
            customerEmail,
            amount,
            status: "PENDING",
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (!invoice) {
          console.log("Invoice not found");
          return NextResponse.json(
            { error: "Invoice not found" },
            { status: 400 }
          );
        }

        const updated = await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        // send email to customer
        await sendEmail({
          from: "InvoiceMgr <hello@invoicemanager.xyz>",
          to: customerEmail,
          subject: `Payment Confirmed - ${invoice.purpose}`,
          template_id: "invoice_receipt",
          template_data: {
            purpose: invoice.purpose,
            amount: invoice.amount,
            paidAt: new Date().toISOString(),
          },
          reply_to: "noreply@mail.mailapi.dev",
        });

        // update mailapi list
        await updateMailAPIEmail({
          email: customerEmail,
          customFields: {
            status: "PAID",
            paidAt: new Date().toISOString(),
          },
        });

        break;
      }
      default:
        console.log("⚠️ Unhandled Stripe event:", eventType);
    }

  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
