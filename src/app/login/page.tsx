"use client";

import validadeEmail from "@/functions/validateEmail";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Login() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Acesso Restrito | THLL Control";
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setError(
                "Credenciais inválidas ou erro de conexão."
            );
            setLoading(false);
            return;
        }

        router.push("/dashboard");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        if (!validadeEmail(email)) {
            setError("Por favor, insira um e-mail válido.");
            return;
        }

        handleLogin();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Header */}
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Acesse sua conta
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        Entre para gerenciar seus projetos
                        de analytics
                    </p>
                </div>

                {/* Card de Login */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="seu@email.com"
                                    className="w-full rounded-xl border border-zinc-800 bg-black py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-zinc-800 bg-black py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2
                                    className="animate-spin"
                                    size={20}
                                />
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-600">
                    Protegido por criptografia de ponta a
                    ponta.
                </p>
            </div>
        </div>
    );
}
