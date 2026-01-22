"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    PackageOpen,
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    Search,
    User,
    UserPlus,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposals: any[];
    customers: any[];
    onCreate: (data: any) => void;
    onCreateCustomer?: (name: string) => Promise<any>; // Opcional: Função para criar cliente rápido
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
        x: direction < 0 ? 500 : -500,
        opacity: 0,
    }),
};

export default function NewProjectModal({
    isOpen,
    onClose,
    proposals,
    customers,
    onCreate,
}: NewProjectModalProps) {
    const [[step, direction], setStep] = useState([1, 0]);
    const [selectedProposal, setSelectedProposal] =
        useState<any>(null);
    const [selectedCustomer, setSelectedCustomer] =
        useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreatingNew, setIsCreatingNew] =
        useState(false);
    const { showToast } = useToast();

    const availableProposals =
        proposals?.filter(
            (p) => p.status !== "concluido"
        ) || [];

    const filteredCustomers = useMemo(() => {
        return customers.filter(
            (c) =>
                c.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                c.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const paginate = (
        newStep: number,
        newDirection: number
    ) => {
        setSearchTerm("");
        setIsCreatingNew(false);
        setStep([newStep, newDirection]);
    };

    const handleSelectProposal = (proposal: any) => {
        setSelectedProposal(proposal);
        const existingCust = customers.find(
            (c) => c.id === proposal.client_id
        );
        if (existingCust) setSelectedCustomer(existingCust);
        paginate(2, 1);
    };

    const handleQuickCreateCustomer = async () => {
        if (!searchTerm) return;
        setSelectedCustomer({
            id: "new",
            name: searchTerm,
            isNew: true,
        });
        paginate(3, 1);
    };

    const handleConfirm = () => {
        if (!selectedProposal || !selectedCustomer) {
            return showToast(
                "Erro",
                "error",
                "Selecione um cliente e uma proposta!"
            );
        }
        onCreate({
            proposal: selectedProposal,
            customerId: selectedCustomer,
            newCustomerData: selectedCustomer.isNew
                ? {
                      name: searchTerm,
                      whatsapp: "",
                      email: "",
                  }
                : undefined,
        });
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: 30,
                        }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <header className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    {step > 1 && (
                                        <button
                                            onClick={() =>
                                                paginate(
                                                    step -
                                                        1,
                                                    -1
                                                )
                                            }
                                            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
                                        >
                                            <ChevronLeft
                                                size={20}
                                            />
                                        </button>
                                    )}
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                        Novo Projeto
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-full text-zinc-500"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="relative min-h-[420px]">
                                <AnimatePresence
                                    custom={direction}
                                    mode="popLayout"
                                >
                                    <motion.div
                                        key={step}
                                        custom={direction}
                                        variants={
                                            slideVariants
                                        }
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            },
                                            opacity: {
                                                duration: 0.2,
                                            },
                                        }}
                                        className="w-full"
                                    >
                                        {/* PASSO 1: PROPOSTA */}
                                        {step === 1 && (
                                            <div className="space-y-3">
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center">
                                                    1.
                                                    Selecione
                                                    a
                                                    Proposta
                                                </p>
                                                {availableProposals.map(
                                                    (p) => (
                                                        <button
                                                            key={
                                                                p.id
                                                            }
                                                            onClick={() =>
                                                                handleSelectProposal(
                                                                    p
                                                                )
                                                            }
                                                            className="group w-full flex items-center justify-between p-5 bg-white/[0.03] hover:bg-blue-600 rounded-3xl border border-white/5 transition-all text-left"
                                                        >
                                                            <div className="flex-1 truncate mr-4">
                                                                <p className="text-white font-bold truncate">
                                                                    {p.title ||
                                                                        p.client_name}
                                                                </p>
                                                                <p className="text-zinc-500 text-[10px] group-hover:text-blue-200 mt-1 uppercase font-black tracking-tighter">
                                                                    R${" "}
                                                                    {Number(
                                                                        p.total_price
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <ArrowRight
                                                                size={
                                                                    18
                                                                }
                                                                className="text-zinc-700 group-hover:text-white"
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {/* PASSO 2: CLIENTE COM BUSCA OU CRIAÇÃO */}
                                        {step === 2 && (
                                            <div className="space-y-4">
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-center">
                                                    2.
                                                    Vincular
                                                    Cliente
                                                </p>
                                                <div className="relative">
                                                    <Search
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="Buscar ou digitar novo nome..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
                                                        value={
                                                            searchTerm
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setSearchTerm(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                                                    {/* Opção de criar novo se não houver busca exata */}
                                                    {searchTerm.length >
                                                        2 &&
                                                        !customers.some(
                                                            (
                                                                c
                                                            ) =>
                                                                c.name.toLowerCase() ===
                                                                searchTerm.toLowerCase()
                                                        ) && (
                                                            <button
                                                                onClick={
                                                                    handleQuickCreateCustomer
                                                                }
                                                                className="w-full flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl hover:bg-blue-600/20 transition-all text-left group"
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                                    <UserPlus
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-blue-400 font-bold text-sm">
                                                                        Criar
                                                                        novo:
                                                                        "
                                                                        {
                                                                            searchTerm
                                                                        }

                                                                        "
                                                                    </p>
                                                                    <p className="text-blue-400/50 text-[10px] uppercase font-black">
                                                                        Adicionar
                                                                        este
                                                                        cliente
                                                                        ao
                                                                        banco
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        )}

                                                    {filteredCustomers.map(
                                                        (
                                                            c
                                                        ) => (
                                                            <button
                                                                key={
                                                                    c.id
                                                                }
                                                                onClick={() => {
                                                                    setSelectedCustomer(
                                                                        c
                                                                    );
                                                                    paginate(
                                                                        3,
                                                                        1
                                                                    );
                                                                }}
                                                                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all text-left group"
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                    <User
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-bold text-sm">
                                                                        {
                                                                            c.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-zinc-500 text-[10px]">
                                                                        {c.email ||
                                                                            "Cliente Cadastrado"}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* PASSO 3: CONFIRMAÇÃO */}
                                        {step === 3 && (
                                            <div className="space-y-6">
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                                                    3.
                                                    Revisão
                                                    Final
                                                </p>
                                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4 text-sm">
                                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                                        <span className="text-zinc-500 uppercase font-bold text-[9px]">
                                                            Projeto
                                                        </span>
                                                        <span className="text-white font-bold truncate max-w-[200px]">
                                                            {selectedProposal?.title ||
                                                                selectedProposal?.client_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                                        <span className="text-zinc-500 uppercase font-bold text-[9px]">
                                                            Cliente
                                                        </span>
                                                        <div className="text-right">
                                                            <p className="text-blue-400 font-bold">
                                                                {
                                                                    selectedCustomer?.name
                                                                }
                                                            </p>
                                                            {selectedCustomer?.isNew && (
                                                                <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">
                                                                    Novo
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500 uppercase font-bold text-[9px]">
                                                            Total
                                                        </span>
                                                        <span className="text-green-400 font-bold">
                                                            R${" "}
                                                            {Number(
                                                                selectedProposal?.total_price
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={
                                                        handleConfirm
                                                    }
                                                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                                >
                                                    <CheckCircle2
                                                        size={
                                                            18
                                                        }
                                                    />{" "}
                                                    Confirmar
                                                    e Gerar
                                                    Projeto
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
