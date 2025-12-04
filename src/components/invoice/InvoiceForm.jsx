"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createInvoice, updateInvoice } from "@/actions/invoiceActions";

export default function InvoiceForm({ invoice = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(invoice?.status || "PENDING");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      purpose: e.target.purpose.value,
      amount: e.target.amount.value,
      customerEmail: e.target.customerEmail.value,
      invoiceLink: e.target.invoiceLink.value,
      status: status,
      dueDate: e.target.dueDate.value,
    };

    
    const result = invoice
      ? await updateInvoice(invoice.id, formData)
      : await createInvoice(formData);

    if (result.success) {
      router.push("/invoices");
    } else {
        console.log("Error", result.error);
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Input
          type="text"
          id="purpose"
          name="purpose"
          defaultValue={invoice?.purpose}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          defaultValue={invoice?.amount}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerEmail">Customer Email</Label>
        <Input
          type="email"
          id="customerEmail"
          name="customerEmail"
          defaultValue={invoice?.customerEmail}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceLink">Invoice Link (Optional)</Label>
        <Input
          type="url"
          id="invoiceLink"
          name="invoiceLink"
          defaultValue={invoice?.invoiceLink || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          defaultValue={
            invoice?.dueDate
              ? new Date(invoice.dueDate).toISOString().split("T")[0]
              : ""
          }
          required
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : invoice
            ? "Update Invoice"
            : "Create Invoice"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
