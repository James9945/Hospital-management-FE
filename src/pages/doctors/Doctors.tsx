import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDoctors } from "../../services/doctorService";
import type { Doctor } from "../../services/doctorService";

const Doctors = () => {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDoctors();

                setDoctors(data);
            } catch (error) {
                console.error(
                    "Failed to load doctors:",
                    error,
                );

                setError(
                    "Failed to load doctors. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Doctors
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage hospital doctors here.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/doctors/create")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                    + Add Doctor
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-gray-500">
                        Loading doctors...
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    {/* Empty state */}
                    {doctors.length === 0 ? (
                        <div className="p-8 text-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                No doctors found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                There are currently no doctors
                                registered.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Staff ID
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Name
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Department
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Phone
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {doctors.map(
                                        (doctor) => (
                                            <tr
                                                key={
                                                    doctor.id
                                                }
                                                className="hover:bg-gray-50"
                                            >
                                                {/* Staff ID */}
                                                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                                    {
                                                        doctor.staff_id
                                                    }
                                                </td>

                                                {/* Name */}
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    Dr.{" "}
                                                    {
                                                        doctor.first_name
                                                    }{" "}
                                                    {doctor.middle_name
                                                        ? `${doctor.middle_name} `
                                                        : ""}
                                                    {
                                                        doctor.last_name
                                                    }
                                                </td>

                                                {/* Department */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        doctor.department
                                                    }
                                                </td>

                                                {/* Phone */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        doctor.phone
                                                    }
                                                </td>

                                                {/* Email */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        doctor.email
                                                    }
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    {doctor.is_active ? (
                                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/doctors/${doctor.id}`,
                                                            )
                                                        }
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Doctors;