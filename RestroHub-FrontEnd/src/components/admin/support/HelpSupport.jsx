import { useState } from 'react';
import toast from 'react-hot-toast';
import { LifeBuoy, Send } from 'lucide-react';
import api from '@services/common/api';
import { useAdminTheme } from '@context/AdminThemeContext';

const TITLE_MAX = 150;
const MESSAGE_MAX = 2000;

// Sends a title + message to the platform owner (superadmin) by email and in-app notification.
const HelpSupport = () => {
  const { isDark } = useAdminTheme();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter a title and a message');
      return;
    }
    setSending(true);
    try {
      await api.post('/secure/api/v1/support/tickets', {
        title: title.trim(),
        message: message.trim(),
      });
      toast.success('Your message was sent to our team. We will get back to you.');
      setTitle('');
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const field = `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
    isDark
      ? 'border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500'
      : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400'
  }`;
  const label = `mb-1.5 block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
          <LifeBuoy className="h-6 w-6" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Help &amp; Support
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Tell us what you need help with. Your message goes straight to the RestroHub team.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 rounded-xl border p-6 shadow-sm ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div>
          <label htmlFor="support-title" className={label}>
            Title
          </label>
          <input
            id="support-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX}
            placeholder="Short summary of your issue"
            className={field}
            required
          />
        </div>
        <div>
          <label htmlFor="support-message" className={label}>
            Message
          </label>
          <textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_MAX}
            rows={7}
            placeholder="Describe the problem or question in detail"
            className={field}
            required
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {message.length}/{MESSAGE_MAX}
          </p>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sending ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  );
};

export default HelpSupport;
