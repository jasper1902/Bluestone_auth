import logoImage from "../assets/img/logo2.png"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { usePostRequest } from "../hook/usePostRequest"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

interface RegisterFormType {
    username: string
    email: string
    password: string
    confirmPassword: string
}

const RegisterForm = () => {
    const { register, control, handleSubmit, formState, getValues } = useForm<RegisterFormType>()
    const { errors } = formState
    const navigate = useNavigate();
    const [postData, { statusText, hasError, errorMessage }] = usePostRequest<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/account/register`)

    useEffect(() => {
        if (statusText === "Created") {
            navigate("/login")
        }
    }, [navigate, statusText])

    const onSubmit = (data: RegisterFormType) => {
        const obj = {
            user: {
                username: data.username,
                password: data.password,
                email: data.email
            }
        }
        postData(obj)
    };

    return (
        <>
            <div className="max-w-[384px] mx-auto bg-white p-4 rounded-xl mt-20">
                <img src={logoImage} alt="" />
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5 p-4">

                    <div>
                        <input type="text" {...register("username", { required: { value: true, message: "Username is required" }, minLength: { value: 4, message: "Username should be at least 4 characters" } })} id="username" placeholder="Username" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label htmlFor="username" className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.username?.message}</span>
                        </label>
                    </div>
                    <div>
                        <input type="password" {...register("password", { required: { value: true, message: "Password is required" }, minLength: { value: 6, message: "Password should be at least 6 characters" } })} id="password" placeholder="Password" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.password?.message}</span>
                        </label>
                    </div>

                    <div>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === getValues("password") || "Passwords do not match",
                            })}
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            className="rounded-md py-2 border-gray-300 border p-2 w-full"
                        />
                        <label className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.confirmPassword?.message}</span>
                        </label>
                    </div>

                    <div>
                        <input type="email" {...register("email", { pattern: { value: /^[a-zA-Z0-9.!#$%&'*+/=>?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Invalid email format" } })} id="email" placeholder="Email" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.email?.message}</span>
                        </label>
                    </div>

                    {hasError && <label className="flex items-center justify-between select-none">
                        <span className="text-sm text-red-600">{errorMessage}</span>
                    </label>}

                    <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl">Register</button>
                    <Link to="/login" className="text-center font-medium cursor-pointer">login</Link>
                </form>
                <Footer />
            </div>
            <DevTool control={control} />
        </>
    )
}

export default RegisterForm
