// src/pages/public/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import api from "@services/common/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8181/restroly";

const validationSchema = Yup.object({
    username: Yup.string().required("Email or username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
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

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10.22c.01-.69-.06-1.37-.22-2.04H10.2v3.71h5.63a4.8 4.8 0 0 1-2.09 3.15l3.03 2.3C18.89 15.83 20 13.27 20 10.22Z" fill="#4285F4" />
    <path d="M10.21 20c2.75 0 5.07-.89 6.76-2.42l-3.22-2.45a6.12 6.12 0 0 1-9.35-3.16l-3.27 2.4A10.2 10.2 0 0 0 10.21 20Z" fill="#34A853" />
    <path d="M4.4 11.98A6.1 6.1 0 0 1 4.06 10c0-.69.12-1.36.33-1.98L1.13 5.63A10.01 10.01 0 0 0 0 10c0 1.56.37 3.1 1.09 4.49l3.31-2.51Z" fill="#FBBC05" />
    <path d="M10.21 3.87c1.46-.02 2.87.49 3.94 1.43l2.88-2.76A10.2 10.2 0 0 0 10.21 0 10.2 10.2 0 0 0 1.09 5.51l3.3 2.51a6.1 6.1 0 0 1 5.82-4.15Z" fill="#EB4335" />
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
   LOGIN COMPONENT
   ═══════════════════════════════════════════════════════ */

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const res = await api.post("/public/api/v1/auth/login", values);

        const result = res.data;

        if (result.success) {
          const { accessToken, refreshToken, roles } = result.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("roles", JSON.stringify(roles));

          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          toast.success("Login successful!");

          navigate("/admin/dashboard");
        } else {
          toast.error(result.message || "Login failed");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Invalid username or password"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

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
                Manage your restaurant operations seamlessly.
                <br />
                Sign in to access your dashboard.
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

              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Welcome back!
              </p>
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Sign In to Restroly
              </h2>

              {/* ── FORM ── */}
              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-5">
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                   <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter email or username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputClass("username")}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <EmailIcon />
                    </span>
                  </div>
                  {formik.touched.username && formik.errors.username && (
                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.username}</p>
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
                      autoComplete="current-password"
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

                {/* Forgot password */}
                <div className="mb-6 flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot Password?
                  </Link>
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
                      Signing In…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                {/* <div className="relative mb-5 flex items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-600" />
                  <span className="mx-4 shrink-0 text-xs uppercase text-gray-400 dark:text-gray-500">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-600" />
                </div>

                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-6 py-4 text-base font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button> */}

                {/* Sign-up link */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign Up
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

export default Login;