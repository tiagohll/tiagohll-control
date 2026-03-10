import { Metadata } from "next";
import ChangelogClient from "./client";
import ChangelogDetailClient from "./client";

export const metadata: Metadata = {
    title: "Detalhes da Versão | THLL Control",
    description:
        "Acompanhe a evolução técnica e estratégica da nossa infraestrutura digital.",
    openGraph: {
        title: "Detalhes da Versão | THLL Control",
        description: "Evolução contínua do sistema.",
        images: [{ url: "/og-image.png" }], // Se tiver uma imagem de preview
    },
};

export default function ChangelogDetail() {
    return <ChangelogDetailClient />;
}
