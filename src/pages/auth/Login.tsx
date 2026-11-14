import { useState } from "react";
import Card from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

import { login } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    console.log({
        email,
        password,
    });

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
            event.preventDefault();

            if (!email || !password) {
                alert("Email and password are required.");
                return;
            }

            try {
                setLoading(true);

                const response = await login({
                    email,
                    password,
                });

                localStorage.setItem("token", response.data.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                console.log("Navigating to dashboard...");
                navigate("/dashboard");

                alert("Login successful!");
            } catch (error) {
                console.error(error);
                alert("Login failed.");
            } finally {
                setLoading(false);
            }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Hospital Management
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                       <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                       <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;