// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Text Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            InvoiceManager
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/invoices"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Invoices
          </Link>
        </nav>
      </div>
    </header>
  );
}