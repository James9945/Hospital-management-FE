import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/button";
import Card from "../../components/ui/card";
import { getConsultations } from "../../services/consultationService";
import type { Consultation } from "../../services/consultationService";
import { getDoctors } from "../../services/doctorService";
import type { Doctor } from "../../services/doctorService";
import {
    createLaboratoryOrder,
    getLaboratoryTests,
} from "../../services/laboratoryService";
import type { LaboratoryTest } from "../../services/laboratoryService";
import { getPatients } from "../../services/patientService";
import type { Patient } from "../../services/patientService";

const getErrorMessages = (error: unknown): string[] => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string; errors?: unknown }
            | undefined;

        if (Array.isArray(data?.errors)) {
            return data.errors.filter(
                (message): message is string => typeof message === "string",
            );
        }

        if (data?.message) return [data.message];
    }

    return ["Unable to create the laboratory order. Please try again."];
};

const doctorName = (doctor: Doctor) =>
    `Dr. ${doctor.first_name}${doctor.middle_name ? ` ${doctor.middle_name}` : ""} ${doctor.last_name}`;

const LaboratoryOrderCreate = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [tests, setTests] = useState<LaboratoryTest[]>([]);
    const [patientId, setPatientId] = useState("");
    const [consultationId, setConsultationId] = useState("");
    const [requestingDoctorId, setRequestingDoctorId] = useState("");
    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const loadFormData = async () => {
            try {
                const [patientsData, consultationsData, doctorsData, testsData] =
                    await Promise.all([
                        getPatients(),
                        getConsultations(),
                        getDoctors(),
                        getLaboratoryTests(),
                    ]);

                setPatients(patientsData);
                setConsultations(consultationsData);
                setDoctors(doctorsData.filter((doctor) => doctor.is_active));
                setTests(testsData);
            } catch (error) {
                console.error("Failed to load laboratory order form data:", error);
                setErrors(getErrorMessages(error));
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, []);

    const patientConsultations = useMemo(
        () => consultations.filter((consultation) => consultation.patient_id === Number(patientId)),
        [consultations, patientId],
    );

    const selectedConsultation = useMemo(
        () => consultations.find((consultation) => consultation.id === Number(consultationId)),
        [consultations, consultationId],
    );

    const eligibleDoctors = useMemo(() => {
        if (!selectedConsultation) return [];
        return doctors.filter((doctor) => doctor.id === selectedConsultation.doctor_id);
    }, [doctors, selectedConsultation]);

    const handlePatientChange = (value: string) => {
        setPatientId(value);
        setConsultationId("");
        setRequestingDoctorId("");
        setErrors([]);
    };

    const handleConsultationChange = (value: string) => {
        setConsultationId(value);
        const consultation = consultations.find((item) => item.id === Number(value));
        setRequestingDoctorId(consultation ? String(consultation.doctor_id) : "");
        setErrors([]);
    };

    const toggleTest = (testId: number) => {
        setSelectedTestIds((current) =>
            current.includes(testId)
                ? current.filter((id) => id !== testId)
                : [...current, testId],
        );
        setErrors([]);
    };

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (submitting) return;

        const validationErrors: string[] = [];
        if (!patientId) validationErrors.push("Please select a patient.");
        if (!consultationId) validationErrors.push("Please select a consultation.");
        if (!requestingDoctorId) validationErrors.push("Please select the requesting doctor.");
        if (selectedTestIds.length === 0) validationErrors.push("Select at least one laboratory test.");

        if (
            selectedConsultation &&
            (selectedConsultation.patient_id !== Number(patientId) ||
                selectedConsultation.doctor_id !== Number(requestingDoctorId))
        ) {
            validationErrors.push("The selected consultation, patient, and doctor must match.");
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            setErrors([]);
            const order = await createLaboratoryOrder({
                consultation_id: Number(consultationId),
                patient_id: Number(patientId),
                requesting_doctor_id: Number(requestingDoctorId),
                lab_test_ids: selectedTestIds,
                notes: notes.trim() || null,
            });
            navigate(`/laboratory/orders/${order.id}`);
        } catch (error) {
            console.error("Failed to create laboratory order:", error);
            setErrors(getErrorMessages(error));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-slate-800">Create Laboratory Order</h1>
                <p className="mt-4 text-gray-500">Loading form...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Create Laboratory Order</h1>
                    <p className="mt-2 text-gray-600">Request one or more laboratory tests for a consultation.</p>
                </div>
                <button type="button" onClick={() => navigate("/laboratory")} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    Back
                </button>
            </div>

            {errors.length > 0 && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <ul className="list-disc space-y-1 pl-5">
                        {errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
                    </ul>
                </div>
            )}

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="patient" className="mb-2 block text-sm font-medium text-gray-700">Patient *</label>
                            <select id="patient" value={patientId} onChange={(event) => handlePatientChange(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500">
                                <option value="">Select patient</option>
                                {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.patient_number} - {patient.first_name}{patient.middle_name ? ` ${patient.middle_name}` : ""} {patient.last_name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="consultation" className="mb-2 block text-sm font-medium text-gray-700">Consultation *</label>
                            <select id="consultation" value={consultationId} onChange={(event) => handleConsultationChange(event.target.value)} disabled={!patientId} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100">
                                <option value="">{patientId ? "Select consultation" : "Select a patient first"}</option>
                                {patientConsultations.map((consultation) => <option key={consultation.id} value={consultation.id}>#{consultation.id} - Dr. {consultation.doctor_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="requesting-doctor" className="mb-2 block text-sm font-medium text-gray-700">Requesting Doctor *</label>
                        <select id="requesting-doctor" value={requestingDoctorId} onChange={(event) => setRequestingDoctorId(event.target.value)} disabled={!selectedConsultation || eligibleDoctors.length === 0} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100">
                            <option value="">{selectedConsultation ? "Select requesting doctor" : "Select a consultation first"}</option>
                            {eligibleDoctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctorName(doctor)}</option>)}
                        </select>
                        {selectedConsultation && eligibleDoctors.length === 0 && <p className="mt-2 text-sm text-red-600">The consultation's doctor is not available to request this order.</p>}
                    </div>

                    <fieldset>
                        <legend className="mb-2 block text-sm font-medium text-gray-700">Laboratory Tests *</legend>
                        {tests.length === 0 ? (
                            <p className="rounded-lg border border-dashed p-4 text-sm text-gray-500">No active laboratory tests are available.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {tests.map((test) => (
                                    <label key={test.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                                        <input type="checkbox" checked={selectedTestIds.includes(test.id)} onChange={() => toggleTest(test.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span><span className="block text-sm font-medium text-gray-800">{test.name}</span><span className="text-sm text-gray-500">{test.code}</span></span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </fieldset>

                    <div>
                        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                        <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Additional notes..." className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" />
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button type="button" onClick={() => navigate("/laboratory")} disabled={submitting} className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
                        <Button type="submit" disabled={submitting || eligibleDoctors.length === 0} className="w-auto px-5">{submitting ? "Creating..." : "Create Laboratory Order"}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LaboratoryOrderCreate;
