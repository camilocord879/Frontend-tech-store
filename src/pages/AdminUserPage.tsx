import { useState } from "react";

type UserRole = "Todos" | "admin" | "cliente";

const ALL_USERS = [
    { id: 1, name: "María López", email: "maria@correo.com", role: "cliente", orders: 5, joined: "3 ene 2024", avatar: "ML" },
    { id: 2, name: "Carlos Pérez", email: "carlos@correo.com", role: "cliente", orders: 2, joined: "15 feb 2024", avatar: "CP" },
    { id: 3, name: "Admin TechStore", email: "admin@techstore.co", role: "admin", orders: 0, joined: "1 ene 2024", avatar: "AT" },
    { id: 4, name: "Ana Gómez", email: "ana@correo.com", role: "cliente", orders: 8, joined: "20 mar 2024", avatar: "AG" },
    { id: 5, name: "Luis Torres", email: "luis@correo.com", role: "cliente", orders: 1, joined: "5 abr 2024", avatar: "LT" },
    { id: 6, name: "Sofía Ruiz", email: "sofia@correo.com", role: "cliente", orders: 3, joined: "12 may 2024", avatar: "SR" },
];

const ROLE_TABS: UserRole[] = ["Todos", "admin", "cliente"];

function roleStyle(r: string) {
    return r === "admin"
        ? { background: "#1a1a3e", color: "#818cf8" }
        : { background: "#12122A", color: "#6060a0", border: "1px solid #2a2a50" };
}

function avatarColor(name: string) {
    const colors = ["#5B5FEF", "#7c3aed", "#2563eb", "#0891b2", "#059669"];
    return colors[name.charCodeAt(0) % colors.length];
}

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState<UserRole>("Todos");
    const [search, setSearch] = useState("");

    const filtered = ALL_USERS.filter((u) => {
        const matchTab = activeTab === "Todos" || u.role === activeTab;
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <div className="min-h-screen py-10 px-4 font-sans" style={{ backgroundColor: "#0A0A1A", color: "#fff" }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#5B5FEF" }}>Admin</p>
                        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Búsqueda */}
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4040a0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar usuario…"
                                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                                style={{ background: "#12122A", border: "1px solid #2a2a50", color: "#fff", width: 220 }}
                            />
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: "#5B5FEF", color: "#fff", boxShadow: "0 0 14px #5B5FEF40" }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo usuario
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#12122A", border: "1px solid #1e1e40" }}>
                    {ROLE_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
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
                                    {["Usuario", "Email", "Rol", "Pedidos", "Miembro desde", "Acción"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4040a0" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-sm" style={{ color: "#4040a0" }}>
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                ) : filtered.map((u, i) => (
                                    <tr key={u.id} style={i < filtered.length - 1 ? { borderBottom: "1px solid #16162e" } : {}}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                    style={{ background: avatarColor(u.name) + "22", color: avatarColor(u.name) }}
                                                >
                                                    {u.avatar}
                                                </div>
                                                <span className="font-medium">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs" style={{ color: "#6060a0" }}>{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={roleStyle(u.role)}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold" style={{ color: u.orders > 0 ? "#818cf8" : "#4040a0" }}>{u.orders}</td>
                                        <td className="px-6 py-4 text-xs" style={{ color: "#6060a0" }}>{u.joined}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                                    style={{ background: "#1a1a3e", color: "#818cf8" }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                                                    style={{ background: "#2a0a0a", color: "#f87171" }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length > 0 && (
                        <div className="px-6 py-3 text-xs" style={{ borderTop: "1px solid #1e1e40", color: "#4040a0" }}>
                            {filtered.length} usuario{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}