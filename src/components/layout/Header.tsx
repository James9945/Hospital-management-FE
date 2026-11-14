const Header = () => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
            <div>
                <h1 className="text-xl font-semibold">
                    Hospital Management System
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium">
                        James Admin
                    </p>

                    <p className="text-sm text-gray-500">
                        Administrator
                    </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    J
                </div>
            </div>
        </header>
    );
};

export default Header;