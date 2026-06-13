import { useParams, useNavigate } from "react-router-dom";

const mockOrder = {
    id: "ORD-2024-0042",
    date: "12 de junio, 2024",
    status: "Enviado",
    statusStep: 2,
    customer: {
        name: "María López",
        email: "maria@correo.com",
        address: "Calle 45 #23-10, Cali, Valle del Cauca",
    },
    items: [
        { id: 1, name: "Auriculares Bluetooth Pro", qty: 1, price: 189900 },
        { id: 2, name: "Funda protectora silicona", qty: 2, price: 24900 },
        { id: 3, name: "Cable USB-C 2m", qty: 1, price: 15900 },
    ],
    subtotal: 255600,
    shipping: 8900,
    total: 264500,
};

const STATUS_STEPS = ["Pendiente", "Confirmado", "Enviado", "Entregado"];

function formatCOP(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(value);
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const order = { ...mockOrder, id: id ?? mockOrder.id };

    return (
        <div
            className="min-h-screen py-10 px-4 font-sans"
            style={{ backgroundColor: "#0A0A1A", color: "#fff" }}
        >
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: "#16162A", color: "#a0a0c0" }}
                        aria-label="Volver"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#5B5FEF" }}>
                            Pedido
                        </p>
                        <h1 className="text-2xl font-bold leading-tight">{order.id}</h1>
                    </div>
                    <span
                        className="ml-auto px-3 py-1 rounded-full text-xs font-semibold"
                        style={
                            order.status === "Entregado"
                                ? { background: "#0d2e1f", color: "#34d399" }
                                : order.status === "Enviado"
                                    ? { background: "#1a1a3e", color: "#818cf8" }
                                    : { background: "#2a1e0a", color: "#fbbf24" }
                        }
                    >
                        {order.status}
                    </span>
                </div>

                {/* Tracker */}
                <div
                    className="rounded-2xl p-6"
                    style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                >
                    <h2 className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#6060a0" }}>
                        Estado del envío
                    </h2>
                    <div className="flex items-center">
                        {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                        style={
                                            i <= order.statusStep
                                                ? { background: "#5B5FEF", color: "#fff", boxShadow: "0 0 16px #5B5FEF55" }
                                                : { background: "#1e1e40", color: "#4040a0" }
                                        }
                                    >
                                        {i < order.statusStep ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : i + 1}
                                    </div>
                                    <span
                                        className="text-[10px] font-medium whitespace-nowrap"
                                        style={{ color: i <= order.statusStep ? "#818cf8" : "#4040a0" }}
                                    >
                                        {step}
                                    </span>
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                    <div
                                        className="flex-1 h-0.5 mb-6 mx-2 rounded-full"
                                        style={{ background: i < order.statusStep ? "#5B5FEF" : "#1e1e40" }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Productos */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                >
                    <div className="px-6 py-4" style={{ borderBottom: "1px solid #1e1e40" }}>
                        <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6060a0" }}>
                            Productos
                        </h2>
                    </div>
                    <ul>
                        {order.items.map((item, idx) => (
                            <li
                                key={item.id}
                                className="flex items-center gap-4 px-6 py-4"
                                style={idx < order.items.length - 1 ? { borderBottom: "1px solid #1a1a36" } : {}}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: "#1a1a3e" }}
                                >
                                    <svg className="w-5 h-5" style={{ color: "#5B5FEF" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "#6060a0" }}>Cantidad: {item.qty}</p>
                                </div>
                                <p className="text-sm font-semibold" style={{ color: "#818cf8" }}>
                                    {formatCOP(item.price * item.qty)}
                                </p>
                            </li>
                        ))}
                    </ul>
                    {/* Totales */}
                    <div className="px-6 py-5 space-y-2" style={{ borderTop: "1px solid #1e1e40", background: "#0e0e22" }}>
                        <div className="flex justify-between text-sm" style={{ color: "#6060a0" }}>
                            <span>Subtotal</span><span>{formatCOP(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm" style={{ color: "#6060a0" }}>
                            <span>Envío</span><span>{formatCOP(order.shipping)}</span>
                        </div>
                        <div
                            className="flex justify-between text-base font-bold pt-3"
                            style={{ borderTop: "1px solid #1e1e40" }}
                        >
                            <span>Total</span>
                            <span style={{ color: "#5B5FEF" }}>{formatCOP(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Info cliente */}
                <div
                    className="rounded-2xl p-6"
                    style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                >
                    <h2 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#6060a0" }}>
                        Información de entrega
                    </h2>
                    <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.customer.name}</p>
                        <p style={{ color: "#6060a0" }}>{order.customer.email}</p>
                        <p style={{ color: "#6060a0" }}>{order.customer.address}</p>
                    </div>
                </div>

                <p className="text-center text-xs pb-4" style={{ color: "#3a3a60" }}>
                    Pedido realizado el {order.date}
                </p>
            </div>
        </div>
    );
}