import api from "../api/axios";

export interface Consultation {
    id: number;
    appointment_id: number;
    patient_id: number;
    patient_number: string;
    patient_name: string;
    doctor_id: number;
    doctor_name: string;
    diagnosis: string;
    treatment_plan: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** Retrieves consultations exposed by the existing consultation API. */
export const getConsultations = async (): Promise<Consultation[]> => {
    const response = await api.get("/consultations");
    return response.data.data;
};
