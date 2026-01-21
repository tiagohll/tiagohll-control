// app/admin/loading.tsx
export default function Loading() {
    return (
        <div className="p-8 animate-pulse">
            <div className="h-10 w-48 bg-zinc-900 rounded-lg mb-8" />
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-20 w-full bg-zinc-900/50 rounded-3xl border border-zinc-800/50"
                    />
                ))}
            </div>
        </div>
    );
}
