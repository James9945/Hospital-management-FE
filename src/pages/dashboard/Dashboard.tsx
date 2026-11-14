import { useEffect, useState } from "react";

import StatCard from "../../components/dashboard/StatCard";
import RecentAppointments from "../../components/dashboard/RecentAppointments";

import { getDashboardSummary } from "../../services/dashboardService";

interface DashboardSummary {
    patients: number;
    doctors: number;
    appointments: number;
    revenue: number;
}

const Dashboard = () => {
    const [summary, setSummary] = useState<DashboardSummary>({
        patients: 0,
        doctors: 0,
        appointments: 0,
        revenue: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            try {
                const response = await getDashboardSummary();

                setSummary(response.data);
            } catch (error) {
                console.error("Failed to load dashboard summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-10">
                <h2 className="text-xl font-semibold text-gray-600">
                    Loading dashboard...
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-600">
                    Welcome back! Here's an overview of the hospital.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Patients"
                    value={summary.patients}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Doctors"
                    value={summary.doctors}
                    color="bg-green-600"
                />

                <StatCard
                    title="Appointments"
                    value={summary.appointments}
                    color="bg-yellow-500"
                />

                <StatCard
                    title="Revenue"
                    value={`₦${summary.revenue}`}
                    color="bg-purple-600"
                />
            </div>

            <RecentAppointments />
        </div>
    );
};

export default Dashboard;