import logoImage from "../assets/img/logo2.png"
import fbIcon from "../assets/img/icons-facebook.png"
import igIcon from "../assets/img/icons-ig.png"
import ytIcon from "../assets/img/icons-youtube.png"
import lineIcon from "../assets/img/icons-line.png"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { usePostRequest } from "../hook/usePostRequest"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
    const [postData, { statusText }] = usePostRequest<{ message: string }>("http://jasper.3bbddns.com:28863/api/account/register")

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

                    <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl">Register</button>
                </form>
                <hr className="h-px my-8 bg-gray-500 border-0"></hr>
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

export default RegisterForm
