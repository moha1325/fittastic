import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import "./static/WeightForm.modules.css"

export default function FormWeight(){
    // const user_info = useLoaderData()
    // console.log(user_info)

    // choice state for the goal boxes
    // mostly so when one chooses a goal, the button text will change color and text to indicate their current choice
    // also will be used to make sure someone chooses states before they submit the form
    const [choice, setChoice] = useState("")

    let header = "Input Your Information To Use The Site"
    if(window.location.pathname == "/myaccount/form"){
        header = "Update Your Personal Information"
    }

    // states for the information input elems
    // all should be ints, submit handler will check and make sure they are
    const [theAge, setAge] = useState('invalid')
    const [theWeight, setWeight] = useState('invalid')
    const [theHeight, setHeight] = useState('invalid')

    const navigate = useNavigate()

    function changeChoice(event){
        if((event.target.id === 'maintain_choice' || event.target.id === "loss_choice" || event.target.id === "gain_choice") && choice !== event.target.id){
            // reset previous button to original state
            if(choice !== ""){
                let prevbutton = document.getElementById(choice);
                prevbutton.textContent = "Choose"
                prevbutton.style.backgroundColor = "lightcyan"
            }
            
            // set the button text to something else and change the color
            event.target.textContent = "Chosen"
            event.target.style.backgroundColor = "#7393B3"
            setChoice(event.target.id)
        }
        
        // either chose the same thing or event was triggered with something invalid
        // just return nothing
        else{
            return
        }
    }

    // will do the post to the backend
    async function submitHandler(){
        
        console.log(theAge)
        console.log(theHeight)
        console.log(theWeight)

        if(isNaN(parseInt(theAge))){
            alert("Please Enter a Valid Age!")
            return
        }

        if(isNaN(parseInt(theHeight))){
            alert("Please Enter a Valid Height")
            return
        }

        if(isNaN(parseInt(theWeight))){
            alert("Please Enter a Valid Weight")
            return
        }
        
        let submit_choice = ""

        if(choice === "" || (choice !== 'maintain_choice' && choice !== "loss_choice" && choice !== "gain_choice")){
            console.log(choice)
            alert("Please choose a goal!")
            return
        }

        else{
            if(choice === 'maintain_choice'){
                submit_choice = "maintain"
            }
            else if(choice === "loss_choice"){
                submit_choice = "loss"
            }
            else if(choice === "gain_choice"){
                submit_choice = "gain"
            }
        }
        
        let body_to_send = {
            weight: theWeight, 
            age: theAge, 
            height: theHeight, 
            goal: submit_choice
        }

        console.log(body_to_send)

        // will do post to database here
        navigate("/myaccount/recommendation", {state: { body_to_send }});
        
        let result = await fetch('/api/addinfo', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body_to_send)
        })


        if(result.ok){
            window.location.href = window.location.origin + '/myaccount/form'
        }

        else{
            console.log(result)
        }

    }

    
    return (
        <div className="top_container">
            <div className="inputinfo"> <h1> <b> {header} </b> </h1> </div>
            <div className="weight_container">
                <div className="form_items">
                    <div className="age_container">
                        <p> Age (yr): </p> <input onChange={e=>setAge(e.target.value)} id="age_input" placeholder="Input your Age here"/> 
                    </div>
                    <div className="inputweight_container">
                        <p> Weight (lb.): </p> <input onChange={e=>setWeight(e.target.value)} id="weight_input" placeholder="Input your Weight here"/> 
                    </div>
                    <div className="height_container">
                        <p> Height (in.): </p> <input onChange={e=>setHeight(e.target.value)} id="height_input" placeholder="Input your Height here"/> 
                    </div>
                </div>
            </div>

            <div className="moretext_container">
                <h2> <b> What is your goal? </b> </h2>
            </div>

            <div className="goal_container">

                <div className="gain_choice">
                    <div className="gaintext"> Gain Weight <p> + </p></div>
                    <div className="chooseGainButton"> <button id="gain_choice" onClick={changeChoice}> Choose </button></div>
                </div>

                <div className="maintain_choice">
                    <div className="maintaintext"> Maintain Weight <p> = </p></div>
                    <div className="chooseMaintainButton"> <button id="maintain_choice" onClick={changeChoice}> Choose </button></div>
                </div>

                <div className="lose_choice">
                    <div className="losetext"> Lose Weight <p> - </p></div>
                    <div className="chooseLossButton"> <button id="loss_choice" onClick={changeChoice}> Choose </button></div>
                </div>

            </div>
            <div className="submitbutton_container">
                <button onClick={submitHandler}> Submit </button>
            </div>
        </div>
    )
}
