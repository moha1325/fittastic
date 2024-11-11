
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useGeolocated } from "react-geolocated";

import Autocomplete from "react-google-autocomplete";

import { useState, useEffect } from "react";

const key = "AIzaSyAKa1_jKCSWElQUXrNA_zj555C-b1pTM78";

export default function GymNearMe() {

    const [location, setLocation] = useState(null);
    //DEFAULT POSITION IS WASHINGTON DC
    const [position, setPosition] = useState({ lat: 38.90, lng: -77.03 });

    const searchAddress = () => {
        console.log(location);
    }

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 5000,
        });

    return (!isGeolocationAvailable ?
        (
            <div>Your browser does not support Geolocation</div>
        ) : !isGeolocationEnabled ? (
            <div>
                <script
                    type="text/javascript"
                    src={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`}
                />
                <div class="box is-flex is-justify-content-center is-flex-direction-column">
                    <label for="location" className="pb-3 is-size-4 has-text-weight-bold" >Find Gym Near You</label>
                </div>
                <div>
                    <APIProvider apiKey={key}>
                        <Map style={{ height: "500px", width: "100%" }} defaultZoom={11} defaultCenter={isGeolocationEnabled ? { lat: coords.latitude, lng: coords.longitude } : position}>
                            <Marker position={isGeolocationEnabled ? { lat: coords.latitude, lng: coords.longitude } : null} />
                        </Map>
                    </APIProvider>
                </div>
            </div>
        ) : coords ? (
            <div>
                <script
                    type="text/javascript"
                    src={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`}
                />
                <div class="box is-flex is-justify-content-center is-flex-direction-column">
                    <label for="location" className="pb-3 is-size-4 has-text-weight-bold" >Find Gym Near You</label>
                </div>
                <div>
                    <APIProvider apiKey={key}>
                        <Map style={{ height: "600px", width: "auto", margin: '10px'}} defaultZoom={16} defaultCenter={isGeolocationEnabled ? { lat: coords.latitude, lng: coords.longitude } : position}>
                            <Marker position={isGeolocationEnabled ? { lat: coords.latitude, lng: coords.longitude } : null} />
                        </Map>
                    </APIProvider>
                </div>
            </div>
        ) : (<div className="is-size-1" style={{ margin: 'auto', marginTop: '20%', width: '50%' }}>Getting the location data&hellip; </div>)
    )

}

