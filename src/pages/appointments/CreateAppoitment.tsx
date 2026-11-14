import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPatients } from "../../services/patientService";
import type { Patient } from "../../services/patientService";

import { getDoctors } from "../../services/doctorService";
import type { Doctor } from "../../services/doctorService";

import { getDepartments } from "../../services/departmentService";
import type { Department } from "../../services/departmentService";

import api from "../../api/axios";

const CreateAppointment = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [patientId, setPatientId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [departmentId, setDepartmentId] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");

    const [visitType, setVisitType] = useState<
        "New" | "Follow-up" | "Emergency"
    >("New");

    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    patientsData,
                    doctorsData,
                    departmentsData,
                ] = await Promise.all([
                    getPatients(),
                    getDoctors(),
                    getDepartments(),
                ]);

                setPatients(patientsData);
                setDoctors(doctorsData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error(
                    "Failed to load appointment form data:",
                    error
                );

                alert(
                    "Failed to load patients, doctors, or departments."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDoctorChange = (value: string) => {
        setDoctorId(value);

        const selectedDoctor = doctors.find(
            (doctor) => doctor.id === Number(value)
        );

        if (selectedDoctor) {
            setDepartmentId(
                String(selectedDoctor.department_id)
            );
        }
    };

    const handleSubmit: React.SubmitEventHandler<
        HTMLFormElement
    > = async (event) => {
        event.preventDefault();

        if (
            !patientId ||
            !doctorId ||
            !departmentId ||
            !appointmentDate ||
            !appointmentTime ||
            !reason
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await api.post("/appointments", {
                patient_id: Number(patientId),
                doctor_id: Number(doctorId),
                department_id: Number(departmentId),
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                visit_type: visitType,
                reason: reason.trim(),
                notes: notes.trim() || null,
            });

            console.log("Appointment created:", response.data);

            alert("Appointment created successfully.");

            navigate("/appointments");
        } catch (error) {
            console.error(
                "Failed to create appointment:",
                error
            );

            alert("Failed to create appointment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">
                    Create Appointment
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading form...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Create Appointment
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Schedule a new hospital appointment.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/appointments")}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    Back
                </button>
            </div>

            {/* Form */}
            <div className="rounded-lg bg-white p-6 shadow">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Patient / Doctor */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Patient *
                            </label>

                            <select
                                value={patientId}
                                onChange={(event) =>
                                    setPatientId(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    Select patient
                                </option>

                                {patients.map((patient) => (
                                    <option
                                        key={patient.id}
                                        value={patient.id}
                                    >
                                        {patient.patient_number} -{" "}
                                        {patient.first_name}{" "}
                                        {patient.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Doctor *
                            </label>

                            <select
                                value={doctorId}
                                onChange={(event) =>
                                    handleDoctorChange(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    Select doctor
                                </option>

                                {doctors.map((doctor) => (
                                    <option
                                        key={doctor.id}
                                        value={doctor.id}
                                    >
                                        Dr.{" "}
                                        {doctor.first_name}{" "}
                                        {doctor.middle_name
                                            ? `${doctor.middle_name} `
                                            : ""}
                                        {doctor.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Department *
                        </label>

                        <select
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Select department
                            </option>

                            {departments
                                .filter(
                                    (department) =>
                                        department.is_active
                                )
                                .map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Date / Time */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Appointment Date *
                            </label>

                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(event) =>
                                    setAppointmentDate(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Appointment Time *
                            </label>

                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(event) =>
                                    setAppointmentTime(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Visit Type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Visit Type *
                        </label>

                        <select
                            value={visitType}
                            onChange={(event) =>
                                setVisitType(
                                    event.target.value as
                                        | "New"
                                        | "Follow-up"
                                        | "Emergency"
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="New">
                                New
                            </option>

                            <option value="Follow-up">
                                Follow-up
                            </option>

                            <option value="Emergency">
                                Emergency
                            </option>
                        </select>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Reason *
                        </label>

                        <input
                            type="text"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Enter reason for appointment"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Notes
                        </label>

                        <textarea
                            value={notes}
                            onChange={(event) =>
                                setNotes(event.target.value)
                            }
                            rows={4}
                            placeholder="Additional notes..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/appointments")
                            }
                            className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Creating..."
                                : "Create Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;
