import { DashboardGrid } from "./components/dashboard-grid/dashboard-grid";

export default function Dashboard() {
    return (
        <main className="w-full">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-white mb-6 px-6">Welcome to Xela</h1>
                <DashboardGrid />
            </div>
        </main>
    );
}
