import logoImage from "../assets/img/logo2.png"
import fbIcon from "../assets/img/icons-facebook.png"
import igIcon from "../assets/img/icons-ig.png"
import ytIcon from "../assets/img/icons-youtube.png"
import lineIcon from "../assets/img/icons-line.png"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { usePostRequest } from "../hook/usePostRequest"
import { useEffect, useState } from "react"
import ChangePasswordForm from "../components/ChangePasswordForm"
import Loading from "../components/Loading"

interface ForgotPasswordType {
    email: string
}

const ForgotPassword = () => {
    const [sendToken, setSendToken] = useState(false)
    const { register, control, handleSubmit, formState, getValues } = useForm<ForgotPasswordType>()
    const { errors } = formState

    const [postData, { statusText, data, progress, hasError, errorMessage }] = usePostRequest<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/account/sendemail`)

    useEffect(() => {
        if (statusText === "OK") {
            setSendToken(true)
        }
    }, [statusText, data])

    const onSubmit = (data: ForgotPasswordType) => {
        postData({ email: data.email })
    };
    return (
        <>
            <div className="max-w-[384px] mx-auto bg-white p-4 rounded-xl mt-20">
                <img src={logoImage} alt="" />
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center">Forgot Password</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5 p-4">

                    <div>
                        <input type="email" {...register("email", { pattern: { value: /^[a-zA-Z0-9.!#$%&'*+/=>?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: "Invalid email format" } })} id="email" placeholder="Email" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                        <label className="flex items-center justify-between px-1 py-2 select-none">
                            <span className="text-sm text-red-600">{errors.email?.message}</span>
                        </label>
                    </div>

                    <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl flex items-center justify-center gap-2">{progress ? <><Loading /> Loading...</> : "Send Reset Token "}</button>
                </form>
                {hasError && <label className="flex items-center justify-between select-none">
                    <span className="text-sm text-red-600">{errorMessage}</span>
                </label>}

                {sendToken && <ChangePasswordForm email={getValues("email")} />}
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

export default ForgotPassword
