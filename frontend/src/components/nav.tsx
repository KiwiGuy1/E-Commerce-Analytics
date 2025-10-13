import Link from "next/link";
import React from "react";

export const Nav: React.FC = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-xl font-bold text-gray-800">
          E-Commerce Analytics
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/sales" className="text-gray-600 hover:text-blue-600">
            Sales / Orders
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600">
            Products
          </Link>
          <Link href="/customers" className="text-gray-600 hover:text-blue-600">
            Customers
          </Link>
          <Link href="/analytics" className="text-gray-600 hover:text-blue-600">
            Analytics / Reports
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-blue-600">
            Settings
          </Link>
        </div>
      </div>
      <div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Nav;
