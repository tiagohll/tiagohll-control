import { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
    title: "Thll Control | Private System",
    description:
        "Ambiente de gestão de dados e analytics. Acesso restrito.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Thll Control | System Access",
        description:
            "Acesso restrito ao painel de controle e gestão de dados.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Thll Control Interface",
            },
        ],
        locale: "pt_BR",
        type: "website",
    },
};

export default function Page() {
    return <ClientPage />;
}
