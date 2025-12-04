"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { addEmailToMailAPI, sendEmail, updateMailAPIEmail, verifyEmail } from "./emailActions";

export async function createInvoice(formData) {
  const { purpose, amount, customerEmail, invoiceLink, status, dueDate } =
    formData;

  try {
    // verify customere mail
    const verify = await verifyEmail(customerEmail);
    if (verify.error) {
      return { success: false, error: verify.error };
    }
    if (!verify?.data?.valid) {
      return { success: false, error: verify.data.message };
    }

    const stripeLink = invoiceLink + "?prefilled_email=" + customerEmail;
    const invoice = await prisma.invoice.create({
      data: {
        purpose,
        amount: parseFloat(amount),
        customerEmail,
        invoiceLink: stripeLink,
        status: status || "PENDING",
        dueDate: new Date(dueDate),
      },
    });

    // send email invoice
    await sendEmail({
      from: "InvoiceMgr <noreply@mail.mailapi.dev>",
      to: customerEmail,
      subject: `InvoiceMgr - ${purpose}`,
      template_id: "invoice_tutorial",
      template_data: {
        purpose,
        amount,
        invoiceLink: stripeLink,
        status,
        dueDate,
      },
      reply_to: "noreply@mail.mailapi.dev",
    });

    // add email to mailapi
    await addEmailToMailAPI({
      email: customerEmail,
      customFields: {
        purpose,
        amount,
        invoiceLink: stripeLink,
        status,
        dueDate,
      },
    });

    revalidatePath("/invoices");

    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function updateInvoice(id, formData) {
  const { purpose, amount, customerEmail, invoiceLink, status, dueDate } =
    formData;

  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        purpose,
        amount: parseFloat(amount),
        customerEmail,
        invoiceLink: invoiceLink,
        status: status || "PENDING",
        dueDate: new Date(dueDate),
      },
    });

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function getInvoices(status = null) {
  noStore();
  try {
    const where = status ? { status } : {};
    const invoice = await prisma.invoice.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function getInvoice(id) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    return { success: true, data: invoice };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function deleteInvoice(id) {
  try {
    const invoice = await prisma.invoice.delete({
      where: { id },
    });

    revalidatePath("/invoices");
    return { success: true };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function markAsPaid(id) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await updateMailAPIEmail({
      email: invoice.customerEmail,
      customFields: {
        status: "PAID",
        paidAt: new Date().toISOString(),
      },
    });

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function markAsPending(id) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "PENDING",
        paidAt: new Date(),
      },
    });

    await updateMailAPIEmail({
      email: invoice.customerEmail,
      customFields: {
        status: "PENDING",
        paidAt: null,
      },
    });

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true };
  } catch (error) {
    console.log("Error", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
