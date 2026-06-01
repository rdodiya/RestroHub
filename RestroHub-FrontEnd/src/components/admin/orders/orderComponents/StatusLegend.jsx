import { Clock, ChefHat, CheckCircle2, Receipt, CreditCard, XCircle } from 'lucide-react';

const StatusLegend = () => {
  const statuses = [
    { icon: Clock, label: 'Pending', color: 'text-yellow-600' },
    { icon: ChefHat, label: 'Preparing', color: 'text-blue-600' },
    { icon: CheckCircle2, label: 'Ready', color: 'text-green-600' },
    { icon: Receipt, label: 'Billed', color: 'text-purple-600' },
    { icon: CreditCard, label: 'Completed', color: 'text-gray-600' },
    { icon: XCircle, label: 'Cancelled', color: 'text-red-600' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="text-gray-500 font-medium">Status:</span>
      {statuses.map((status) => {
        const Icon = status.icon;
        return (
          <div key={status.label} className="flex items-center gap-1.5">
            <Icon className={`w-4 h-4 ${status.color}`} />
            <span className="text-gray-700">{status.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusLegend;