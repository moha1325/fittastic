import Nav from "../routes/nav"




export default function About() {

    return(
        <div>
            <Nav></Nav>
            <div className="columns is-flex is-flex-direction-column is-justify-content-center is-size-1 has-text-centered has-text-black">
                <h1 className="mt-5">About</h1>
                <div className="m-5 is-flex is-justify-content-center">                    
                    <p style={{fontSize: "18px", width : "50%"}} className="box p-5 has-text-centered has-text-black is-mobile">
                        A fitness app serves as a digital companion designed to assist individuals in achieving their health and wellness goals. 
                        Its primary purpose revolves around providing users with a comprehensive platform to track, monitor, and improve various aspects of their physical fitness. 
                        These apps often offer functionalities such as personalized workout routines, dietary guidance, progress tracking, and motivational support through features like goal setting and social interaction. 
                        By leveraging technology, fitness apps aim to enhance accessibility, convenience, and effectiveness in managing one's fitness journey, empowering users to make informed decisions about their health and adopt sustainable lifestyle changes. 
                        Ultimately, the overarching goal of a fitness app is to inspire and facilitate individuals in attaining optimal levels of physical fitness and overall well-being.
                    </p>
                </div>
            </div>
        </div>
    )
}