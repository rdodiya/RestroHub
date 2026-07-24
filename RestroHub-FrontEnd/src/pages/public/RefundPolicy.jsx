import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Refund Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: June 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Overview
            </h2>
            <p>
              At Restroly, we strive to ensure customer satisfaction. This Refund
              Policy explains when and how refunds may be issued for payments
              made through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Eligibility for Refunds
            </h2>
            <p>
              Refunds are considered for failed transactions, duplicate charges,
              or order cancellations initiated before the restaurant begins
              preparation. Refunds for change-of-mind requests are handled at
              the discretion of the restaurant.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              How to Request a Refund
            </h2>
            <p>
              To request a refund, please contact Restroly Support at
              support@restroly.com with your order ID, payment details, and a
              brief description of the issue. We will review the request and
              respond within 3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Refund Processing Time
            </h2>
            <p>
              Approved refunds are processed within 5-10 business days. The
              exact timing depends on your payment provider and bank.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h2>
            <p>
              If you have questions about refunds, please reach out to:
            </p>
            <div className="mt-3 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                Restroly Support
              </p>
              <p>Email: support@restroly.com</p>
              <p>Address: India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
