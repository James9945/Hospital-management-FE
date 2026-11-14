import api from "../api/axios";

export interface Department {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const getDepartments = async (): Promise<Department[]> => {
    const response = await api.get("/departments");

    return response.data.data;
};
