import api from "../api/axios";

export type LaboratoryOrderStatus =
    | "Requested"
    | "Collected"
    | "Processing"
    | "Completed"
    | "Cancelled";

export interface LaboratoryTest {
    id: number;
    name: string;
    code: string;
    description: string | null;
    sample_type: string | null;
    unit: string | null;
    reference_range: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateLaboratoryTestData {
    name: string;
    code: string;
    description?: string | null;
    sample_type?: string | null;
    unit?: string | null;
    reference_range?: string | null;
}

export interface UpdateLaboratoryTestData extends Partial<CreateLaboratoryTestData> {
    is_active?: boolean;
}

export interface LaboratoryOrderItem {
    id: number;
    laboratory_order_id: number;
    lab_test_id: number;
    test_name: string;
    test_code: string;
    result_value: string | null;
    result_unit: string | null;
    reference_range: string | null;
    result_notes: string | null;
    processed_by: number | null;
    processed_by_name: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface LaboratoryOrder {
    id: number;
    consultation_id: number;
    patient_id: number;
    patient_number: string;
    patient_name: string;
    requesting_doctor_id: number;
    requesting_doctor_name: string;
    status: LaboratoryOrderStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items: LaboratoryOrderItem[];
}

export interface CreateLaboratoryOrderData {
    consultation_id: number;
    patient_id: number;
    requesting_doctor_id: number;
    lab_test_ids: number[];
    notes?: string | null;
}

export interface UpdateLaboratoryOrderItemResultData {
    result_value: string;
    result_unit?: string | null;
    result_notes?: string | null;
}

export const getLaboratoryTests = async (): Promise<LaboratoryTest[]> => {
    const response = await api.get("/laboratory/tests");
    return response.data.data;
};

export const getLaboratoryTest = async (id: number): Promise<LaboratoryTest> => {
    const response = await api.get(`/laboratory/tests/${id}`);
    return response.data.data;
};

export const createLaboratoryTest = async (data: CreateLaboratoryTestData): Promise<LaboratoryTest> => {
    const response = await api.post("/laboratory/tests", data);
    return response.data.data;
};

export const updateLaboratoryTest = async (id: number, data: UpdateLaboratoryTestData): Promise<LaboratoryTest> => {
    const response = await api.put(`/laboratory/tests/${id}`, data);
    return response.data.data;
};

export const deleteLaboratoryTest = async (id: number) => {
    const response = await api.delete(`/laboratory/tests/${id}`);
    return response.data;
};

export const getLaboratoryOrders = async (): Promise<LaboratoryOrder[]> => {
    const response = await api.get("/laboratory/orders");
    return response.data.data;
};

export const getLaboratoryOrder = async (id: number): Promise<LaboratoryOrder> => {
    const response = await api.get(`/laboratory/orders/${id}`);
    return response.data.data;
};

export const createLaboratoryOrder = async (data: CreateLaboratoryOrderData): Promise<LaboratoryOrder> => {
    const response = await api.post("/laboratory/orders", data);
    return response.data.data;
};

export const updateLaboratoryOrderStatus = async (id: number, status: LaboratoryOrderStatus): Promise<LaboratoryOrder> => {
    const response = await api.patch(`/laboratory/orders/${id}/status`, { status });
    return response.data.data;
};

export const updateLaboratoryOrderItemResult = async (
    id: number,
    data: UpdateLaboratoryOrderItemResultData,
): Promise<LaboratoryOrderItem> => {
    const response = await api.patch(`/laboratory/order-items/${id}/result`, data);
    return response.data.data;
};
