import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const STEP_LABELS = {
    Pending: 'Order Placed',
    Confirmed: 'Order Confirmed',
    Preparing: 'Being Prepared',
    'Out for Delivery': 'Out for Delivery',
    Delivered: 'Delivered',
};
const STEP_DESC = {
    Pending: 'Your order has been received.',
    Confirmed: 'The restaurant confirmed your order.',
    Preparing: 'The kitchen is preparing your food.',
    'Out for Delivery': 'A rider is on the way.',
    Delivered: 'Enjoy your meal!',
};
export default function OrderTimeline({ currentStatus }) {
    if (currentStatus === 'Cancelled') {
        return (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0", children: _jsxs("svg", { className: "w-4 h-4 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18", strokeLinecap: "round" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18", strokeLinecap: "round" })] }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-red-800 text-sm", children: "Order Cancelled" }), _jsx("p", { className: "text-xs text-red-600 mt-0.5", children: "This order has been cancelled." })] })] }));
    }
    const currentIdx = STEPS.indexOf(currentStatus);
    return (_jsx("div", { className: "space-y-0", children: STEPS.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isActive = idx === currentIdx;
            const isFuture = idx > currentIdx;
            return (_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex flex-col items-center flex-shrink-0 w-8", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all ${isDone
                                    ? 'bg-green-500 text-white shadow-sm shadow-green-500/30'
                                    : isActive
                                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/40 ring-4 ring-orange-100'
                                        : 'bg-stone-100 text-stone-400'}`, children: isDone ? (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("polyline", { points: "20 6 9 17 4 12", strokeLinecap: "round", strokeLinejoin: "round" }) })) : isActive ? (_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-white animate-pulse" })) : (_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-stone-300" })) }), idx < STEPS.length - 1 && (_jsx("div", { className: `w-0.5 flex-1 my-1 ${isDone ? 'bg-green-400' : 'bg-stone-200'}`, style: { minHeight: 28 } }))] }), _jsxs("div", { className: `pb-6 pt-1.5 ${idx === STEPS.length - 1 ? 'pb-0' : ''}`, children: [_jsx("p", { className: `text-sm font-semibold ${isDone ? 'text-green-700' : isActive ? 'text-orange-700' : isFuture ? 'text-stone-400' : ''}`, children: STEP_LABELS[step] }), (isDone || isActive) && (_jsx("p", { className: `text-xs mt-0.5 ${isDone ? 'text-stone-500' : 'text-stone-600'}`, children: STEP_DESC[step] }))] })] }, step));
        }) }));
}
