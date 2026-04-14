import React, { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../api";
import {
  FaTrashAlt,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaCogs,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ManageAllCars = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCars = async () => {
    try {
      let token = null;
      try {
        const { auth } = await import("../Firebase/Firebase.config");
        token = await auth.currentUser?.getIdToken();
      } catch (e) {
        token = localStorage.getItem("token");
      }

      const response = await axios.get(endpoint("/api/admin/all-cars"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllCars(response.data);
    } catch (error) {
      console.error("Error fetching all cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCars();
  }, []);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Confirm Deletion?`,
      text: `You are about to remove "${name}" from the system. This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, Remove Listing",
      background: "#111827",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          await axios.delete(endpoint(`/api/car/my-listings/${id}`), {
            headers: { Authorization: `Bearer ${token}` },
          });

          setAllCars(allCars.filter((car) => car._id !== id));

          Swal.fire(
            "Success!",
            "The vehicle has been removed by Admin.",
            "success"
          );
        } catch (error) {
          Swal.fire("Failed!", "Could not delete the listing.", "error");
        }
      }
    });
  };

  if (loading)
    return (
      <div className="flex h-[70vh] items-center justify-center bg-gray-900 rounded-[2.5rem]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700 shadow-xl">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            Vehicle <span className="text-amber-500">Inventory</span>
          </h2>
          <p className="text-gray-400 mt-1 font-medium italic text-sm">
            Total {allCars.length} listings found across the platform.
          </p>
        </div>

        <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-2xl border border-amber-500/20 font-bold flex items-center gap-2">
          <FaCogs className="animate-spin-slow" /> Administrator Mode
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-gray-800/30 rounded-[2.5rem] border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/80 text-gray-400 uppercase text-[11px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Vehicle Details</th>
                <th className="px-8 py-5">Provider Info</th>
                <th className="px-8 py-5">Rate</th>
                <th className="px-8 py-5">Availability</th>
                <th className="px-8 py-5 text-center">Admin Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/50">
              {allCars.map((car) => (
                <tr
                  key={car._id}
                  className="group hover:bg-white/5 transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-600 group-hover:border-amber-500 transition-colors"
                        />
                      </div>

                      <div>
                        <div className="text-white font-black text-lg group-hover:text-amber-500 transition-colors">
                          {car.name}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1 mt-1 font-bold">
                          <FaMapMarkerAlt className="text-amber-600" />{" "}
                          {car.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-sm font-semibold flex items-center gap-2">
                        <FaUser className="text-amber-500 text-[10px]" />{" "}
                        {car.providerEmail}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1 uppercase font-black">
                        ID: {car._id.substring(0, 8)}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6 font-black text-white text-xl">
                    ${car.price}
                    <span className="text-[10px] text-gray-500 font-bold ml-1">
                      /DAY
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        car.status === "available"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          car.status === "available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } animate-pulse`}
                      ></span>
                      {car.status}
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => handleDelete(car._id, car.name)}
                      className="p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-[1.2rem] transition-all duration-300 shadow-lg hover:shadow-red-600/20 group/btn"
                      title="Permanently Delete Listing"
                    >
                      <FaTrashAlt className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
                .animate-spin-slow {
                    animation: spin 6s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
};

export default ManageAllCars;