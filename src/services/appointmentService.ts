import api from "../api/axios";

export interface Appointment {
    id: number;
    patient_id: number;
    patient_number: string;
    patient_name: string;
    doctor_id: number;
    doctor_name: string;
    department_id: number;
    department: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    visit_type: string;
    reason: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export const getAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get("/appointments");

    return response.data.data;
};

export const getAppointment = async (id: number) => {
    const response = await api.get(`/appointments/${id}`);

    return response.data.data;
};

export const updateAppointment = async (
    id: number,
    data: {
        doctor_id?: number;
        department_id?: number;
        appointment_date?: string;
        appointment_time?: string;
        status?: string;
        visit_type?: string;
        reason?: string;
        notes?: string | null;
    },
) => {
    const response = await api.put(
        `/appointments/${id}`,
        data,
    );

    return response.data.data;
};


export const deleteAppointment = async (
    id: number,
) => {
    const response = await api.delete(
        `/appointments/${id}`,
    );

    return response.data;
};

