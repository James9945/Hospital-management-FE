import api from "../api/axios";

export interface Doctor {
    id: number;
    staff_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    phone: string;
    department_id: number;
    department: string;
    is_active: boolean;
}

export interface UpdateDoctorData {
    first_name?: string;
    middle_name?: string | null;
    last_name?: string;
    email?: string;
    phone?: string;
    department_id?: number;
    is_active?: boolean;
}

export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await api.get("/doctors");

    return response.data.data;
};

export const getDoctor = async (
    id: number,
): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);

    return response.data.data;
};

export interface CreateDoctorData {
    staff_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    department_id: number;
}

export const createDoctor = async (
    data: CreateDoctorData,
) => {
    const response = await api.post(
        "/auth/createStaff",
        data,
    );

    return response.data.data;
};



export const updateDoctor = async (
    id: number,
    data: UpdateDoctorData,
): Promise<Doctor> => {
    const response = await api.put(
        `/users/${id}`,
        data,
    );

    return response.data.data;
};
