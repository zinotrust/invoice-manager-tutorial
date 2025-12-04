import { getInvoice } from "@/actions/invoiceActions";
import InvoiceForm from "@/components/invoice/InvoiceForm";

export default async function EditInvoicePage({ params }) {
  const { id } = await params;
  const result = await getInvoice(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Edit Invoice #{result.data.id}
      </h1>
      <InvoiceForm invoice={result.data} />
    </div>
  );
}
