import fbIcon from "../assets/img/icons-facebook.png"
import igIcon from "../assets/img/icons-ig.png"
import ytIcon from "../assets/img/icons-youtube.png"
import lineIcon from "../assets/img/icons-line.png"

const Footer = () => {
    return (
        <>
            <hr className="h-px my-8 bg-gray-500 border-0"></hr>
            <h2 className="text-center font-medium">Contact Us</h2>
            <div className="flex items-center justify-between p-2">

                <a href="https://www.facebook.com/Bluestone.co.th/"><img src={fbIcon} alt="" className="h-14" /></a>
                <a href="https://www.instagram.com/bluestonethailand/"><img src={igIcon} alt="" className="h-14" /></a>
                <a href="https://line.me/ti/p/~@bluestonethailand"><img src={lineIcon} alt="" className="h-14" /></a>
                <a href="https://www.youtube.com/channel/UCQ3mRpetmm5Ek-LLdTjwaNQ"><img src={ytIcon} alt="" className="h-14" /></a>
            </div>
            <a href="https://www.bluestone.co.th/" className=""><p className="text-center font-medium">www.bluestone.co.th</p></a></>
    )
}

export default Footer