import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAppointments } from "../../services/appointmentService";
import type { Appointment } from "../../services/appointmentService";

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();

                setAppointments(data);
            } catch (error) {
                console.error("Failed to load appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const formatDate = (date: string) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled":
                return "bg-blue-100 text-blue-700";

            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">
                    Appointments
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading appointments...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Appointments
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage hospital appointments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/appointments/create")}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                       + New Appointment
                </button>
            </div>

            {/* Appointments Table */}
            <div className="rounded-lg bg-white p-6 shadow">
                {appointments.length === 0 ? (
                    <p className="text-gray-500">
                        No appointments found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b text-left text-sm text-gray-500">
                                    <th className="pb-3 font-medium">
                                        Patient
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Doctor
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Department
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Date
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Time
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Visit Type
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Status
                                    </th>

                                    <th className="pb-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        {/* Patient */}
                                        <td className="py-4">
                                            <p className="font-medium text-gray-800">
                                                {appointment.patient_name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {appointment.patient_number}
                                            </p>
                                        </td>

                                        {/* Doctor */}
                                        <td className="py-4">
                                            {appointment.doctor_name}
                                        </td>

                                        {/* Department */}
                                        <td className="py-4">
                                            {appointment.department}
                                        </td>

                                        {/* Date */}
                                        <td className="py-4">
                                            {formatDate(
                                                appointment.appointment_date
                                            )}
                                        </td>

                                        {/* Time */}
                                        <td className="py-4">
                                            {formatTime(
                                                appointment.appointment_time
                                            )}
                                        </td>

                                        {/* Visit Type */}
                                        <td className="py-4">
                                            {appointment.visit_type}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                                    appointment.status
                                                )}`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/appointments/${appointment.id}`
                                                    )
                                                }
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
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
        </div>
    );
};

export default Appointments;