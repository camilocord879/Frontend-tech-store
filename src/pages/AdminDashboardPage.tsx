import { useEffect, useState } from "react";
import { Product, Order } from "@/types";
import { adminService } from "@/services/adminService.js";

export interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalSales: number;
    lowStockProducts: Product[];
    recentOrders: Order[];
}

const stats = [
    {
        label: "Usuarios",
        value: "1.284",
        change: "+12%",
        up: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        label: "Productos",
        value: "342",
        change: "+5%",
        up: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        label: "Pedidos",
        value: "89",
        change: "-3%",
        up: false,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        label: "Ventas",
        value: "$24.5M",
        change: "+18%",
        up: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

const recentOrders = [
    { id: "ORD-0089", customer: "María López", status: "Enviado", total: 264500 },
    { id: "ORD-0088", customer: "Carlos Pérez", status: "Confirmado", total: 89900 },
    { id: "ORD-0087", customer: "Ana Gómez", status: "Pendiente", total: 45000 },
    { id: "ORD-0086", customer: "Luis Torres", status: "Entregado", total: 320000 },
    { id: "ORD-0085", customer: "Sofía Ruiz", status: "Entregado", total: 175000 },
];

function statusStyle(s: string) {
    if (s === "Entregado") return { background: "#0d2e1f", color: "#34d399" };
    if (s === "Enviado") return { background: "#1a1a3e", color: "#818cf8" };
    if (s === "Confirmado") return { background: "#1a2a1a", color: "#86efac" };
    return { background: "#2a1e0a", color: "#fbbf24" };
}

function formatCOP(v: number) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);
}

export default function AdminDashboardPage() {
    const [dashboard, setDashboard] =
        useState<DashboardStats | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data =
                    await adminService.getDashboardStats();

                setDashboard(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    backgroundColor: "#0A0A1A",
                    color: "#fff",
                }}
            >
                Cargando dashboard...
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    backgroundColor: "#0A0A1A",
                    color: "#fff",
                }}
            >
                Error cargando dashboard
            </div>
        );
    }

    const stats = [
        {
            label: "Usuarios",
            value: dashboard.totalUsers,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ),
        },

        {
            label: "Productos",
            value: dashboard.totalProducts,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
        },

        {
            label: "Pedidos",
            value: dashboard.totalOrders,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },

        {
            label: "Ventas",
            value: formatCOP(dashboard.totalSales),
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    ];
}