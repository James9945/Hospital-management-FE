import {  useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createPatient,
    type CreatePatientData,
} from "../../services/patientService";

const PatientCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] =
        useState<CreatePatientData>({
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "Male",
            date_of_birth: "",
            phone: "",
            email: "",
            address: "",
            blood_group: "",
            genotype: "",
            emergency_contact_name: "",
            emergency_contact_phone: "",
        });

    const [saving, setSaving] = useState(false);

    const handleChange = (
        field: keyof CreatePatientData,
        value: string,
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: any,
    ) => {
        event.preventDefault();

        if (
            !form.first_name.trim() ||
            !form.last_name.trim() ||
            !form.date_of_birth ||
            !form.phone.trim() ||
            !form.address.trim() ||
            !form.emergency_contact_name.trim() ||
            !form.emergency_contact_phone.trim()
        ) {
            alert(
                "Please fill in all required fields.",
            );
            return;
        }

        try {
            setSaving(true);

            const patient =
                await createPatient({
                    ...form,
                    first_name:
                        form.first_name.trim(),
                    middle_name:
                        form.middle_name?.trim() || null,
                    last_name:
                        form.last_name.trim(),
                    phone: form.phone.trim(),
                    email:
                        form.email?.trim() || null,
                    address:
                        form.address.trim(),
                    blood_group:
                        form.blood_group || null,
                    genotype:
                        form.genotype || null,
                    emergency_contact_name:
                        form.emergency_contact_name.trim(),
                    emergency_contact_phone:
                        form.emergency_contact_phone.trim(),
                });

            alert(
                "Patient registered successfully.",
            );

            navigate(
                `/patients/${patient.id}`,
            );
        } catch (error) {
            console.error(
                "Failed to register patient:",
                error,
            );

            alert(
                "Failed to register patient. Please check the information and try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Register Patient
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Register a new patient into the hospital system.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/patients")
                    }
                    className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                >
                    ← Back to Patients
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Personal Information */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-6 text-xl font-semibold">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* First Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                First Name *
                            </label>

                            <input
                                type="text"
                                value={form.first_name}
                                onChange={(event) =>
                                    handleChange(
                                        "first_name",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter first name"
                            />
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Middle Name
                            </label>

                            <input
                                type="text"
                                value={
                                    form.middle_name ?? ""
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "middle_name",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter middle name"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Last Name *
                            </label>

                            <input
                                type="text"
                                value={form.last_name}
                                onChange={(event) =>
                                    handleChange(
                                        "last_name",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter last name"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Gender *
                            </label>

                            <select
                                value={form.gender}
                                onChange={(event) =>
                                    handleChange(
                                        "gender",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Date of Birth *
                            </label>

                            <input
                                type="date"
                                value={
                                    form.date_of_birth
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "date_of_birth",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone *
                            </label>

                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(event) =>
                                    handleChange(
                                        "phone",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="08012345678"
                            />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={form.email ?? ""}
                                onChange={(event) =>
                                    handleChange(
                                        "email",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="patient@example.com"
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Address *
                            </label>

                            <textarea
                                value={form.address}
                                onChange={(event) =>
                                    handleChange(
                                        "address",
                                        event.target.value,
                                    )
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter patient's address"
                            />
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-6 text-xl font-semibold">
                        Medical Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Blood Group */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Blood Group
                            </label>

                            <select
                                value={
                                    form.blood_group ?? ""
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "blood_group",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A+">
                                    A+
                                </option>

                                <option value="A-">
                                    A-
                                </option>

                                <option value="B+">
                                    B+
                                </option>

                                <option value="B-">
                                    B-
                                </option>

                                <option value="AB+">
                                    AB+
                                </option>

                                <option value="AB-">
                                    AB-
                                </option>

                                <option value="O+">
                                    O+
                                </option>

                                <option value="O-">
                                    O-
                                </option>
                            </select>
                        </div>

                        {/* Genotype */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Genotype
                            </label>

                            <select
                                value={
                                    form.genotype ?? ""
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "genotype",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">
                                    Select genotype
                                </option>

                                <option value="AA">
                                    AA
                                </option>

                                <option value="AS">
                                    AS
                                </option>

                                <option value="AC">
                                    AC
                                </option>

                                <option value="SS">
                                    SS
                                </option>

                                <option value="SC">
                                    SC
                                </option>

                                <option value="CC">
                                    CC
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-6 text-xl font-semibold">
                        Emergency Contact
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contact Name *
                            </label>

                            <input
                                type="text"
                                value={
                                    form.emergency_contact_name
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "emergency_contact_name",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Emergency contact name"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contact Phone *
                            </label>

                            <input
                                type="tel"
                                value={
                                    form.emergency_contact_phone
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "emergency_contact_phone",
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="08012345678"
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/patients")
                        }
                        disabled={saving}
                        className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Registering..."
                            : "Register Patient"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientCreate;