import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getPatient,
    updatePatient,
    deletePatient,
} from "../../services/patientService";

import type { Patient } from "../../services/patientService";

const PatientDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [patient, setPatient] =
        useState<Patient | null>(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) {
                return;
            }

            try {
                setLoading(true);

                const data = await getPatient(
                    Number(id),
                );

                setPatient(data);

                setFirstName(data.first_name);
                setMiddleName(data.middle_name ?? "");
                setLastName(data.last_name);
                setGender(data.gender);
                setDateOfBirth(data.date_of_birth);
                setPhone(data.phone);
                setEmail(data.email ?? "");
            } catch (error) {
                console.error(
                    "Failed to load patient:",
                    error,
                );

                alert("Failed to load patient.");

                navigate("/patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, navigate]);

    const handleSave = async () => {
        if (!patient) {
            return;
        }

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !gender ||
            !dateOfBirth ||
            !phone.trim()
        ) {
            alert(
                "First name, last name, gender, date of birth and phone are required.",
            );

            return;
        }

        try {
            setSaving(true);

            const updated = await updatePatient(
                patient.id,
                {
                    first_name: firstName.trim(),
                    middle_name:
                        middleName.trim() || null,
                    last_name: lastName.trim(),
                    gender,
                    date_of_birth: dateOfBirth,
                    phone: phone.trim(),
                    email: email.trim() || null,
                },
            );

            setPatient(updated);

            setEditing(false);

            alert(
                "Patient updated successfully.",
            );
        } catch (error) {
            console.error(
                "Failed to update patient:",
                error,
            );

            alert("Failed to update patient.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (!patient) {
            return;
        }

        setFirstName(patient.first_name);
        setMiddleName(patient.middle_name ?? "");
        setLastName(patient.last_name);
        setGender(patient.gender);
        setDateOfBirth(patient.date_of_birth);
        setPhone(patient.phone);
        setEmail(patient.email ?? "");

        setEditing(false);
    };

    const handleDelete = async () => {
        if (!patient) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await deletePatient(patient.id);

            alert(
                "Patient deleted successfully.",
            );

            navigate("/patients");
        } catch (error) {
            console.error(
                "Failed to delete patient:",
                error,
            );

            alert("Failed to delete patient.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading patient...
                </p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    Patient not found.
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
                        Patient Details
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View and manage patient information.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/patients")
                        }
                        className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                    >
                        ← Back
                    </button>

                    {!editing && (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    setEditing(true)
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                            >
                                Edit Patient
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Patient Number */}
            <div className="rounded-lg bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                    Patient Number
                </p>

                <h2 className="mt-2 text-xl font-semibold text-blue-600">
                    {patient.patient_number}
                </h2>
            </div>

            {/* Patient Information */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-6 text-xl font-semibold">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* First Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            First Name
                        </label>

                        {editing ? (
                            <input
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.first_name}
                            </p>
                        )}
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Middle Name
                        </label>

                        {editing ? (
                            <input
                                type="text"
                                value={middleName}
                                onChange={(event) =>
                                    setMiddleName(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.middle_name ||
                                    "—"}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name
                        </label>

                        {editing ? (
                            <input
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.last_name}
                            </p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Gender
                        </label>

                        {editing ? (
                            <select
                                value={gender}
                                onChange={(event) =>
                                    setGender(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>
                            </select>
                        ) : (
                            <p className="text-gray-800">
                                {patient.gender}
                            </p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>

                        {editing ? (
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(event) =>
                                    setDateOfBirth(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.date_of_birth}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone
                        </label>

                        {editing ? (
                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        {editing ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {patient.email || "—"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Save / Cancel */}
                {editing && (
                    <div className="mt-6 flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetails;