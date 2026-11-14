import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Patients", path: "/patients" },
        { name: "Doctors", path: "/doctors" },
        { name: "Appointments", path: "/appointments" },
        { name: "Laboratory", path: "/laboratory" },
        { name: "Pharmacy", path: "/pharmacy" },
        { name: "Billing", path: "/billing" },
        { name: "Reports", path: "/reports" },
    ];

    return (
        <aside className="h-screen w-64 bg-blue-700 text-white">
            <div className="border-b border-blue-600 p-6">
                <h1 className="text-2xl font-bold">
                    HMS
                </h1>

                <p className="mt-1 text-sm text-blue-200">
                    Hospital Management
                </p>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-6 py-3 transition ${
                                isActive
                                    ? "bg-blue-900 font-semibold"
                                    : "hover:bg-blue-600"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;