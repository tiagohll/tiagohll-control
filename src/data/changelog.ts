export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    description: string;
    image: string;
    slug: string;
    status: "current" | "stable";
    logs: {
        microVersion: string;
        updateTitle: string;
        content: string;
    }[];
}

export const CHANGELOG_DATA: ChangelogEntry[] = [
    {
        version: "pre0.4.0",
        date: "26 Jan, 2026",
        title: "Gestão Interna de Projetos",
        description:
            "Marco da implementação do sistema de criação e edição de projetos diretamente pelo dashboard administrativo.",
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2670&auto=format&fit=crop",
        slug: "gestao-interna-projetos",
        status: "current",
        logs: [
            {
                microVersion: "pre0.4.0",
                updateTitle: "Sistema de Projetos",
                content:
                    "Implementação da criação e modificação de projetos diretamente pelo painel administrativo.",
            },
        ],
    },
    {
        version: "pre0.3.2",
        date: "18 Jan, 2026",
        title: "Ciclo de Inteligência e Experiência",
        description:
            "Consolidação do motor de análise com IA, melhorias de interface e correções estruturais do sistema.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        slug: "ciclo-inteligencia-experiencia",
        status: "stable",
        logs: [
            {
                microVersion: "pre0.3.2",
                updateTitle: "Melhoria na UI de Cliques",
                content:
                    "Scroll limitado, adição de busca e refinamento visual dos cards.",
            },
            {
                microVersion: "pre0.3.1",
                updateTitle: "Correções de Métricas",
                content:
                    "Correção dos summary cards zerados e atualização da documentação.",
            },
            {
                microVersion: "pre0.3.0",
                updateTitle: "Motor de Análise IA",
                content:
                    "Integração com Llama 3.1 8B via Groq Cloud, geração automática de insights e tratamento de erros 429/500.",
            },
        ],
    },
    {
        version: "pre0.2.4",
        date: "14 Jan, 2026",
        title: "Refatoração e Consolidação de Estrutura",
        description:
            "Reorganização da arquitetura de componentes, rastreamento de cliques e melhorias na estabilidade geral.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop",
        slug: "refatoracao-consolidacao",
        status: "stable",
        logs: [
            {
                microVersion: "pre0.2.4",
                updateTitle: "Padronização UI e Hash",
                content:
                    "Ajustes visuais e definição do campo visitor_hash no banco de dados.",
            },
            {
                microVersion: "pre0.2.2",
                updateTitle:
                    "Correção de Filtro de Período",
                content:
                    "Correção na lógica de filtragem por intervalo de datas.",
            },
            {
                microVersion: "pre0.2.1",
                updateTitle: "Resumo Inteligente v1.1",
                content:
                    "Melhoria na análise automática de dados e instruções geradas.",
            },
            {
                microVersion: "pre0.2.0",
                updateTitle: "Arquitetura Modular",
                content:
                    "Separação da lógica de processamento em componentes independentes e implementação do rastreamento de cliques.",
            },
        ],
    },
    {
        version: "pre0.1.0",
        date: "11 Jan, 2026",
        title: "Base de Documentação e Segurança",
        description:
            "Criação da documentação inicial e correções estruturais críticas do sistema.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
        slug: "base-documentacao-seguranca",
        status: "stable",
        logs: [
            {
                microVersion: "pre0.1.0",
                updateTitle: "Documentação Técnica",
                content:
                    "Guias de CSP, variáveis de ambiente e boas práticas de segurança.",
            },
        ],
    },
    {
        version: "pre0.0.1",
        date: "08 Jan, 2026",
        title: "Primeira Versão Funcional",
        description:
            "Lançamento da base do sistema com dashboard em tempo real, QR Codes inteligentes e autenticação.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2670&auto=format&fit=crop",
        slug: "primeira-versao-funcional",
        status: "stable",
        logs: [
            {
                microVersion: "pre0.0.1",
                updateTitle: "Dashboard e QR Code",
                content:
                    "Dashboard em tempo real, geração de QR Codes com UTMs e autenticação.",
            },
        ],
    },
];
