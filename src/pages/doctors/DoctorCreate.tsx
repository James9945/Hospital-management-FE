import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { createDoctor } from "../../services/doctorService";

interface Department {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
}

const DoctorCreate = () => {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState<
        Department[]
    >([]);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        staff_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role: "Doctor",
        department_id: "",
    });

    // Load departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoadingDepartments(true);
                setError("");

                const response =
                    await api.get("/departments");

                setDepartments(response.data.data);
            } catch (error) {
                console.error(
                    "Failed to load departments:",
                    error,
                );

                setError(
                    "Failed to load departments.",
                );
            } finally {
                setLoadingDepartments(false);
            }
        };

        fetchDepartments();
    }, []);

    // Handle form changes
    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit form
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // Validate department
        if (!formData.department_id) {
            setError("Please select a department.");
            return;
        }

        try {
            setLoading(true);

            await createDoctor({
                staff_id: formData.staff_id,
                first_name: formData.first_name,
                middle_name:
                    formData.middle_name || undefined,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,

                // Role is now sent by name.
                // Backend will look up the role ID.
                role: "Doctor",

                department_id: Number(
                    formData.department_id,
                ),
            });

            setSuccess(
                "Doctor created successfully.",
            );

            setTimeout(() => {
                navigate("/doctors");
            }, 1000);
        } catch (error: any) {
            console.error(
                "Failed to create doctor:",
                error,
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to create doctor.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Add Doctor
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Register a new doctor.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/doctors")
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                    Back to Doctors
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="rounded-lg bg-green-50 p-4 text-green-700">
                    {success}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="rounded-lg bg-white p-6 shadow"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Staff ID */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Staff ID
                        </label>

                        <input
                            type="text"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleChange}
                            placeholder="DOC002"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Middle Name
                        </label>

                        <input
                            type="text"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Department
                        </label>

                        <select
                            name="department_id"
                            value={
                                formData.department_id
                            }
                            onChange={handleChange}
                            required
                            disabled={
                                loadingDepartments
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">
                                {loadingDepartments
                                    ? "Loading departments..."
                                    : "Select department"}
                            </option>

                            {departments
                                .filter(
                                    (department) =>
                                        department.is_active,
                                )
                                .map(
                                    (
                                        department,
                                    ) => (
                                        <option
                                            key={
                                                department.id
                                            }
                                            value={
                                                department.id
                                            }
                                        >
                                            {
                                                department.name
                                            }
                                        </option>
                                    ),
                                )}
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                            placeholder="Minimum 8 characters"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/doctors")
                        }
                        className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Creating..."
                            : "Create Doctor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorCreate;