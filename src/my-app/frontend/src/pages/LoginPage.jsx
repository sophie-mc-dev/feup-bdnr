import "../index.css";
import React, {useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useContext(UserContext);
    const [formData, setFormData] = useState({username: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const redirectUser = () => {
        navigate(location.state?.from ? location.state.from : '/');
    }

    useEffect(() => {
        if(user) {
            redirectUser();
        }
    }, [user])

    const handleInputChange = (e) => {
        if (errorMessage) {
            setErrorMessage('');
        }
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setErrorMessage("Please fill in all fields");
            return;
        } else {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:3000/users/login', {...formData});
                if (response.data.error) {
                    setErrorMessage(response.data.error);
                    setLoading(false);
                } else {
                    await login(response.data).then(() => {redirectUser()})
                }
            } catch (error) {
                setLoading(false);
                setErrorMessage('Invalid username or password');
            }
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading/>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <input type="hidden" name="remember" value="true" />
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="username" className="sr-only">Username</label>
                                    <input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-t-md focus:outline-none focus:border-blue-700 focus:z-10 sm:text-sm" placeholder="username or email" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-b-md focus:outline-none focus:ring-blue-700 focus:border-blue-700 focus:z-10 sm:text-sm" placeholder="password" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    {errorMessage ? <div className="text-red-600">{errorMessage}</div> : null}
                                </div>
                            </div>

                            <div>
                            <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-normal rounded-md text-white bg-[#242565] hover:bg-[#393a9e] focus:outline-none focus:ring-2 focus:ring-offset-2">LOGIN</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginPage;