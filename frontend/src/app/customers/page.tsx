"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../types/analytics";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CustomersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>(`${apiUrl}/users`).then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">
        👤 Customers
      </h1>
      <div className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-blue-900">Name</th>
              <th className="px-4 py-2 text-left text-blue-900">Email</th>
              <th className="px-4 py-2 text-left text-blue-900">Role</th>
              <th className="px-4 py-2 text-left text-blue-900">Signup Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2 text-blue-800">{user.name}</td>
                <td className="px-4 py-2 text-green-700">{user.email}</td>
                <td className="px-4 py-2 text-purple-700">{user.role}</td>
                <td className="px-4 py-2 text-orange-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
