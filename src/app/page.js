import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple Invoice Manager
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Invoice management + Email Reminder Automation
        </p>
        <Link
          href="/invoices"
          className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700"
        >
          View Invoices
        </Link>
      </div>
    </div>
  )
}