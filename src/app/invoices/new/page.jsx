import InvoiceForm from "@/components/invoice/InvoiceForm";


export default function NewInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  )
}
