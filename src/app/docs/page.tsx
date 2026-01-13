import { Metadata } from "next";
import DocsClient from "./docs-client";

export const metadata: Metadata = {
    title: "Documentação | THLL Control",
    description:
        "Encontre guias, tutoriais e referências para aproveitar ao máximo o THLL Control.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function NextJsDocs() {
    return <DocsClient />;
}
