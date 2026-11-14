import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAppointment,
    updateAppointment,
    deleteAppointment,
} from "../../services/appointmentService";

import type { Appointment } from "../../services/appointmentService";

const AppointmentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [appointment, setAppointment] =
        useState<Appointment | null>(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [status, setStatus] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [visitType, setVisitType] = useState("");
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!id) {
                return;
            }

            try {
                setLoading(true);

                const data = await getAppointment(Number(id));

                setAppointment(data);

                setStatus(data.status);
                setAppointmentDate(data.appointment_date);
                setAppointmentTime(
                    data.appointment_time.slice(0, 5),
                );
                setVisitType(data.visit_type);
                setReason(data.reason);
                setNotes(data.notes ?? "");
            } catch (error) {
                console.error(
                    "Failed to load appointment:",
                    error,
                );

                alert("Failed to load appointment.");
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id, navigate]);

    const handleSave = async () => {
        if (!appointment) {
            return;
        }

        if (
            !appointmentDate ||
            !appointmentTime ||
            !reason
        ) {
            alert(
                "Appointment date, time and reason are required.",
            );
            return;
        }

        try {
            setSaving(true);

            const updated = await updateAppointment(
                appointment.id,
                {
                    appointment_date: appointmentDate,
                    appointment_time: appointmentTime,
                    status,
                    visit_type: visitType,
                    reason: reason.trim(),
                    notes: notes.trim() || null,
                },
            );

            setAppointment(updated);

            setEditing(false);

            alert("Appointment updated successfully.");
        } catch (error) {
            console.error(
                "Failed to update appointment:",
                error,
            );

            alert("Failed to update appointment.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete the appointment for ${appointment.patient_name}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await deleteAppointment(appointment.id);

            alert("Appointment deleted successfully.");

            navigate("/appointments");
        } catch (error) {
            console.error(
                "Failed to delete appointment:",
                error,
            );

            alert("Failed to delete appointment.");
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelEdit = () => {
        if (!appointment) {
            return;
        }

        setEditing(false);

        setStatus(appointment.status);

        setAppointmentDate(
            appointment.appointment_date,
        );

        setAppointmentTime(
            appointment.appointment_time.slice(0, 5),
        );

        setVisitType(appointment.visit_type);

        setReason(appointment.reason);

        setNotes(appointment.notes ?? "");
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading appointment...
                </p>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    Appointment not found.
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
                        Appointment Details
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View and manage appointment information.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Back */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/appointments")
                        }
                        className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                    >
                        ← Back
                    </button>

                    {/* Edit */}
                    {!editing && (
                        <button
                            type="button"
                            onClick={() =>
                                setEditing(true)
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Edit Appointment
                        </button>
                    )}

                    {/* Delete */}
                    {!editing && (
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
                    )}
                </div>
            </div>

            {/* Patient / Doctor / Department */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Patient */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm text-gray-500">
                        Patient
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                        {appointment.patient_name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {appointment.patient_number}
                    </p>
                </div>

                {/* Doctor */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm text-gray-500">
                        Doctor
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                        Dr. {appointment.doctor_name}
                    </h2>
                </div>

                {/* Department */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm text-gray-500">
                        Department
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                        {appointment.department}
                    </h2>
                </div>
            </div>

            {/* Appointment Information */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-6 text-xl font-semibold">
                    Appointment Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Date */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Appointment Date
                        </label>

                        {editing ? (
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(event) =>
                                    setAppointmentDate(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {appointment.appointment_date}
                            </p>
                        )}
                    </div>

                    {/* Time */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Appointment Time
                        </label>

                        {editing ? (
                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(event) =>
                                    setAppointmentTime(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        ) : (
                            <p className="text-gray-800">
                                {appointment.appointment_time.slice(
                                    0,
                                    5,
                                )}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        {editing ? (
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="Scheduled">
                                    Scheduled
                                </option>

                                <option value="Checked In">
                                    Checked In
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>

                                <option value="No Show">
                                    No Show
                                </option>
                            </select>
                        ) : (
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                {appointment.status}
                            </span>
                        )}
                    </div>

                    {/* Visit Type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Visit Type
                        </label>

                        {editing ? (
                            <select
                                value={visitType}
                                onChange={(event) =>
                                    setVisitType(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
                        ) : (
                            <p className="text-gray-800">
                                {appointment.visit_type}
                            </p>
                        )}
                    </div>
                </div>

                {/* Reason */}
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Reason
                    </label>

                    {editing ? (
                        <input
                            type="text"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value,
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    ) : (
                        <p className="text-gray-800">
                            {appointment.reason}
                        </p>
                    )}
                </div>

                {/* Notes */}
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Notes
                    </label>

                    {editing ? (
                        <textarea
                            value={notes}
                            onChange={(event) =>
                                setNotes(
                                    event.target.value,
                                )
                            }
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap text-gray-800">
                            {appointment.notes ||
                                "No notes available."}
                        </p>
                    )}
                </div>

                {/* Save / Cancel */}
                {editing && (
                    <div className="mt-6 flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

export default AppointmentDetails;

