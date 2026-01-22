import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./client";

export default async function ProjectsPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("project_details")
        .select("*");
    const { data: proposals } = await supabase
        .from("proposals")
        .select("*");
    const { data: customers } = await supabase
        .from("customers")
        .select("*");

    return (
        <ProjectsClient
            initialProjects={projects || []}
            proposals={proposals || []}
            customers={customers || []}
        />
    );
}
