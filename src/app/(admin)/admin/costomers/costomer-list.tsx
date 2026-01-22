"use client";

import { useState } from "react";
import { CustomerManagerModal } from "./costumer-manage-modal";
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

    const handleOpenEdit = (customer: any) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    return (
        <>
            <CustomerManagerModal
                customer={selectedCustomer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={() => router.refresh()}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers?.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 space-y-6 hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">
                                    #{customer.client_code}
                                </p>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-blue-500 transition-colors">
                                    {customer.name}
                                </h3>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    customer.subscription_active
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : "bg-zinc-500/10 text-zinc-500 border-white/5"
                                }`}
                            >
                                {customer.subscription_active
                                    ? "Assinante"
                                    : "Avulso"}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                            <div>
                                <p className="text-zinc-500 text-[10px] font-black uppercase">
                                    Projetos
                                </p>
                                <p className="font-bold">
                                    {customer.projects
                                        ?.length || 0}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-zinc-500 text-[10px] font-black uppercase">
                                    Faturamento
                                </p>
                                <p className="font-bold text-blue-500">
                                    R${" "}
                                    {customer.total_spent?.toLocaleString() ||
                                        "0"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    handleOpenEdit(customer)
                                }
                                className="flex-1 bg-white/5 hover:bg-white/10 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Detalhes / Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
