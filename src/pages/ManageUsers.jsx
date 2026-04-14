import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../api";
import { FaUsers, FaUserShield, FaUserCircle, FaEnvelope, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get(endpoint("/api/users"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete user!",
      background: "#111827",
      color: "#fff"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(endpoint(`/api/admin/users/${id}`), {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setUsers(users.filter(u => u._id !== id)); 
          
          Swal.fire(
            "Deleted!",
            "User has been removed.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "Failed to delete user.",
            "error"
          );
        }
      }
    });
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-indigo-900 p-8 rounded-[2.5rem] border border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase flex items-center gap-3">
            <FaUsers className="text-amber-500" /> Platform <span className="text-amber-500">Users</span>
          </h2>
          <p className="text-gray-300 mt-2 font-medium">
            Manage all registered members and monitor administrative access.
          </p>
        </div>
        <FaUserCircle className="absolute top-0 right-0 text-[12rem] text-white/5 -rotate-12 translate-x-12 -translate-y-10" />
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/40 rounded-[2.5rem] border border-gray-700 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-400 uppercase text-[11px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Member Details</th>
                <th className="px-8 py-6">Email Address</th>
                <th className="px-8 py-6 text-center">Privilege</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {users.map((u, index) => (
                <motion.tr 
                  key={u._id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                
                      <div className="relative">
                        {u.photo ? (
                          <img 
                            src={u.photo} 
                            alt={u.name} 
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-700 group-hover:border-amber-500 transition-all duration-300 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center border-2 border-gray-600 group-hover:border-amber-500 transition-all">
                            <FaUserCircle className="text-2xl text-gray-500" />
                          </div>
                        )}
                        {u.role === 'admin' && (
                          <div className="absolute -top-1 -right-1 bg-amber-500 text-black p-0.5 rounded-md shadow-lg">
                            <FaUserShield className="text-[10px]" />
                          </div>
                        )}
                      </div>
                      <div className="text-white font-bold tracking-tight text-sm">
                        {u.name || "Anonymous User"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                      <FaEnvelope className="text-amber-500/50 text-xs" /> {u.email}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      u.role === "admin" 
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 group-hover:scale-110"
                      title="Delete User"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-24 text-center">
              <FaUsers className="text-6xl text-gray-700 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">No Users Found</h3>
              <p className="text-gray-600 text-sm mt-1">Database registry is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;