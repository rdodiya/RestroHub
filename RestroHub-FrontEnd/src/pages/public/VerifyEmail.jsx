import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@services/common/api';

// Confirms the emailed token. Deliberately does NOT log the user in: approval comes first.
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setState({ loading: false, error: 'Missing verification token.' });
      return;
    }
    api
      .post('/public/api/v1/auth/verify-email', null, { params: { token } })
      .then(() => setState({ loading: false, error: '' }))
      .catch((err) =>
        setState({
          loading: false,
          error: err.response?.data?.message || 'Verification failed. Try again.',
        })
      );
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {state.loading ? (
          <p className="text-gray-500 dark:text-gray-400">Verifying your email…</p>
        ) : state.error ? (
          <>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Verification failed
            </h2>
            <p className="mb-6 text-sm text-red-500">{state.error}</p>
            <Link to="/register" className="text-sm font-medium text-blue-600 hover:underline">
              Back to registration
            </Link>
          </>
        ) : (
          <>
            <div className="mb-4 text-6xl">⏳</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Email verified — pending approval
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Our team will review your request. You&apos;ll get an email once it&apos;s approved,
              and then you can sign in and set up your restaurant.
            </p>
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
