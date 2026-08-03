import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
   import {
  ShieldCheck,
} from "lucide-react";


import {
  useSendAdminLoginOtpMutation,
} from "../../Redux/api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const [sendOtp, { isLoading }] =
    useSendAdminLoginOtpMutation();

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await sendOtp({
        email,
        password,
      }).unwrap();

      toast.success(
        res.message || "OTP sent successfully"
      );

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to send OTP"
      );
    }
  };

  return (




<div className="relative min-h-screen overflow-hidden bg-white">

 

  <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">

      {/* Header */}
      <div className="flex flex-col items-center border-b border-white/10 p-8">

        <img
          src="/images/Logo.svg"
          alt="Ziyro"
          className="h-20 w-auto mb-4"
        />

        <h1 className="text-3xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mt-2 text-xl text-center text-gray-700">
          Login to your Ziyro Admin Dashboard
        </p>

      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="space-y-6 p-8"
      >

        {/* Email */}
        <div>

          <label className="mb-2 block text-sm font-medium text-gray-500">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-4 text-gray-500"
            />

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="admin@ziyro.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-black placeholder:text-gray-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-500">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-4 text-gray-500"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-black placeholder:text-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black cursor-pointer"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>

          </div>

        </div>

        {/* Button */}

        <button
          disabled={isLoading}
          className="w-full rounded-xl cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-cyan-500/30"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </button>

      </form>

      {/* Footer */}

      <div className="flex items-center justify-center gap-2 border-t border-white/10 p-5 text-sm text-gray-400">

        <ShieldCheck size={16} className="text-green-400" />

        Secure Authentication • OTP Protected

      </div>

    </div>

  </div>

</div>
  );
};

export default Login;