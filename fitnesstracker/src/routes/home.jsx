
import Nav from "../routes/nav"
import './static/diet.css'
import image from './images/istockphoto-1159989622-612x612.jpg'
import { useState } from "react";

export default function Home() {

    const [isActive, setIsActive] = useState(false);
    

    return(
        <div className="is-mobile">
            <Nav></Nav>
            <div id="homeBackground" className=" is-flex is-flex-direction-column is-justify-content-center is-mobile">
                <div>
                    <h1 className="has-text-weight-bold has-text-centered has-text-white is-mobile" style={{fontSize: '64px'}}>FIT-TASTIC</h1>
                </div>
            </div>
            <div className="columns is-mobile mt-5 is-flex is-justify-content-space-around is-flex-direction-row">
                <div id="paragraph" className="column has-text-justified has-text-black" >
                    <p style={{marginTop: '50px', margin : 'auto', width: '90%'}}>
                        "This fitness app stands out as an exceptional tool for health enthusiasts and beginners alike, offering a comprehensive suite of features designed to optimize workouts and enhance overall wellness.
                        With its user-friendly interface and customizable workout plans, users can easily tailor their fitness journey to match their unique goals and preferences. 
                        From detailed exercise tutorials and progress tracking to personalized nutrition guidance, this app provides invaluable support every step of the way. 
                        Its community aspect fosters motivation and accountability, enabling users to connect with like-minded individuals, share successes, and find inspiration. 
                        Moreover, the app's intuitive design ensures seamless navigation, making it accessible to individuals of all fitness levels. 
                        Whether striving for weight loss, muscle gain, or simply improved health, this fitness app serves as a reliable companion, empowering users to unlock their full potential and achieve lasting results."
                    </p>
                </div>
                <div className="column">
                    <img className="pt-5" src={image} alt="workout_image" style={{marginTop: '50px', margin : 'auto', width: 'auto', height: 'auto'}}/>
                </div>

            </div>
        </div>
    )

}



