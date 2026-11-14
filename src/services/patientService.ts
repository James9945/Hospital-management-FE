import api from "../api/axios";

export interface Patient {
    id: number;
    patient_number: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string;
    date_of_birth: string;
    phone: string;
    email: string | null;
}

export interface CreatePatientData {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    gender: "Male" | "Female" | "Other";
    date_of_birth: string;
    phone: string;
    email?: string | null;
    address: string;
    blood_group?: string | null;
    genotype?: string | null;
    emergency_contact_name: string;
    emergency_contact_phone: string;
}



export const createPatient = async (
    data: CreatePatientData,
): Promise<Patient> => {
    const response = await api.post(
        "/patients/register",
        data,
    );

    return response.data.data;
};

export const getPatients = async (): Promise<Patient[]> => {
    const response = await api.get("/patients");

    return response.data.data;
};

export const getPatient = async (
    id: number,
): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);

    return response.data.data;
};

export const updatePatient = async (
    id: number,
    data: {
        first_name?: string;
        middle_name?: string | null;
        last_name?: string;
        gender?: string;
        date_of_birth?: string;
        phone?: string;
        email?: string | null;
    },
): Promise<Patient> => {
    const response = await api.put(
        `/patients/${id}`,
        data,
    );

    return response.data.data;
};

export const deletePatient = async (
    id: number,
) => {
    const response = await api.delete(
        `/patients/${id}`,
    );

    return response.data;
};