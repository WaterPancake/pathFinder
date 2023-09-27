import '../Styles/PathFinderMainPage.css'
import { useState } from 'react';
import {GoogleMap, useJsApiLoader, MarkerF} from '@react-google-maps/api'

import DestinationPicker from '../Components/DestinationPicker';
const PathFinderMainPage = () => {
    const {isLoaded} = useJsApiLoader({id: 'google-map-script',googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY})

    
    const showMap = false

    const mapContainerStyleParameter = {
        width:'100%',
        height: '100%'

    }
    const [choosingDestination, setchoosingDestination] = useState(false);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))


    const handleWhereToButtonClick = () =>{
        setchoosingDestination(!choosingDestination)
    }
    // const service = new google.maps.DirectionsService()
    // const handleMarkerClick = () =>{


    // }
    const request = {
        origin: { lat: 40.712776, lng: -74.005974 },
        destination: { lat: 34.052235, lng: -118.243683 },
        travelMode: 'DRIVING'
      };
      const center = { lat: 40.7678, lng: -73.9645 };
    




    return (  
        <div className="PathFinderMapPage">
            <div className="main-container">
                {showMap ? 
                    ( isLoaded ? (
                    <GoogleMap zoom={10} center={{ lat: 40.7678, lng: -73.9645 }} mapContainerStyle={mapContainerStyleParameter} onLoad={(map)=>setMap(map)}>
                        <MarkerF position={{ lat:40.767957,lng:-73.964335 }} />
                        {/* <MarkerF position={{ lat:50.767957,lng:-73.964335 }} /> */}
                        {/* <MarkerF position={{ lat:60.767957,lng:-73.964335 }} /> */}
                    </GoogleMap>) 
                    : (<div className='map-is-loading'>Is Loading...</div>)) 
                : null}

            </div>
            <div className="destination-calculator">
                <div className="destination-calculator-header-buttons">
                    <label className='where-to-button' htmlFor="Where To?" onClick={e => handleWhereToButtonClick()}>Where To?</label>
                    <label className='login-button' htmlFor="login">Login</label>
                </div>
                {choosingDestination ? <DestinationPicker pathOrigin={origin} pathDestination={destination} setOrigin={setOrigin} setDestination={setDestination} /> : <></>}
                <div className="customize-trip">
                    {/* <label htmlFor="" className="customize-trip-button"> Customize</label> */}
                </div>
                <button onClick={()=> map.panTo(center)}>reset</button>

            </div>
        </div> 
    );
}
 
export default PathFinderMainPage;