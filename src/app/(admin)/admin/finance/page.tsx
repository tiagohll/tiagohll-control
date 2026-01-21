import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FinanceDashboard } from "./finance-dashboard";

export default async function FinancePage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: transactions } = await supabase
        .from("finances")
        .select("*")
        .order("created_at", { ascending: false });

    // Cálculos de saldo
    const balance =
        transactions?.reduce(
            (acc, curr) => acc + Number(curr.amount),
            0
        ) || 0;

    const totalIncome =
        transactions
            ?.filter((t) => t.type === "income")
            .reduce(
                (acc, curr) => acc + Number(curr.amount),
                0
            ) || 0;

    const totalExpense =
        transactions
            ?.filter((t) => t.type === "expense")
            .reduce(
                (acc, curr) => acc + Number(curr.amount),
                0
            ) || 0;

    // O isNegative agora será verdadeiro se o saldo for menor que zero
    const isNegative = balance < 0;

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                    Financeiro
                    <span className="text-blue-600">.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                    Controle de Fluxo de Caixa
                </p>
            </header>

            <FinanceDashboard
                transactions={transactions || []}
                stats={{
                    totalIncome,
                    totalExpense,
                    balance,
                }}
            />
        </div>
    );
}
