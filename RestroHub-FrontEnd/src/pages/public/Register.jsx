// src/pages/public/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "@services/common/api";
import { ArrowLeft } from "lucide-react";


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

/* ──────────────────── SVG Icons (inlined) ──────────────────── */

const EmailIcon = () => (
  <svg
    className="fill-current text-gray-400"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.25 3.3H2.75C1.58 3.3.59 4.26.59 5.47v11.14c0 1.17.96 2.17 2.16 2.17h16.5c1.17 0 2.17-.96 2.17-2.17V5.43c0-1.17-1-2.13-2.17-2.13Zm0 1.55h.21L11 10.22 2.55 4.88h.2c.07 0 .13 0 .2.03h16.3Zm0 12.3H2.75c-.34 0-.62-.28-.62-.62V6.36L10.28 11.52c.2.14.44.2.68.2s.48-.07.68-.2L19.78 6.36v10.57c.07.34-.2.62-.53.62Z" />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="fill-current text-gray-400"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.15 6.81A10.08 10.08 0 0 0 10.86 4.48c-4.26 0-7.94 3.04-9.09 7.02a.94.94 0 0 0 0 .5c.72 2.63 2.49 4.78 4.83 6.05a9.81 9.81 0 0 0 5.25 1.41c4.24 0 7.93-3.04 9.07-7.02a.94.94 0 0 0 0-.5 10.11 10.11 0 0 0-4.83-6.04l1.06 1.12ZM10.86 17.39c-3.39 0-6.33-2.4-7.26-5.75a.4.4 0 0 1 0-.28c.93-3.36 3.87-5.75 7.26-5.75s6.33 2.4 7.26 5.75a.4.4 0 0 1 0 .28c-.93 3.36-3.87 5.75-7.26 5.75Z" />
    <path d="M10.86 7.67a3.83 3.83 0 1 0 0 7.66 3.83 3.83 0 0 0 0-7.66Zm0 6.16a2.33 2.33 0 1 1 0-4.66 2.33 2.33 0 0 1 0 4.66Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="fill-current text-gray-400"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.68 12.55a11.25 11.25 0 0 1-2.63 3.81l-1.49-1.49a9.75 9.75 0 0 0 2.18-2.87.75.75 0 0 0 0-.59A9.98 9.98 0 0 0 12 5.25c-.96 0-1.9.14-2.77.4L7.62 4.04A11.19 11.19 0 0 1 12 3.25c5.09 0 9.27 3.29 10.68 7.3a.75.75 0 0 1 0 .5ZM15.75 12c0 .18-.01.36-.04.53l-4.24-4.24A3.75 3.75 0 0 1 15.75 12Zm-3.22 3.71-4.24-4.24A3.75 3.75 0 0 0 12.53 15.71ZM6.75 12c0-.18.01-.36.04-.53L4.15 8.83A11.24 11.24 0 0 0 1.32 11.5a.75.75 0 0 0 0 .5C2.73 16.21 6.91 19.5 12 19.5c1.12 0 2.19-.16 3.21-.47l-1.66-1.66a9.98 9.98 0 0 1-10.62-4.81A9.75 9.75 0 0 1 6.75 12Z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Zm2 5.29A7.96 7.96 0 0 1 4 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65Z"
    />
  </svg>
);

/* ──────────── Illustration (left panel) ──────────── */

