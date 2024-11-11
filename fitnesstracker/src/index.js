import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from 'react';
import Error from './routes/404';
import Home from './routes/home';
import About from './routes/about';
import Feature from './routes/feature';
import SignUp from './routes/signup';
import LoginIn from './routes/login';
import Account from './routes/account';
import DietLog from './routes/diet';
import GymNearMe from './routes/gym';
import Workout from './routes/workout';
import FormWeight from './routes/WeightForm';
import Recommendation from './routes/recommendation';
import ProgressComp from './routes/Progress';
import { redirect } from 'react-router-dom';


async function foundInfo(){
  let result = await fetch('/api/getinfo')
  let x = await result.json() 
  let didweight = false
  if(x[0].data){
    didweight = true
  }

  return didweight 
}

// mainly used for auth redirect to / when user logged out
// also does a request for info to see if there
async function needauthloader({ request, params }) {
  let authresult = await fetch('/.auth/me')
  authresult = await authresult.json()
  console.log(authresult)
  // check for authentication roles
  if(!authresult["clientPrincipal"] || !authresult["clientPrincipal"]["userRoles"].includes("anonymous") || !authresult["clientPrincipal"]["userRoles"].includes("authenticated")){
    return redirect("/")
  }



  else{
    let x = await foundInfo() 
    console.log(x)
    if(!x && window.location.pathname != "/weightform"){
      return redirect("/weightform")
    }
    return true
  }
}

async function weightformloader(){
  
  let authresult = await fetch('/.auth/me')
  authresult = await authresult.json()
  console.log(authresult)
  console.log("Weight")
  // check for authentication roles
  if(!authresult["clientPrincipal"] || !authresult["clientPrincipal"]["userRoles"].includes("anonymous") || !authresult["clientPrincipal"]["userRoles"].includes("authenticated")){
    return redirect("/")
  }
  else{
    return true
  }

}

// mainly used for auth redirect to myaccount when user logged in
async function noauthloader({ request, params }) {
  console.log("IN HERE")
  let result = await fetch('/.auth/me')
  result = await result.json()
  console.log(result)
  // check for authentication roles
  if(result["clientPrincipal"] && result["clientPrincipal"]["userRoles"].includes("anonymous") && result["clientPrincipal"]["userRoles"].includes("authenticated")){
      console.log("OK")
      return redirect("/myaccount/workout")
  }
  else{
      console.log("passed that..")
      return 1
  }
}

const router = createBrowserRouter([
  {
    path : "/",
    element: <App/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/home",
    element: <Home/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/about",
    element: <About/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/features",
    element: <Feature/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/sign_up",
    element: <SignUp/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/login_in",
    element: <LoginIn/>,
    loader: noauthloader,
    errorElement : <Error/>,
  },
  {
    path : "/weightform",
    element : <FormWeight/>, 
    loader: weightformloader,
    errorElement : <Error/>,
  },
  {
    path : "/myaccount",
    element: <Account/>,
    loader: needauthloader,
    errorElement : <Error/>,
    children : [
      {
        path : "/myaccount/dietlog",
        element : <DietLog/>,
        errorElement : <Error/>,
      },
      {
        path : "/myaccount/gym_near_me",
        element : <GymNearMe/>,
        errorElement : <Error/>,
      },
      {
        path : "/myaccount/workout",
        element : <Workout/>,
        errorElement : <Error/>,
      },
      {
        path : "/myaccount/form",
        element : <FormWeight/>,
        loader: async ({ request, params }) => {
          const result = await fetch("/api/getinfo", {
            signal: request.signal,
            method: "get",
          });
      
          if (result.ok) {
            let x = await result.json()
            return x
          } 
          
          else {
            throw new Response("ERROR", { status: result.status });
          }
        },
        errorElement : <Error/>,
      },
      {
        path : "/myaccount/progress",
        element : <ProgressComp/>,
        loader: async ({ request, params }) => {
          const result = await fetch("/api/getimages", {
            signal: request.signal,
            method: "get",
          });
      
          if (result.ok) {
            let x = await result.json()
            return x
          } 
          
          else {
            throw new Response("ERROR", { status: result.status });
          }
        },
        errorElement : <Error/>,
      },
      {
        path : "/myaccount/recommendation",
        element : <Recommendation/>,
        errorElement : <Error/>,
      }
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
