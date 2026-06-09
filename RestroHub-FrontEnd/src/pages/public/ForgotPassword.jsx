import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "@services/common/api";
import { useTheme } from "@context/ThemeContext";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .transform((value) => value?.trim())
    .email("Enter a valid email address")
    .required("Email is required"),
});

const resetPasswordSchema = Yup.object({
  token: Yup.string()
    .transform((value) => value?.trim())
    .min(5, "Reset code must be at least 5 characters")
    .max(64, "Reset code is too long")
    .required("Reset code is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]).{8,}$/,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const getApiMessage = (payload, fallback) => {
  if (typeof payload === "string") {
    return payload;
  }

  return payload?.message || payload?.data?.message || fallback;
};

const PASSWORD_RESET_SUCCESS_MESSAGE = "Password reset successful";
const DEFAULT_COMPLETION_MESSAGE =
  "You can now sign in with your new password.";

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

const LockIcon = () => (
  <svg
    className="fill-current text-gray-400"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 8h-1V6.5C16 4.01 13.99 2 11.5 2S7 4.01 7 6.5V8H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-8 0V6.5C9 5.12 10.12 4 11.5 4S14 5.12 14 6.5V8H9Zm3.5 8.73V18h-2v-1.27A2 2 0 1 1 12.5 16.73Z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Zm2 5.29A7.96 7.96 0 0 1 4 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65Z"
    />
  </svg>
);

const Illustration = () => (
  <svg
    width="350"
    height="350"
    viewBox="0 0 350 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="175" cy="232" rx="112" ry="30" fill="#E2E8F0" />
    <rect x="112" y="118" width="126" height="104" rx="18" fill="#EFF6FF" />
    <rect
      x="112"
      y="118"
      width="126"
      height="104"
      rx="18"
      stroke="#3B82F6"
      strokeWidth="3"
    />
    <path
      d="M140 118V92c0-20 16-36 36-36s36 16 36 36v26"
      stroke="#3B82F6"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <circle cx="175" cy="166" r="14" fill="#3B82F6" />
    <path
      d="M175 180v22"
      stroke="#3B82F6"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M88 252h174"
      stroke="#93C5FD"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="76" cy="118" r="7" fill="#FBBF24" />
    <circle cx="278" cy="96" r="9" fill="#93C5FD" />
    <circle cx="286" cy="232" r="6" fill="#FBBF24" />
  </svg>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [step, setStep] = useState("request");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const forgotPasswordFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async ({ email }) => {
      setIsRequestLoading(true);
      setSubmitError("");
      setSuccessMessage("");
      const normalizedEmail = email.trim();

      try {
        const res = await api.post("/public/api/v1/auth/forgot-password", null, {
          params: { email: normalizedEmail },
        });

        if (res.data?.success === false) {
          throw new Error(
            getApiMessage(res.data, "Unable to send reset instructions.")
          );
        }

        const message = getApiMessage(
          res.data,
          "Reset code sent successfully. Please check your email."
        );

        setRequestedEmail(normalizedEmail);
        setSuccessMessage(message);
        setSubmitError("");
        setStep("reset");
        toast.success(message);
      } catch (err) {
        const message =
          getApiMessage(err.response?.data) ||
          err.message ||
          "Unable to send reset instructions. Please try again.";

        setSuccessMessage("");
        setSubmitError(message);
        toast.error(message);
      } finally {
        setIsRequestLoading(false);
      }
    },
  });

  const resetPasswordFormik = useFormik({
    initialValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async ({ token, newPassword }) => {
      setIsResetLoading(true);
      setSubmitError("");
      setSuccessMessage("");

      try {
        const resetPasswordData = new URLSearchParams({
          email: requestedEmail,
          token: token.trim(),
          newPassword,
        });

        const res = await api.post(
          "/public/api/v1/auth/reset-password",
          resetPasswordData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (res.data?.success === false) {
          throw new Error(getApiMessage(res.data, "Password reset failed."));
        }

        const message = getApiMessage(
          res.data,
          "Password reset successful. Please sign in with your new password."
        );

        setSuccessMessage(
          message === PASSWORD_RESET_SUCCESS_MESSAGE
            ? DEFAULT_COMPLETION_MESSAGE
            : message
        );
        setSubmitError("");
        setStep("complete");
        toast.success(message);
      } catch (err) {
        const message =
          getApiMessage(err.response?.data) ||
          err.message ||
          "Password reset failed.";

        setSuccessMessage("");
        setSubmitError(message);
        toast.error(message);
      } finally {
        setIsResetLoading(false);
      }
    },
  });

  const inputClass = (formik, field) =>
    `w-full rounded-lg border ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
    } bg-transparent py-4 pl-6 pr-12 text-gray-800 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500`;

  const renderFieldError = (formik, field) =>
    formik.touched[field] &&
    formik.errors[field] && (
      <p className="mt-1.5 text-xs text-red-500">{formik.errors[field]}</p>
    );

  const resetToEmailStep = () => {
    setStep("request");
    setRequestedEmail("");
    setSuccessMessage("");
    setSubmitError("");
    resetPasswordFormik.resetForm();
  };

  const handleResetFieldChange = (event) => {
    if (successMessage) {
      setSuccessMessage("");
    }
    if (submitError) {
      setSubmitError("");
    }
    resetPasswordFormik.handleChange(event);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1200px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap">
          <div className="hidden w-full items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 p-12 xl:flex xl:w-1/2">
            <div className="text-center">
              <Link to="/" className="mb-6 inline-block">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  Restroly
                </span>
              </Link>

              <p className="mx-auto mb-10 max-w-sm text-lg leading-relaxed text-blue-100">
                Reset your password and get back to managing your restaurant.
              </p>

              <Illustration />
            </div>
          </div>

          <div className="w-full xl:w-1/2">
            <div className="w-full px-6 py-12 sm:px-14 lg:px-20 xl:py-20">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-gray-700"
                >
                  {isDark ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mb-8 flex items-center justify-center xl:hidden">
                <span className="text-2xl font-bold text-blue-600">
                  Restroly
                </span>
              </div>

              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Forgot your password?
              </p>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {step === "complete" ? "Password Updated" : "Reset Password"}
              </h2>
              <p className="mb-8 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {step === "request"
                  ? "Enter your registered email address and we will send a reset code."
                  : step === "complete"
                    ? "Your password has been updated successfully. You can now sign in with your new password."
                    : "Use the reset code sent to your email and choose a new password."}
              </p>

              {submitError && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">
                  {submitError}
                </div>
              )}

              {successMessage && step !== "complete" && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200">
                  {successMessage}
                </div>
              )}

              {step === "request" && (
                <form onSubmit={forgotPasswordFormik.handleSubmit} noValidate>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email address"
                        disabled={isRequestLoading}
                        value={forgotPasswordFormik.values.email}
                        onChange={forgotPasswordFormik.handleChange}
                        onBlur={forgotPasswordFormik.handleBlur}
                        className={inputClass(forgotPasswordFormik, "email")}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <EmailIcon />
                      </span>
                    </div>
                    {renderFieldError(forgotPasswordFormik, "email")}
                  </div>

                  <button
                    type="submit"
                    disabled={isRequestLoading}
                    className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  >
                    {isRequestLoading ? (
                      <>
                        <SpinnerIcon />
                        Sending Code...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                </form>
              )}

              {step === "reset" && (
                <form onSubmit={resetPasswordFormik.handleSubmit} noValidate>
                  <div className="mb-5">
                    <label
                      htmlFor="token"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Reset Code
                    </label>
                    <div className="relative">
                      <input
                        id="token"
                        name="token"
                        type="text"
                        autoComplete="one-time-code"
                        placeholder="Enter code from email"
                        disabled={isResetLoading}
                        value={resetPasswordFormik.values.token}
                        onChange={handleResetFieldChange}
                        onBlur={resetPasswordFormik.handleBlur}
                        className={inputClass(resetPasswordFormik, "token")}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <LockIcon />
                      </span>
                    </div>
                    {renderFieldError(resetPasswordFormik, "token")}
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter new password"
                        disabled={isResetLoading}
                        value={resetPasswordFormik.values.newPassword}
                        onChange={handleResetFieldChange}
                        onBlur={resetPasswordFormik.handleBlur}
                        className={inputClass(
                          resetPasswordFormik,
                          "newPassword"
                        )}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <LockIcon />
                      </span>
                    </div>
                    {renderFieldError(resetPasswordFormik, "newPassword")}
                  </div>

                  <div className="mb-6">
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
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                        disabled={isResetLoading}
                        value={resetPasswordFormik.values.confirmPassword}
                        onChange={handleResetFieldChange}
                        onBlur={resetPasswordFormik.handleBlur}
                        className={inputClass(
                          resetPasswordFormik,
                          "confirmPassword"
                        )}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <LockIcon />
                      </span>
                    </div>
                    {renderFieldError(resetPasswordFormik, "confirmPassword")}
                  </div>

                  <button
                    type="submit"
                    disabled={isResetLoading}
                    className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  >
                    {isResetLoading ? (
                      <>
                        <SpinnerIcon />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetToEmailStep}
                    className="w-full text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Use another email
                  </button>
                </form>
              )}

              {step === "complete" && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200">
                  <p className="font-medium">Password reset successful</p>
                  <p className="mt-2">{successMessage}</p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {step !== "complete" && (
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign In
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
