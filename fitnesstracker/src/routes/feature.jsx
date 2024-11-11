
import Nav from "../routes/nav"



export default function Feature() {

    return (
        <div>
            <Nav></Nav>
            <div className="is-size-1 has-text-centered has-text-black">
                <h1 className="mt-5">Features</h1>
            </div>
            <div className="m-2 is-flex is-flex-direction-column is-justify-content-center is-align-content-center">
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Workout</h2>
                    <p className="is-size-6">
                        This feature allows users to access a variety of workout routines tailored to their fitness level, goals, and preferences. 
                        It may include options for strength training, cardio, flexibility exercises, and more, with detailed instructions and demonstrations for each exercise.
                    </p>
                </div>
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Diet Log</h2>
                    <p className="is-size-6">
                        The diet log feature enables users to track their daily food intake, including meals, snacks, and beverages. 
                        It often includes a database of foods and their nutritional information, allowing users to monitor their calorie intake, macronutrient distribution, and overall nutritional balance.
                    </p>
                </div>
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Progress</h2>
                    <p className="is-size-6">
                        Progress tracking features provide users with visual representations of their fitness journey over time. 
                        This may include graphs, charts, or timelines showing changes in weight, body measurements, workout performance, and other relevant metrics. 
                        Users can track their progress towards their goals and identify areas for improvement.
                    </p>
                </div>
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Gym Near Me</h2>
                    <p className="is-size-6">
                    This feature uses location-based services to help users find nearby gyms, fitness centers, or workout facilities. 
                    It may include information such as facility hours, amenities, membership options, and user reviews, enabling users to make informed decisions about where to exercise.
                    </p>
                </div>
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Recommendation</h2>
                    <p className="is-size-6">
                        The recommendation feature utilizes algorithms based on user preferences, goals, and past activities to suggest personalized workouts, meal plans, and other relevant content. 
                        Recommendations may also include tips, articles, or videos to help users optimize their fitness routines and achieve better results.
                    </p>
                </div>
                <div className="box mb-3" style={{width: "50%", margin: "auto"}}>
                    <h2 className="is-size-4">Update</h2>
                    <p className="is-size-6">
                        The update goal feature allows users to modify their fitness goals based on their progress, changing priorities, or new objectives. 
                        Users can adjust parameters such as target weight, workout frequency, dietary preferences, or performance targets to ensure their fitness plan remains relevant and motivating.
                    </p>
                </div>
            </div>
        </div>
    )
}