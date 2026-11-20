
import { useState, type ChangeEvent, type FormEvent } from "react";
import { register, type RegisterPayload } from "../../services/authServices";

const Register = () => {
    const [formData, setFormData] = useState({
        staff_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role: "Admin",
        department_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (!Number.isInteger(Number(formData.department_id)) ||
            formData.department_id.trim() === "") {
            setError("Please enter a valid department ID.");
            return;
        }

        const payload: RegisterPayload = {
            ...formData,
            department_id: Number(formData.department_id),
        };

        try {
            setLoading(true);

            const response = await register(payload);

            setMessage(response.message || "Registration successful.");

            setFormData({
                staff_id: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                email: "",
                phone: "",
                password: "",
                role: "Admin",
                department_id: "",
            });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Registration failed. Please try again.";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-9 col-lg-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="text-center mb-2">
                                Staff Registration
                            </h2>

                            <p className="text-muted text-center mb-4">
                                Create a hospital staff account
                            </p>

                            {message && (
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Staff ID
                                        </label>
                                        <input
                                            type="text"
                                            name="staff_id"
                                            className="form-control"
                                            value={formData.staff_id}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            name="middle_name"
                                            className="form-control"
                                            value={formData.middle_name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            minLength={8}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            className="form-select"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Nurse">Nurse</option>
                                            <option value="Laboratory">Laboratory</option>
                                            <option value="Pharmacist">Pharmacist</option>
                                            <option value="Receptionist">Receptionist</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Department ID
                                        </label>
                                        <input
                                            type="number"
                                            name="department_id"
                                            className="form-control"
                                            value={formData.department_id}
                                            onChange={handleChange}
                                            min="1"
                                            step="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Registering..."
                                        : "Register Staff"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
