
import { Link } from "react-router-dom"
import image from './images/images.png'
import { useState } from "react";




export default function Nav() {
    const [isActive, setIsActive] = useState(false);
    const [logout, setLogOutStatus] = useState(false);
    async function getUser() {

        const response = await fetch("/.auth/me");
    
        if(response.ok) {
            const results = await response.json();
            console.log(results.clientPrincipal);
            if(results.clientPrincipal !== null) {
                setLogOutStatus(true);
            }
        } else {
            console.log(response.status);
        }
    }

    getUser();

    const toggleNavbar = () => {
        setIsActive(!isActive);
        console.log("PRESS")
    };

    return (
        <div className="navbar has-background-black" style={{width : '100%'}}>
            <div>
                {/* this link is for Bulma which is our css */}
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"></link>
            </div>
            <div className="navbar-brand is-size-2">
                <figure className="image is-64x64 m-2">
                    <a href="/"><img src={image} alt="Dumbbell" className="is-rounded"></img></a>
                </figure>
                <div role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" onClick={toggleNavbar}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>    
                </div>
            </div>
            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`} style={{width: 'auto'}}>
                <div className="navbar-start">
                    <div className="navbar-item is-size-5">
                        <Link to="/home" className={`${isActive ? "has-text-black" : "has-text-primary-light"}`}>Home</Link>
                    </div>
                    <div className="navbar-item is-size-5">
                        <Link to="/about" className={`${isActive ? "has-text-black" : "has-text-primary-light"}`}>About</Link>
                    </div>
                    <div className="navbar-item is-size-5">
                        <Link to="/features" className={`${isActive ? "has-text-black" : "has-text-primary-light"}`}>Features</Link>
                    </div>
                </div>
                <div className="navbar-end">
                    {
                        logout ?                             
                            <div className={`${isActive ? "navbar-item is-size-5 mr-6" : "navbar-item has-text-right is-size-5 mr-6"}`}>
                                <a href={window.location.origin + '/.auth/logout'} className={`${isActive ? "has-text-black" : "has-text-primary-light"}`}>Sign Out</a>
                            </div> 
                            : 
                            <div className={`${isActive ? "navbar-item is-size-5 mr-6" : "navbar-item has-text-right is-size-5 mr-6"}`}>
                                <a href={window.location.origin + '/.auth/login/userlogin?post_login_redirect_uri=/myaccount'} className={`${isActive ? "has-text-black" : "has-text-primary-light"}`}>Sign In</a>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}


