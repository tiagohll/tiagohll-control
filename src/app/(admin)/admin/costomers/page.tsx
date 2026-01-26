import { createClient } from "@/lib/supabase/server";
import { CustomersList } from "./costomer-list";

export default async function CustomersPage() {
    const supabase = await createClient();

    const { data: customers } = await supabase
        .from("customers")
        .select(
            `
            *,
            projects (id),
            subscriptions (*)
        `
        )
        .order("name");

    return (
        <div className="space-y-10">
            <CustomersList customers={customers || []} />
        </div>
    );
}
