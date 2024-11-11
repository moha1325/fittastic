
import { useEffect, useState } from 'react'
import style from './static/diet.css'

function createFoodCard(response) {

    const data = document.getElementById("numbers");
    const name = document.getElementById("foodDiv");

    name.children[0].innerText = response.name;
    // console.log(data.children);
    data.children[0].innerText = response.calories;
    data.children[1].innerText = response.carbohydrates_total_g;
    data.children[2].innerText = response.cholesterol_mg;
    data.children[3].innerText = response.fat_saturated_g;
    data.children[4].innerText = response.fat_total_g;
    data.children[5].innerText = response.fiber_g;
    data.children[6].innerText = response.potassium_mg;
    data.children[7].innerText = response.protein_g;
    data.children[8].innerText = response.serving_size_g;
    data.children[9].innerText = response.sodium_mg;
    data.children[10].innerText = response.sugar_g;
    
}

export default function DietLog() {

    const [data, addData] = useState(null);
    const [input, setInput] = useState("");
    const [fetchVal, setFetchVal] = useState("");
    const [days, setDays] = useState(1);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [table, addToTable] = useState([]);
    const [results, setResults] = useState([]);
    const [hasData, setState] = useState(true);
    const [user, setUser] = useState("");

    async function getUser() {
        const response = await fetch("/.auth/me");
        if(response.ok) {
            const result = await response.json();
            console.log(result.clientPrincipal.userId);
            setUser(result.clientPrincipal.userId);
        } else {
            console.log("STATUS :" + response.status);
        }
    }

    const setVal = () => {
        setFetchVal(input);
    }

    useEffect(() => {
        // const formattedDate = currentDate.toDateString();
        for(let i = 0; i < results.length; i++) {
            // console.log(results[i].date + " , " + currentDate.toDateString());
            if(results[i].date === currentDate.toDateString()) {
                console.log(results[i]);
                addToTable([results[i]]);
                setState(false);
                break;
            } else {
                setState(true);
                addToTable([]);
            }
        }
    }, [currentDate, results]);

    const yesterday = () => {
        console.log(table);
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
        setDays(days + 1);
    };

    const tomorrow = () => {
        if (days > 0) {
            console.log(table);
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
            setDays(days - 1);
        }
    };

    useEffect(()=>{
        const fetchData = async () => {
            if(fetchVal !== "") {
                const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${fetchVal}`, {
                    method: "GET",
                    headers: {
                        "X-Api-Key": "OnohGsXooBakpFJQiAxPaQ==Q5JAwosLVG95NAah"
                    }
                });
                const results = await response.json();

                if(results !== null) {
                    console.log(response.status);
                    addData(results.items[0]);
    
                    console.log(results.items[0]);                
                    createFoodCard(results.items[0]);
                    const div = document.getElementById("foodDiv");
                    div.style.visibility = "visible";
                } else {
                    alert("wrong input");
                }
            }
        }

        fetchData();
    }, [fetchVal])

    async function addNewFood() {
        const input = document.getElementById("input");
        input.value = "";
        const div = document.getElementById("foodDiv");
        div.style.visibility = "hidden";
        console.log(currentDate.toDateString());
        const sending = {
            date : currentDate.toDateString(),
            food : [
                {
                    name : data.name,
                    calories : data.calories,
                    carbs : data.carbohydrates_total_g,
                    cholesterol : data.cholesterol_mg,
                    sat_fat : data.fat_saturated_g,
                    fat : data.fat_total_g,
                    fiber : data.fiber_g,
                    potassium : data.potassium_mg,
                    protein : data.protein_g,
                    serving : data.serving_size_g,
                    sodium : data.sodium_mg,
                    sugar : data.sugar_g
                }
            ],
            userID : user
        }

        const response = await fetch("/api/addFood", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sending),
        });

        if(response.ok) {
            const results = await response.json();
            
            console.log(results);
            window.location.reload();
        } else {    
            
            console.log(response.status);
        }   
    }

    useEffect(() => {
        getUser();
        async function getFood() {
            const response = await fetch("/api/getDiet");
            if (response.ok) {
                const results = await response.json();
                console.log(results.dietlog);
                // setResults(results.dietlog);
                for(let i = 0; i < results.dietlog.length; i++) {
                    if(results.dietlog[i].name === user) {
                        setResults(results.dietlog[i].diet);
                    }
                }
            } else {
                console.log(response.status);
                setState(true);
            }
        }
        getFood();
    }, [setResults, setState, user]);

    let totalCal = 0;
    let totalPro = 0;

    if(hasData === false) {
        for(let i = 0; i < table[0].food.length; i++) {
            totalCal += table[0].food[i].calories;
            totalPro += table[0].food[i].protein;
        }
    }

    async function deleteFood(e) {
        console.log(e);
        const sending = {name: e, userID : user, date : currentDate.toDateString()};
        const response = await fetch("/api/deleteFood", {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(sending)
        });

        if(response.ok) {
            const results = await response.json();
            console.log(results);

            if(results.status === 200) {
                window.location.reload();
            }

        } else {
            console.log(response.status);
        }
    }
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <div className={` is-flex is-justify-content-space-between ${isMobile ? 'is-flex-direction-column' : 'is-flex-direction-row'}`} style={{ height: 'auto'}}>
                <div style={{ width: 'auto' }} className='is-flex is-flex-direction-column'>
                    <h1 className="is-size-3 has-text-left has-text-weight-bold pl-2">Diet Logs</h1>
                    <div className='is-flex is-flex-direction-row is-justify-content-space-between mt-3'>
                        <h2 className="is-size-3 has-text-left pl-5 pt-4">{currentDate.toDateString()}</h2>
                        <div className='buttons'>
                            <button className='button is-primary is-small' onClick={yesterday}>&#8592;</button>
                            <button className='button is-primary is-small' onClick={tomorrow}>&#8594;</button>
                        </div>
                    </div>
                    <div className="p-3">
                        {
                            hasData ? <div className='is-size-3 has-text-centered'>No data here</div> :
                            <table className='table is-mobile' id="tableData">
                                <thead>
                                    <tr className='is-size-3'>
                                        <th>Item</th>
                                        <th>Calories</th>
                                        <th>Protein</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.map((datum) => (
                                        datum.food.map((food) => (
                                            <tr className='is-size-5'>
                                                <td className='has-text-weight-bold'>{food.name}</td>
                                                <td>{food.calories} g</td>
                                                <td>{food.protein} g</td>
                                                <td><button id={food.name} className="button is-danger is-small" onClick={(e) => deleteFood(e.target.id)}>&#10005;</button></td>
                                            </tr>
                                        ))
                                    ))}
                                    <tr className='is-size-5'>
                                        <td className='has-text-weight-bold'>Total</td>
                                        <td>{Math.trunc(totalCal)} g</td>
                                        <td>{Math.trunc(totalPro)} g</td>
                                    </tr>
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
                <div style={style} id="searchDiv" className='is-flex is-flex-direction-column'>
                    <h1 className="is-size-3 has-text-left has-text-weight-bold pb-5">Food Bank</h1>
                    <div className="is-flex is-justify-content-space-evenly">
                        <input id="input" type="text" name="search" placeholder="Search Food..." className="input is-info" onChange={e => setInput(e.target.value)} />
                        <button className="button is-info ml-2" onClick={setVal}>Search</button>
                    </div>
                    {
                        <div id="foodDiv" style={{visibility : "hidden"}}>
                            <h1 className="is-size-3">...</h1>
                            <div id="data" className="is-flex is-justify-content-space-between m-2" style={{width: '100%'}}>
                                <div id="label">
                                    <h2>Calories(g)</h2>
                                    <h2>Carbohydrates(g)</h2>
                                    <h2>Cholesterol(mg)</h2>
                                    <h2>Saturated Fat(g)</h2>
                                    <h2>Total Fat(g)</h2>
                                    <h2>Fiber(g)</h2>
                                    <h2>Potassium(mg)</h2>
                                    <h2>Protein(g)</h2>
                                    <h2>Serving Size(g)</h2>
                                    <h2>Sodium(mg)</h2>
                                    <h2>Sugar(g)</h2>
                                </div>
                                <div id="numbers">
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                    <p>.</p>
                                </div>
                            </div>
                            <div className="is-flex is-justify-content-end">
                                <input type="button" value="Add" className="button is-info" onClick={addNewFood}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )

}



