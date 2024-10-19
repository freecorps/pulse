
import Footer from "@/components/footer"
import {FocusCardsDemo} from "@/components/cardjogos"
import Navbar from "@/components/navbar"

export default function games(){

    return(
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="mb-24 mt-24">
                <FocusCardsDemo />
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    );
}