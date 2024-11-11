import { Link, Outlet } from "react-router-dom"
import Nav from "./nav"

export default function Account() {
    
    return (
        <div>
            <Nav></Nav>
            <div class="is-flex" style={{height : '100vh'}}>
                <div style={{background : "transparent", width:'auto', backgroundColor : "rgba(0,0,0,0.2"}}>
                    <aside class="menu">
                        <ul class="menu-list has-text-weight-bold has-text-black is-mobile is-desktop">
                            <li class="mb-3"><Link to="/myaccount/workout" class="is-size-6">Workout</Link></li> 
                            <li class="mb-3"><Link to="/myaccount/dietlog" class="is-size-6">Diet Log</Link></li> 
                            <li class="mb-3"><Link to="/myaccount/progress" class="is-size-6">Progress</Link></li> 
                            <li class="mb-3"><Link to="/myaccount/gym_near_me" class="is-size-6">Gym Near Me</Link></li> 
                            <li class="mb-3"><Link to="/myaccount/form" class="is-size-6">Update</Link></li> 
                        </ul>
                    </aside>
                </div>
                <div style={{height:'auto', width: '100%'}}>
                    {/* this will be where you put the feature */}
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )

}