const Illustration = () => (
  <svg
    width="350"
    height="350"
    viewBox="0 0 350 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Plate */}
    <ellipse cx="175" cy="230" rx="120" ry="30" fill="#E2E8F0" />
    <ellipse cx="175" cy="226" rx="105" ry="24" fill="white" stroke="#3B82F6" strokeWidth="2" />
    <ellipse cx="175" cy="222" rx="80" ry="17" fill="#EFF6FF" />

    {/* Cloche / dome */}
    <path
      d="M105 222 C105 160 245 160 245 222"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line x1="175" y1="148" x2="175" y2="135" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    <circle cx="175" cy="130" r="6" fill="#3B82F6" />

    {/* Steam lines */}
    <path d="M150 115 Q148 100 152 88" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M175 110 Q173 92 177 78" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M200 115 Q198 100 202 88" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Fork (left) */}
    <g transform="rotate(-25, 80, 200)">
      <rect x="78" y="160" width="4" height="90" rx="2" fill="#3B82F6" opacity="0.5" />
      <rect x="72" y="158" width="2.5" height="30" rx="1.25" fill="#3B82F6" opacity="0.5" />
      <rect x="78" y="156" width="2.5" height="30" rx="1.25" fill="#3B82F6" opacity="0.5" />
      <rect x="84" y="158" width="2.5" height="30" rx="1.25" fill="#3B82F6" opacity="0.5" />
    </g>

    {/* Knife (right) */}
    <g transform="rotate(25, 270, 200)">
      <rect x="268" y="160" width="4" height="95" rx="2" fill="#3B82F6" opacity="0.5" />
      <path d="M267 160 L273 160 L272 125 L268 125 Z" fill="#3B82F6" opacity="0.5" />
    </g>

    {/* Decorative floating circles */}
    <circle cx="55" cy="100" r="5" fill="#3B82F6" opacity="0.15" />
    <circle cx="295" cy="90" r="7" fill="#3B82F6" opacity="0.1" />
    <circle cx="310" cy="280" r="6" fill="#3B82F6" opacity="0.12" />
    <circle cx="40" cy="290" r="4" fill="#3B82F6" opacity="0.15" />
    <circle cx="320" cy="170" r="5" fill="#3B82F6" opacity="0.1" />
    <circle cx="60" cy="180" r="3" fill="#3B82F6" opacity="0.2" />

    {/* Sparkle dots */}
    <circle cx="130" cy="130" r="2" fill="#FBBF24" />
    <circle cx="220" cy="125" r="2" fill="#FBBF24" />
    <circle cx="175" cy="108" r="1.5" fill="#FBBF24" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   REGISTER COMPONENT
   ═══════════════════════════════════════════════════════ */

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const registerData = {
          email: values.email,
          password: values.password,
        };

        const res = await api.post("/public/api/v1/auth/register", registerData);
        const result = res.data;

        if (result.success) {
          toast.success("Registration successful! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          toast.error(result.message || "Registration failed");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* ── input wrapper helper ── */
  const inputClass = (field) =>
    `w-full rounded-lg border ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
    } bg-transparent py-4 pl-6 pr-12 text-gray-800 placeholder-gray-400 outline-none 
     transition focus:border-transparent focus:ring-2 
     dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1200px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap">
          {/* ─────────── LEFT PANEL ─────────── */}
          <div className="hidden w-full items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 p-12 xl:flex xl:w-1/2">
            <div className="text-center">
              {/* Logo */}
              <Link to="/" className="mb-6 inline-block">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  🍽️ Restroly
                </span>
              </Link>

              <p className="mx-auto mb-10 max-w-sm text-lg leading-relaxed text-blue-100">
                Join our restaurant management platform.
                <br />
                Create an account to get started today.
              </p>

              <Illustration />
            </div>
          </div>

          {/* ─────────── RIGHT PANEL ─────────── */}
          <div className="w-full xl:w-1/2">
            <div className="w-full px-6 py-12 sm:px-14 lg:px-20 xl:py-20">
              {/* Mobile-only logo */}
              <div className="mb-8 flex items-center justify-center xl:hidden">
                <span className="text-2xl font-bold text-blue-600">
                  🍽️ Restroly
                </span>
              </div>

              <Link
                to="/"
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-gray-300 gap-2"
              >
                <ArrowLeft size={15} />
                Back to Home
              </Link>

              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Get started now!
              </p>
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Create Your Account
              </h2>

              {/* ── FORM ── */}
              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputClass("email")}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <EmailIcon />
                    </span>
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="6+ Characters, 1 Capital letter"
                      disabled={isLoading}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputClass("password")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputClass("confirmPassword")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon />
                      Creating Account…
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>

                {/* Sign-in link */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
