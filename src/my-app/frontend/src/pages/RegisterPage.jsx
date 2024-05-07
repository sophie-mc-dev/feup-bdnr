import "../index.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";
import { useForm } from "react-hook-form";

function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: { errors }} = useForm();

    const redirectUser = () => {
        navigate(location.state?.from ? location.state.from : "/");
    };

    useEffect(() => {
        if (user) {
            redirectUser();
        }
    }, [user]);

    const onSubmit = async(data) => {
        console.log(data);
        setErrorMessage("");
        if (!data.name || !data.email || !data.username || !data.password || !data.confirmPassword) {
            setErrorMessage("Please fill in all fields");
            return;
        } else if (data.password !== data.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        } else {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:3000/users/register", data)
                if (response.data.error) {
                    setErrorMessage(response.data.error);
                    setLoading(false);
                } else {
                    await login(response.data).then(() => {redirectUser()} );
                }
            } catch(error) {
                        setErrorMessage("Server Error - Please try again later");
                        setLoading(false);
                }
            }
    };

    return (
        <>
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full flex flex-col items-center space-y-8">
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900"> New Account </h2>
                        <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Name"
                                    {...register("name")}
                                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" />
                                {errors.name && <p className="mt-2 text-sm text-red-600">Name is required</p>}
                            </div>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                {...register("email")}
                                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Email" />
                            </div>
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                {...register("username")}
                                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Username" />
                            </div>
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                {...register("password")}
                                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Password"/>
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                {...register("confirmPassword")}
                                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Confirm Password"/>
                            </div>

                            <div className="text-sm">
                                {errorMessage ? <p className="text-red-600">{errorMessage}</p> : null}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-normal rounded-md text-white bg-[#242565] hover:bg-[#393a9e] focus:outline-none focus:ring-2 focus:ring-offset-2">SIGN UP</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default RegisterPage;
  