// import { useLocation, useLocalStorage } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import usePersistedState from 'use-persisted-state-hook';

// const Groq = require("groq-sdk");

// export default function Recommendation() {
//     const groq = new Groq({
//         apiKey: process.env.API_KEY,         // AI API key configs
//         dangerouslyAllowBrowser: true,
//     });

//     const location = useLocation();                     // vars and functions that get props from WeightForm
    
//     const [ weight, setWeight ] = useState("");
//     const [ age, setAge ] = useState("");
//     const [ height, setHeight ] = useState("");
//     const [ goal, setGoal ] = useState("");
    
//     /**************************************************/        // this is a WIP, but this is where the exercise and diet plans will be saved
//     const [ recommendation, setRecommendation ] = usePersistedState('recommendation', [
//         {
//             exercise: [],
//             diet: [],
//         }
//     ]);

//     const [ persistStats, setPersistStats ] = usePersistedState('persistStats', [
//         {
//             weight: "",
//             age: "",
//             height: "",
//             goal: "",
//         }
//     ])
    
//     const [ persistResponse, setPersistResponse ] = usePersistedState('persistResponse', [
//         {
//             response: "",
//         }
//     ])

//     const handleOnClick = ((e) => {
//         makeRequest();
//         console.log(JSON.stringify(recommendation.exercise + ", " + recommendation.diet));
//         console.log(JSON.stringify(`Weight: ${persistStats.weight}, Age: ${persistStats.age}, Height: ${persistStats.height}, Goal: ${persistStats.goal}`));
//         console.log(JSON.stringify(persistResponse.response));
//     });

//     async function asyncCall() {                    // gets form data from current state
//         const state = await location.state;
//         //const state = location.state;
//         if (state != null) {
//             return JSON.stringify(state);
//         }
//         return;
//     }

//     async function makeRequest() {                              // generates the AI response
//         const chatCompletion = await getGroqChatCompletion();       // using the example from the Groq website
//         // Print the completion returned by the LLM.
//         var exerciseStr = "";
//         var dietStr = "";
//         if (chatCompletion === null && persistStats === undefined) {
//             //console.log("");
//             exerciseStr = "A recommended exercise routine was not generated.";
//             dietStr = "A recommended diet plan was not generated.";
//             setRecommendation({exercise: [exerciseStr], diet: [dietStr]});
//         } else {
//             exerciseStr = "We recommend the following exercise routine:";
//             dietStr = "We recommend the following diet plan: ";
//             setRecommendation({exercise: [exerciseStr], diet: [dietStr]});

//             //const response = chatCompletion.choices[0]?.message?.content || "";
//             if (chatCompletion != null) {
//                 const response = chatCompletion.choices[0]?.message?.content || "";
//                 setPersistResponse({response});
//             }

//             //const s = response.match("Day \\d*: .*$");
            
//         }
//     }

//     function updateStats() {
//         this.weight.updateItem(this.weight);
//         this.age.updateItem(this.age);
//         this.height.updateItem(this.height);
//         this.goal.updateItem(this.goal);
//     }

//     async function getGroqChatCompletion() {            // creates the input for the AI
//         const stateStr = await asyncCall();
//         if (!stateStr) {
//             return;
//         }

//         const stats = JSON.parse(stateStr).body_to_send;

//         setWeight(stats.weight);
//         setAge(stats.age);
//         setHeight(stats.height);
//         setGoal(stats.goal);

//         //updateStats();
//         if (weight === undefined && age === undefined && height === undefined && goal === undefined) {
//             updateStats();
//         }

//         setPersistStats({weight, age, height, goal});

//         var str = "List a 7-day exercise plan and a three meal diet routine for a " + age + " year old who is " + height + " inches tall and weighs " + weight + " lbs";
//         if (goal.includes("maintain")) {
//             str = str.concat(" to maintain their weight.");
//         } else if (goal.includes("lose")) {
//             str = str.concat(" to lose weight.");
//         } else if (goal.includes("gain")) {
//             str = str.concat(" to gain weight.");
//         }
//         str = str.concat(" Please make the list in numerals.");
        
//         return groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: str,
//                 }
//             ],
//             model: "mixtral-8x7b-32768"
//         });
//     };

//     return (                                    // this is a WIP, but it should display a recommended schedule and diet plan
//         <div>
//             <button onClick={handleOnClick}>Generate a recommended schedule</button>
//             <h1>Exercise: {recommendation.exercise}</h1>
//             <h1>Diet: {recommendation.diet}</h1>
//             <p>response: {persistResponse.response}</p>
//         </div>
//     );
// };