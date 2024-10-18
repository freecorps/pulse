import Navbar from "@/components/navbar";
import { Jimmy } from "@/components/typewriter-effect";

function teste() {
    return (
        <div>ola</div>
    );
}



export default function forum(){

    return(
        <div>
            <Navbar/>
            <div>
                <Jimmy></Jimmy>
            </div>
            <div className="flex flex-col">
                {teste()}
            </div>
        </div>
    );
}