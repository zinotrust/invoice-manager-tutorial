import { getInvoice } from '@/actions/invoiceActions'
import InvoiceDetails from '@/components/invoice/InvoiceDetails';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function InvoiceDetailsPage({ params }) {
  const { id } = await params
  const result = await getInvoice(id);

  if (!result.success) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <InvoiceDetails invoice={result.data} /> 
    </div>
  )
}
