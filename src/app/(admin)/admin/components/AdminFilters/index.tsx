"use client";

import {
    Search,
    ChevronDown,
    Check,
    Filter,
    ArrowUpDown,
} from "lucide-react";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import {
    useState,
    useTransition,
    useEffect,
    useRef,
} from "react";

export function AdminFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );

    // Debounce para a busca não travar a digitação
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleFilter("search", searchTerm);
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (
            value &&
            value !== "all" &&
            value !== "newest"
        ) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        startTransition(() => {
            router.push(
                `${pathname}?${params.toString()}`,
                { scroll: false }
            );
        });
    };

    return (
        <div
            className={`flex flex-col md:flex-row gap-4 mb-8 transition-all duration-500 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
            {/* INPUT DE BUSCA ESTILIZADO */}
            <div className="relative flex-1 group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-300 transition-colors"
                    size={18}
                />
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Filtrar por e-mail ou UUID..."
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-600 shadow-inner"
                />
            </div>

            <div className="flex gap-3">
                {/* SELECT PERSONALIZADO: CARGO */}
                <CustomSelect
                    label="Cargo"
                    icon={<Filter size={14} />}
                    value={
                        searchParams.get("role") || "all"
                    }
                    options={[
                        {
                            label: "Todos os Cargos",
                            value: "all",
                        },
                        {
                            label: "Administradores",
                            value: "admin",
                        },
                        {
                            label: "Clientes",
                            value: "user",
                        },
                    ]}
                    onChange={(val: string) =>
                        handleFilter("role", val)
                    }
                />

                {/* SELECT PERSONALIZADO: ORDEM */}
                <CustomSelect
                    label="Ordem"
                    icon={<ArrowUpDown size={14} />}
                    value={
                        searchParams.get("order") ||
                        "newest"
                    }
                    options={[
                        {
                            label: "Mais Recentes",
                            value: "newest",
                        },
                        {
                            label: "A - Z",
                            value: "alphabetical",
                        },
                        {
                            label: "Maior Limite",
                            value: "sites",
                        },
                    ]}
                    onChange={(val: string) =>
                        handleFilter("order", val)
                    }
                />
            </div>
        </div>
    );
}

// COMPONENTE DE SELECT INTERNO (UI PREMIUM)
export function CustomSelect({
    label,
    value,
    options,
    onChange,
    icon,
}: any) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    e.target as Node
                )
            )
                setOpen(false);
        };
        document.addEventListener(
            "mousedown",
            handleClickOutside
        );
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const selectedOption =
        options.find((o: any) => o.value === value) ||
        options[0];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-600 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-200 transition-all min-w-[160px]"
            >
                {icon}
                <span className="flex-1 text-left">
                    {selectedOption.label}
                </span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl animate-in fade-in zoom-in duration-200">
                    {options.map((opt: any) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                        >
                            {opt.label}
                            {value === opt.value && (
                                <Check
                                    size={12}
                                    className="text-blue-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
