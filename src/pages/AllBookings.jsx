import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../api";
import { FaClipboardList, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2"; 

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(endpoint("/api/admin/all-bookings"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking record permanently?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(endpoint(`/api/admin/bookings/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking record deleted.");
      setBookings(bookings.filter(b => b._id !== id));
    } catch (error) {
      toast.error("Failed to delete booking.");
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-[2rem] border border-gray-700 relative overflow-hidden">
        <h2 className="text-3xl font-black text-white uppercase flex items-center gap-3 relative z-10">
          <FaClipboardList className="text-amber-500" /> Global <span className="text-amber-500">Bookings</span>
        </h2>
      </div>

      <div className="bg-gray-800/50 rounded-[2.5rem] border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-400 uppercase text-[11px] font-black">
              <tr>
                <th className="px-8 py-5">Vehicle Details</th>
                <th className="px-8 py-5">Customer Email</th>
                <th className="px-8 py-5">Rental Rate</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {bookings.map((booking, index) => (
                <motion.tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={booking.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div className="text-white font-bold">{booking.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-300">{booking.userEmail}</td>
                  <td className="px-8 py-6 text-white font-black">${booking.pricePerDay}</td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;