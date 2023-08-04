import logoImage from "../assets/img/logo2.png"
import fbIcon from "../assets/img/icons-facebook.png"
import igIcon from "../assets/img/icons-ig.png"
import ytIcon from "../assets/img/icons-youtube.png"
import lineIcon from "../assets/img/icons-line.png"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { usePostRequest } from "../hook/usePostRequest"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

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
    const [postData, { statusText, data }] = usePostRequest<LoginResponseType>("http://localhost:5001/api/account/login")

    useEffect(() => {
        if (statusText !== "OK") return
        if (!data) return
        localStorage.setItem("token", data.token)
        navigate("/profile")
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
                    <div className="flex justify-between"><label className="block text-gray-500 font-bold my-4"><input type="checkbox"
                        className="leading-loose text-pink-600" /> <span className="py-2 text-sm text-gray-600 leading-snug"> Remember
                            Me </span></label>  </div>

                    <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl">Login</button>
                    <Link to="/forgotpassword" className="text-center font-medium mt-4 cursor-pointer">Forgotten password?</Link>
                </form>
                <hr className="h-px my-4 bg-gray-500 border-0"></hr>
                <h2 className="text-center font-medium">Contact Us</h2>
                <div className="flex items-center justify-between p-2">
                    <img src={fbIcon} alt="" className="h-14" />
                    <img src={igIcon} alt="" className="h-14" />
                    <img src={lineIcon} alt="" className="h-14" />
                    <img src={ytIcon} alt="" className="h-14" />
                </div>
                <a href="https://www.bluestone.co.th/" className=""><p className="text-center font-medium">www.bluestone.co.th</p></a>
            </div>
            <DevTool control={control} />
        </>
    )
}

export default LoginForm
