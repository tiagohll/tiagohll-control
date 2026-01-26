"use client";

import { useState } from "react";
import {
    UserPlus,
    Mail,
    Phone,
    ArrowUpRight,
    Zap,
} from "lucide-react";
import { CustomerManagerModal } from "./costomer-manage-modal";
import { useRouter } from "next/navigation";

export function CustomersList({
    customers,
}: {
    customers: any[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] =
        useState<any>(null);
    const router = useRouter();

    const handleEdit = (customer: any) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Clientes
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                        {customers.length} registros
                        encontrados na base
                    </p>
                </div>

                <button
                    onClick={handleAddNew}
                    className="group relative bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-tighter text-sm transition-all flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <UserPlus
                        size={18}
                        className="relative z-10"
                    />
                    <span className="relative z-10">
                        Novo Cliente
                    </span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div
                        key={customer.id}
                        className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-blue-500/50 hover:bg-zinc-900/50 shadow-none hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                    >
                        {/* Indicador de Status */}
                        <div className="absolute top-8 right-8">
                            <div
                                className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                                    customer.subscriptions
                                        ?.status ===
                                    "active"
                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                        : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                                }`}
                            >
                                <Zap
                                    size={10}
                                    fill="currentColor"
                                />
                                <span className="text-[9px] font-black uppercase tracking-wider">
                                    {customer.subscriptions
                                        ?.status ===
                                    "active"
                                        ? "Ativo"
                                        : "Off"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Header do Card */}
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
                                    ID:{" "}
                                    {customer.client_code ||
                                        "---"}
                                </p>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors">
                                    {customer.name}
                                </h3>
                            </div>

                            {/* Info de Contato */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                        <Phone size={14} />
                                    </div>
                                    <span className="text-sm font-medium">
                                        {customer.whatsapp ||
                                            "Sem contato"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-sm font-medium truncate">
                                        {customer.email ||
                                            "Sem e-mail"}
                                    </span>
                                </div>
                            </div>

                            {/* Footer do Card */}
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase">
                                        Mensalidade
                                    </p>
                                    <p className="text-lg font-black italic">
                                        R${" "}
                                        {customer.subscriptions?.monthly_fee?.toFixed(
                                            2
                                        ) || "0,00"}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        handleEdit(customer)
                                    }
                                    className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl text-[11px] font-black uppercase italic transition-all hover:bg-blue-500 hover:text-white active:scale-95"
                                >
                                    Gerenciar{" "}
                                    <ArrowUpRight
                                        size={14}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CustomerManagerModal
                customer={selectedCustomer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={() => router.refresh()}
            />
        </>
    );
}
