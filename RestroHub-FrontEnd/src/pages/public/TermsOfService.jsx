import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: July 2026
          </p>
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Restroly (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service. If you do not agree, please do not
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Description of Service
            </h2>
            <p>
              Restroly provides digital menu, order management, QR menu, and
              related restaurant operations tools. Features available to you may
              depend on your subscription plan and restaurant configuration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Accounts and Responsibilities
            </h2>
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Providing accurate restaurant and business information</li>
              <li>Complying with applicable laws while using the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Acceptable Use
            </h2>
            <p>
              You agree not to misuse the Service, including attempting unauthorized
              access, disrupting system availability, uploading harmful content, or
              using the platform for unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Payments and Subscriptions
            </h2>
            <p>
              Paid plans are billed according to the pricing shown at purchase.
              Fees are non-refundable except where required by law or stated in our
              Refund Policy. We may change plan pricing with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Intellectual Property
            </h2>
            <p>
              The Service, including software, branding, and documentation, is owned
              by Restroly or its licensors. You retain ownership of content you
              upload (menus, images, and restaurant data), and grant us a license to
              host and display that content as needed to operate the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Disclaimer and Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind.
              To the maximum extent permitted by law, Restroly is not liable for
              indirect, incidental, or consequential damages arising from your use
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              8. Termination
            </h2>
            <p>
              We may suspend or terminate access if you violate these Terms. You may
              stop using the Service at any time. Provisions that by nature should
              survive termination will continue to apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Service after changes become effective constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              10. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, contact us at:
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

export default TermsOfService;
