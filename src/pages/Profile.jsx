import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../api";
import {
  FaUserEdit,
  FaShieldAlt,
  FaKey,
  FaGift,
  FaMapMarkerAlt,
  FaUnlockAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2"; 

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfileClick = () => {
    navigate("/dashboard/update-profile");
  };

  const handleBecomeAdminClick = () => {
    setShowAdminModal(true);
  };

  const handleBecomeAdmin = async () => {
    if (!user) return toast.error("User not found!");
    if (!secretKey) return toast.error("Please enter the secret key!");

    setLoading(true);
    try {
      if (secretKey !== "Sabbir@1234") {
        toast.error("Invalid secret key!");
        setLoading(false);
        return;
      }

      const token =
        typeof user.getIdToken === "function"
          ? await user.getIdToken()
          : localStorage.getItem("token");

      const response = await axios.patch(
        endpoint("/api/users/make-admin"),
        { secretKey, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Verification Successful! You are now an Admin.");
        setShowAdminModal(false);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0B0F1A] transition-colors duration-500 pb-20">
      {/* Header Background */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-slate-900 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-4 md:px-6 lg:px-10 -mt-24 md:-mt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative inline-block mb-6">
                <img
                  src={user?.photoURL || "https://i.ibb.co/v36X0vD/avatar.png"}
                  alt="Profile Avatar"
                  className="w-40 h-40 rounded-[45px] object-cover border-8 border-white dark:border-slate-800 shadow-2xl"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <h2 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tighter text-center">
                {user?.displayName || "Elite Member"}
              </h2>
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-[4px] mt-2 text-center">
                ✓ Verified Account
              </p>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-[4px]">
                  Profile Information
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateProfileClick} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-white text-slate-900 font-black rounded-xl uppercase tracking-wider text-xs transition-all border border-transparent hover:border-amber-500"
                  >
                    <FaUserEdit /> Update Profile
                  </button>
                  
                  <button
                    onClick={handleBecomeAdminClick} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-xl uppercase tracking-wider text-xs transition-all shadow-lg hover:shadow-amber-500/50"
                  >
                    <FaShieldAlt /> Become Admin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem
                  label="Full Name"
                  value={user?.displayName || "Not Set"}
                />
                <InfoItem
                  label="Email Address"
                  value={user?.email || "Not Set"}
                />
                <InfoItem label="User ID" value={user?.uid || "N/A"} mono />
                <InfoItem label="Membership Tier" value="PREMIUM" highlight />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            <StatsCard
              delay={0.1}
              icon={<FaGift />}
              label="Loyalty Points"
              value="1,250 pts"
              color="blue"
            />
            <StatsCard
              delay={0.2}
              icon={<FaMapMarkerAlt />}
              label="Region"
              value="Dhaka, BD"
              color="amber"
            />
            <StatsCard
              delay={0.3}
              icon={<FaShieldAlt />}
              label="Account Status"
              value="Verified"
              color="green"
            />
            <StatsCard
              delay={0.4}
              icon={<FaKey />}
              label="Auth Provider"
              value="Firebase"
              color="purple"
            />
          </div>
        </motion.div>
      </div>

      {/*  Become Admin Modal  */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[30px] p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaUnlockAlt className="text-3xl" />
                </div>
                <h3 className="text-2xl font-black dark:text-white text-slate-900 uppercase italic">
                  Admin Access
                </h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  Enter secret key to unlock administrative powers.
                </p>
              </div>

              {/* Password Input with Eye Icon */}
              <div className="relative group">
                <input
                  type={showSecret ? "text" : "password"}
                  placeholder="Secret Key (Admin Panel)"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent focus:border-amber-500 rounded-2xl transition-all outline-none font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                >
                  {showSecret ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBecomeAdmin}
                  disabled={loading}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Confirm Access"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components

const InfoItem = ({ label, value, mono, highlight }) => (
  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <p
      className={`text-lg font-bold dark:text-white text-slate-900 ${
        mono ? "font-mono text-xs truncate dark:text-amber-500" : ""
      } ${highlight ? "text-amber-500" : ""}`}
    >
      {value}
    </p>
  </div>
);

const StatsCard = ({ delay, icon, label, value, color }) => {
  const colorVariants = {
    blue: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/50 text-blue-500",
    amber: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50 text-amber-500",
    green: "bg-green-500/5 border-green-500/20 hover:border-green-500/50 text-green-500",
    purple: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50 text-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border transition-all group ${colorVariants[color] || colorVariants.blue}`}
    >
      <div className={`text-2xl mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="font-black dark:text-white text-slate-900 uppercase tracking-widest text-[10px] mb-2">
        {label}
      </h4>
      <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">
        {value}
      </p>
    </motion.div>
  );
};

export default Profile;