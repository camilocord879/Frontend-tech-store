import { useState } from "react";

type OrderStatus = "Todos" | "Pendiente" | "Confirmado" | "Enviado" | "Entregado";

const ALL_ORDERS = [
    { id: "ORD-0089", customer: "María López", email: "maria@correo.com", status: "Enviado", total: 264500, date: "12 jun 2024" },
    { id: "ORD-0088", customer: "Carlos Pérez", email: "carlos@correo.com", status: "Confirmado", total: 89900, date: "11 jun 2024" },
    { id: "ORD-0087", customer: "Ana Gómez", email: "ana@correo.com", status: "Pendiente", total: 45000, date: "10 jun 2024" },
    { id: "ORD-0086", customer: "Luis Torres", email: "luis@correo.com", status: "Entregado", total: 320000, date: "9 jun 2024" },
    { id: "ORD-0085", customer: "Sofía Ruiz", email: "sofia@correo.com", status: "Entregado", total: 175000, date: "8 jun 2024" },
    { id: "ORD-0084", customer: "Jorge Díaz", email: "jorge@correo.com", status: "Pendiente", total: 60000, date: "7 jun 2024" },
];

const STATUS_TABS: OrderStatus[] = ["Todos", "Pendiente", "Confirmado", "Enviado", "Entregado"];

function statusStyle(s: string) {
    if (s === "Entregado") return { background: "#0d2e1f", color: "#34d399" };
    if (s === "Enviado") return { background: "#1a1a3e", color: "#818cf8" };
    if (s === "Confirmado") return { background: "#1a2a1a", color: "#86efac" };
    return { background: "#2a1e0a", color: "#fbbf24" };
}

function formatCOP(v: number) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);
}

export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("Todos");
    const [search, setSearch] = useState("");

    const filtered = ALL_ORDERS.filter((o) => {
        const matchTab = activeTab === "Todos" || o.status === activeTab;
        const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <div className="min-h-screen py-10 px-4 font-sans" style={{ backgroundColor: "#0A0A1A", color: "#fff" }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#5B5FEF" }}>Admin</p>
                        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
                    </div>
                    {/* Búsqueda */}
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4040a0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por ID o cliente…"
                            className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                            style={{ background: "#12122A", border: "1px solid #2a2a50", color: "#fff", width: 240 }}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#12122A", border: "1px solid #1e1e40" }}>
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={activeTab === tab
                                ? { background: "#5B5FEF", color: "#fff", boxShadow: "0 0 12px #5B5FEF50" }
                                : { color: "#6060a0" }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tabla */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "#12122A", border: "1px solid #1e1e40" }}>
                    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #5B5FEF, #7c3aed)" }} />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #1a1a36" }}>
                                    {["ID", "Cliente", "Fecha", "Estado", "Total", "Acción"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4040a0" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-sm" style={{ color: "#4040a0" }}>
                                            No se encontraron pedidos
                                        </td>
                                    </tr>
                                ) : filtered.map((o, i) => (
                                    <tr key={o.id} className="group transition-colors" style={i < filtered.length - 1 ? { borderBottom: "1px solid #16162e" } : {}}>
                                        <td className="px-6 py-4 font-mono text-xs" style={{ color: "#818cf8" }}>{o.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{o.customer}</p>
                                            <p className="text-xs mt-0.5" style={{ color: "#4040a0" }}>{o.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs" style={{ color: "#6060a0" }}>{o.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={statusStyle(o.status)}>{o.status}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold" style={{ color: "#818cf8" }}>{formatCOP(o.total)}</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/admin/orders/${o.id}`}
                                                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                                style={{ background: "#1a1a3e", color: "#818cf8" }}
                                            >
                                                Ver →
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length > 0 && (
                        <div className="px-6 py-3 text-xs" style={{ borderTop: "1px solid #1e1e40", color: "#4040a0" }}>
                            {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}