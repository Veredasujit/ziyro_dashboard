import { useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
  useVerifyAdminLoginOtpMutation,
  useSendAdminLoginOtpMutation,
} from "../../Redux/api/authApi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(
    Array(6).fill("")
  );

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [verifyOtp, { isLoading }] =
    useVerifyAdminLoginOtpMutation();

  const [resendOtp, { isLoading: resendLoading }] =
    useSendAdminLoginOtpMutation();

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      const res = await verifyOtp({
        email,
        otp: enteredOtp,
      }).unwrap();

      toast.success(
        res.success
          ? "Login Successful"
          : "Verification Failed"
      );

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Invalid OTP"
      );
    }
  };

  const handleResendOtp =
    async () => {
      try {
        const res =
          await resendOtp({
            email,
          }).unwrap();

        toast.success(
          res.message ||
            "OTP resent successfully"
        );
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            "Failed to resend OTP"
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          OTP sent to {email}
        </p>

        <form
          onSubmit={handleVerify}
          className="space-y-8"
        >
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] =
                    el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleBackspace(
                    e,
                    index
                  )
                }
                className="w-12 h-12 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            {isLoading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-blue-600 font-medium hover:underline"
          >
            {resendLoading
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;