import { useForm } from "react-hook-form"
import { usePostRequest } from "../hook/usePostRequest";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface ChangePasswordFormType {
    otp: string;
    password: string;
    confirmPassword: string;
}

const ChangePasswordForm = ({ email }: { email: string }) => {
    const { register, handleSubmit, formState, getValues } = useForm<ChangePasswordFormType>()
    const { errors } = formState
    const navigate = useNavigate()

    const [postData, { statusText, hasError, errorMessage }] = usePostRequest<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/account/changepassword`)

    useEffect(() => {
        if (statusText === "OK") {
            navigate("/login")
        }
    }, [navigate, statusText])

    const onSubmit = (data: ChangePasswordFormType) => {
        const obj = {
            email: email,
            otp: data.otp,
            password: data.password,
        }
        postData(obj)
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5 p-4">
                <div>
                    <input type="text" {...register("otp", { required: { value: true, message: "OTP is required" } })} id="otp" placeholder="OTP" className="rounded-md py-2 border-gray-300 border p-2 w-full" />
                    <label className="flex items-center justify-between px-1 py-2 select-none">
                        <span className="text-sm text-red-600">{errors.otp?.message}</span>
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
                {hasError && <label className="flex items-center justify-between select-none">
                    <span className="text-sm text-red-600">{errorMessage}</span>
                </label>}
                <button type="submit" className="bg-sky-800 text-white py-2 rounded-xl">Submit</button>
            </form>
        </>
    )
}

export default ChangePasswordForm