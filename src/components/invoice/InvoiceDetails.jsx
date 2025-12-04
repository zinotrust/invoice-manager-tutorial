"use client";
import {
  deleteInvoice,
  markAsPaid,
  markAsPending,
} from "@/actions/invoiceActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function InvoiceDetails({ invoice }) {
  const router = useRouter();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    const result = await deleteInvoice(invoice.id);
    if (result.success) {
      router.push("/invoices");
      router.refresh();
    } else {
      alert("Failed to delete invoice: " + result.error);
    }
  };

  const handleMarkPaid = async () => {
    const result = await markAsPaid(invoice.id);
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to mark as paid: " + result.error);
    }
  };

  const handleMarkPending = async () => {
    const result = await markAsPending(invoice.id);
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to mark as pending: " + result.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Invoice #{invoice.id}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              invoice.status
            )}`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Purpose
            </label>
            <p className="mt-1 text-lg text-gray-900">{invoice.purpose}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Amount
            </label>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${invoice.amount}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Customer Email
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {invoice.customerEmail}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Invoice Link
            </label>
            <a
              href={invoice.invoiceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 hover:text-blue-800 hover:underline"
            >
              {invoice.invoiceLink}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Due Date
              </label>
              <p className="mt-1 text-gray-900">
                {formatDate(invoice.dueDate)}
              </p>
            </div>

            {invoice.paidAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Paid Date
                </label>
                <p className="mt-1 text-gray-900">
                  {formatDate(invoice.paidAt)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Created
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {formatDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {formatDate(invoice.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Invoice
          </Link>

          {invoice.status !== 'PAID' && (
            <button
              onClick={handleMarkPaid}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Mark as Paid
            </button>
          )}

          {invoice.status === 'PAID' && (
            <button
              onClick={handleMarkPending}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Mark as Pending
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>

          <Link
            href="/invoices"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ml-auto"
          >
            Back to List
          </Link>
        </div>

        {/* end */}
      </div>
    </div>
  );
}
