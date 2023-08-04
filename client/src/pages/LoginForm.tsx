import logoImage from "../assets/img/logo2.png"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { usePostRequest } from "../hook/usePostRequest"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

interface LoginFormType {
    identifier: string
    password: string
}

interface LoginResponseType {
    username: string
    email: string
    token: string
    role: string
}

const LoginForm = () => {
    const { register, control, handleSubmit, formState } = useForm<LoginFormType>()
    const { errors } = formState
    const navigate = useNavigate();
    const [postData, { statusText, data, errorMessage, hasError }] = usePostRequest<LoginResponseType>(`${import.meta.env.VITE_API_URL}/api/account/login`)

    useEffect(() => {
        if (statusText !== "OK") return
        if (!data) return
        localStorage.setItem("token", data.token)
        navigate("/")
    }, [data, navigate, statusText])

    const onSubmit = (data: LoginFormType) => {
        const obj = {
            user: {
                identifier: data.identifier,
                password: data.password,
            }
        }
        postData(obj)
    };

    return (
        <>
            <div className="max-w-[384px] mx-auto bg-white p-4 rounded-xl mt-20">
                <img src={logoImage} alt="" />
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5 p-4">

                    <div>
                        <input type="text" {...register("identifier", { required: { value: true, message: "Username is required" }, minLength: { value: 4, message: "Username should be at least 4 characters" } })} id="username" placeholder="Username" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label htmlFor="username" className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.identifier?.message}</span>
                        </label>
                    </div>
                    <div>
                        <input type="password" {...register("password", { required: { value: true, message: "Password is required" }, minLength: { value: 6, message: "Password should be at least 6 characters" } })} id="password" placeholder="Password" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.password?.message}</span>
                        </label>
                    </div>

                    {hasError && <label className="flex items-center justify-between select-none">
                        <span className="text-sm text-red-600">{errorMessage}</span>
                    </label>}

                    <div className="flex justify-between"><label className="block text-gray-500 font-bold my-4"><input type="checkbox"
                        className="leading-loose text-pink-600" /> <span className="py-2 text-sm text-gray-600 leading-snug"> Remember
                            Me </span></label>  </div>

                    <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl">Login</button>
                    <Link to="/forgotpassword" className="text-center font-medium cursor-pointer">Forgotten password?</Link>
                    <Link to="/register" className="text-center font-medium cursor-pointer">Register</Link>
                </form>
                <Footer />
            </div>
            <DevTool control={control} />
        </>
    )
}

export default LoginForm
