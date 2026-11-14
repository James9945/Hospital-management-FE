import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import Patients from "../pages/patients/Patients";
import PatientDetails from "../pages/patients/PatientDetails";
import PatientCreate from "../pages/patients/PatientCreate";

import Doctors from "../pages/doctors/Doctors";
import DoctorDetails from "../pages/doctors/DoctorDetails";
import DoctorCreate from "../pages/doctors/DoctorCreate";

import Appointments from "../pages/appointments/Appointments";
import CreateAppointment from "../pages/appointments/CreateAppoitment";
import AppointmentDetails from "../pages/appointments/AppointmentDetails";

import Laboratory from "../pages/laboratory/Laboratory";
import LaboratoryOrderCreate from "../pages/laboratory/LaboratoryOrderCreate";
import LaboratoryOrderDetails from "../pages/laboratory/LaboratoryOrderDetails";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import Billing from "../pages/billing/Billing";
import Reports from "../pages/reports/Reports";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route
                        path="/"
                        element={<Login />}
                    />
                </Route>

                {/* Protected Routes */}
                <Route element={<DashboardLayout />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* Patients */}
                    <Route
                        path="/patients"
                        element={<Patients />}
                    />

                    <Route
                        path="/patients/:id"
                        element={<PatientDetails />}
                    />

                    <Route
                        path="/patients/create"
                        element={<PatientCreate />}
                    />

                    {/* Doctors */}
                    
                    <Route
                        path="/doctors/create"
                        element={<DoctorCreate />}
                    />
                    
                    <Route
                        path="/doctors"
                        element={<Doctors />}
                    />

                    <Route
                        path="/doctors/:id"
                        element={<DoctorDetails />}
                    />

                    {/* Appointments */}
                    <Route
                        path="/appointments"
                        element={<Appointments />}
                    />

                    <Route
                        path="/appointments/create"
                        element={<CreateAppointment />}
                    />

                    <Route
                        path="/appointments/:id"
                        element={<AppointmentDetails />}
                    />

                    {/* Other Modules */}
                    <Route
                        path="/laboratory"
                        element={<Laboratory />}
                    />

                    <Route
                        path="/laboratory/orders/create"
                        element={<LaboratoryOrderCreate />}
                    />

                    <Route
                        path="/laboratory/orders/:id"
                        element={<LaboratoryOrderDetails />}
                    />

                    <Route
                        path="/pharmacy"
                        element={<Pharmacy />}
                    />

                    <Route
                        path="/billing"
                        element={<Billing />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />
                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={
                        <div className="flex h-screen items-center justify-center text-2xl font-semibold">
                            404 | Page Not Found
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
