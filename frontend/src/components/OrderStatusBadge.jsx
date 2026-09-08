import { jsx as _jsx } from "react/jsx-runtime";
const CONFIG = {
    Pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    Confirmed: { label: 'Confirmed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    Preparing: { label: 'Preparing', className: 'bg-orange-50 text-orange-700 border-orange-200' },
    'Out for Delivery': { label: 'Out for Delivery', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    Delivered: { label: 'Delivered', className: 'bg-green-50 text-green-700 border-green-200' },
    Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' },
};
export default function OrderStatusBadge({ status }) {
    const { label, className } = CONFIG[status] ?? CONFIG.Pending;
    return (_jsx("span", { className: `inline-flex text-xs font-semibold border px-2.5 py-0.5 rounded-full ${className}`, children: label }));
}
