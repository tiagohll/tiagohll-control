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
        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <CustomersList customers={customers || []} />
        </div>
    );
}
