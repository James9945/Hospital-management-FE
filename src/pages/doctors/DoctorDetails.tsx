import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getDoctor } from "../../services/doctorService";
import type { Doctor } from "../../services/doctorService";

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoctor = async () => {
            const doctorId = Number(id);

            if (Number.isNaN(doctorId)) {
                setError("Invalid doctor ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getDoctor(doctorId);

                setDoctor(data);
            } catch (error) {
                console.error(
                    "Failed to load doctor:",
                    error,
                );

                setError(
                    "Failed to load doctor details.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="rounded-lg bg-white p-6 shadow">
                <p className="text-gray-500">
                    Loading doctor details...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/doctors")}
                    className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
                >
                    Back to Doctors
                </button>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="rounded-lg bg-white p-6 shadow">
                <p className="text-gray-500">
                    Doctor not found.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Doctor Details
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View doctor information.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/doctors/${doctor.id}/edit`,
                            )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        Edit Doctor
                    </button>
                </div>
            </div>

            {/* Doctor information */}
            <div className="rounded-lg bg-white p-6 shadow">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">
                            Staff ID
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {doctor.staff_id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Full Name
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {doctor.first_name}{" "}
                            {doctor.middle_name
                                ? `${doctor.middle_name} `
                                : ""}
                            {doctor.last_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {doctor.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {doctor.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Department
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {doctor.department}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                doctor.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {doctor.is_active
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;