import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPatients } from "../../services/patientService";
import type { Patient } from "../../services/patientService";

const Patients = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPatients();

                setPatients(data);
            } catch (error) {
                console.error(
                    "Failed to load patients:",
                    error,
                );

                setError(
                    "Failed to load patients. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Patients
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage hospital patients here.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/patients/create")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                    + Register Patient
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
                        Loading patients...
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    {/* Empty state */}
                    {patients.length === 0 ? (
                        <div className="p-8 text-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                No patients found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                There are currently no patients
                                registered.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Patient No.
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Name
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Gender
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Date of Birth
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Phone
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {patients.map(
                                        (patient) => (
                                            <tr
                                                key={
                                                    patient.id
                                                }
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                                    {
                                                        patient.patient_number
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {patient.first_name}{" "}
                                                    {patient.middle_name
                                                        ? `${patient.middle_name} `
                                                        : ""}
                                                    {
                                                        patient.last_name
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        patient.gender
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        patient.date_of_birth
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {
                                                        patient.phone
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {patient.email ||
                                                        "—"}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/patients/${patient.id}`,
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

export default Patients;