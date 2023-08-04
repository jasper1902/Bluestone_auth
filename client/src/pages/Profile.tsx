import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
        }
    }, [navigate])

    const onClickLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }
    return (
        <>
            <main className="flex flex-col min-h-screen w-full items-center justify-center gap-4">
                <h1 className="text-4xl font-bold">Profile</h1>
                <button className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-lg font-bold text-white" onClick={onClickLogout}>
                    Logout!
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                </button>
            </main>


        </>
    )
}

export default Profile