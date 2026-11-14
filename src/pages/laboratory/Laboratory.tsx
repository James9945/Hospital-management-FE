import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLaboratoryOrders } from "../../services/laboratoryService";
import type { LaboratoryOrder } from "../../services/laboratoryService";

const Laboratory = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<LaboratoryOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLaboratoryOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getLaboratoryOrders();

                setOrders(data);
            } catch (error) {
                console.error(
                    "Failed to load laboratory orders:",
                    error,
                );

                setError(
                    "Failed to load laboratory orders. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLaboratoryOrders();
    }, []);

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: LaboratoryOrder["status"]) => {
        switch (status) {
            case "Requested":
                return "bg-blue-100 text-blue-700";
            case "Collected":
                return "bg-yellow-100 text-yellow-700";
            case "Processing":
                return "bg-purple-100 text-purple-700";
            case "Completed":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Laboratory Orders
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage laboratory test orders here.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/laboratory/orders/create")}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                    + Create Laboratory Order
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-gray-500">
                        Loading laboratory orders...
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    {orders.length === 0 ? (
                        <div className="p-8 text-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                No laboratory orders found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                There are currently no laboratory orders.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requesting Doctor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tests</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ordered At</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                                #{order.id}
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {order.patient_name}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {order.patient_number}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                Dr. {order.requesting_doctor_name}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.items.length}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDateTime(order.created_at)}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/laboratory/orders/${order.id}`)}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Laboratory;
