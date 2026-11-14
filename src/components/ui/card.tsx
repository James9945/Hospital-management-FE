import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className = "", ...props }: CardProps) => {
    return (
        <div
            className={`rounded-xl bg-white p-6 shadow-md ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;