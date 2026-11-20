import api from "../api/axios";

// Login
export interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    const response = await api.post("/auth/login", payload);

    return response.data;
};

// Registration
export interface RegisterPayload {
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

export const register = async (payload: RegisterPayload) => {
    const response = await api.post("/auth/createStaff", payload);

    return response.data;
};