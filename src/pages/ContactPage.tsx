import { useState } from "react";

type FormState = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
    "Consulta sobre un pedido",
    "Problema con un producto",
    "Devoluciones y reembolsos",
    "Información de envíos",
    "Otro",
];

export default function ContactPage() {
    const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const errors: Partial<Record<keyof FormState, string>> = {
        name: !form.name.trim() ? "Requerido" : undefined,
        email: !form.email.trim() ? "Requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Correo inválido" : undefined,
        subject: !form.subject ? "Selecciona un asunto" : undefined,
        message: form.message.trim().length < 10 ? "Mínimo 10 caracteres" : undefined,
    };
    const isValid = Object.values(errors).every((e) => !e);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });
        if (!isValid) return;
        setStatus("loading");
        try {
            await new Promise((res) => setTimeout(res, 1500));
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
            setTouched({});
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4 font-sans"
                style={{ backgroundColor: "#0A0A1A" }}
            >
                <div
                    className="rounded-2xl p-10 max-w-md w-full text-center"
                    style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: "#0d2e1f", boxShadow: "0 0 20px #34d39930" }}
                    >
                        <svg className="w-8 h-8" style={{ color: "#34d399" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: "#fff" }}>Mensaje enviado</h2>
                    <p className="text-sm mb-6" style={{ color: "#6060a0" }}>
                        Gracias por escribirnos. Te respondemos al correo registrado en menos de 24 horas.
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "#5B5FEF", color: "#fff" }}
                    >
                        Enviar otro mensaje
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen py-10 px-4 font-sans"
            style={{ backgroundColor: "#0A0A1A", color: "#fff" }}
        >
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#5B5FEF" }}>
                        Soporte
                    </p>
                    <h1 className="text-3xl font-bold leading-tight">¿En qué podemos ayudarte?</h1>
                    <p className="mt-2 text-sm" style={{ color: "#6060a0" }}>
                        Completa el formulario y te respondemos en menos de 24 horas.
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                >
                    {/* Accent bar igual que el hero del sitio */}
                    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #5B5FEF, #7c3aed)" }} />

                    <div className="p-6 sm:p-8 space-y-5">

                        {/* Nombre + Email */}
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field
                                label="Nombre"
                                name="name"
                                type="text"
                                value={form.name}
                                placeholder="Tu nombre"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name ? errors.name : undefined}
                            />
                            <Field
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                value={form.email}
                                placeholder="tu@correo.com"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email ? errors.email : undefined}
                            />
                        </div>

                        {/* Asunto */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "#a0a0c8" }}>
                                Asunto <span style={{ color: "#f87171" }}>*</span>
                            </label>
                            <select
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all appearance-none"
                                style={{
                                    background: "#0e0e22",
                                    border: touched.subject && errors.subject ? "1px solid #f87171" : "1px solid #2a2a50",
                                    color: form.subject ? "#fff" : "#4040a0",
                                    boxShadow: "none",
                                }}
                            >
                                <option value="" disabled style={{ color: "#4040a0" }}>Selecciona un asunto…</option>
                                {SUBJECTS.map((s) => (
                                    <option key={s} value={s} style={{ color: "#fff", background: "#12122A" }}>{s}</option>
                                ))}
                            </select>
                            {touched.subject && errors.subject && (
                                <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.subject}</p>
                            )}
                        </div>

                        {/* Mensaje */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "#a0a0c8" }}>
                                Mensaje <span style={{ color: "#f87171" }}>*</span>
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={5}
                                placeholder="Cuéntanos tu situación con el mayor detalle posible…"
                                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all"
                                style={{
                                    background: "#0e0e22",
                                    border: touched.message && errors.message ? "1px solid #f87171" : "1px solid #2a2a50",
                                    color: "#fff",
                                    caretColor: "#5B5FEF",
                                }}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {touched.message && errors.message
                                    ? <p className="text-xs" style={{ color: "#f87171" }}>{errors.message}</p>
                                    : <span />}
                                <p className="text-xs ml-auto" style={{ color: "#3a3a60" }}>{form.message.length} caracteres</p>
                            </div>
                        </div>

                        {/* Error global */}
                        {status === "error" && (
                            <div
                                className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
                                style={{ background: "#2a0a0a", border: "1px solid #7f1d1d", color: "#fca5a5" }}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Algo salió mal. Intenta de nuevo.
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={status === "loading"}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            style={{ background: "#5B5FEF", color: "#fff", boxShadow: "0 0 20px #5B5FEF40" }}
                        >
                            {status === "loading" ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Enviando…
                                </>
                            ) : "Enviar mensaje"}
                        </button>
                    </div>
                </div>

                {/* Info adicional */}
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {[
                        { icon: "📧", label: "Email directo", value: "soporte@techstore.co" },
                        { icon: "🕐", label: "Horario de atención", value: "Lun – Vie, 8 am – 6 pm" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl px-5 py-4 flex items-center gap-3"
                            style={{ background: "#12122A", border: "1px solid #1e1e40" }}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                                <p className="text-xs" style={{ color: "#4040a0" }}>{item.label}</p>
                                <p className="text-sm font-medium" style={{ color: "#a0a0c8" }}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Field({
    label, name, type, value, placeholder, onChange, onBlur, error,
}: {
    label: string; name: string; type: string; value: string; placeholder?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#a0a0c8" }}>
                {label} <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                    background: "#0e0e22",
                    border: error ? "1px solid #f87171" : "1px solid #2a2a50",
                    color: "#fff",
                    caretColor: "#5B5FEF",
                }}
            />
            {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
        </div>
    );
}