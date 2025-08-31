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
          <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </a>
          <a href="/sales" className="text-gray-600 hover:text-blue-600">
            Sales
          </a>
          <a href="/customers" className="text-gray-600 hover:text-blue-600">
            Customers
          </a>
          <a href="/products" className="text-gray-600 hover:text-blue-600">
            Products
          </a>
          <a href="/reports" className="text-gray-600 hover:text-blue-600">
            Reports
          </a>
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
