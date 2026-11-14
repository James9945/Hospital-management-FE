interface StatCardProps {
    title: string;
    value: string | number;
    color?: string;
}

const StatCard = ({
    title,
    value,
    color = "bg-blue-600",
}: StatCardProps) => {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <div
                className={`mb-4 h-3 w-16 rounded ${color}`}
            />

            <h3 className="text-gray-500 text-sm">
                {title}
            </h3>

            <p className="mt-2 text-3xl font-bold">
                {value}
            </p>
        </div>
    );
};

export default StatCard;