import '../Styles/PathFinderMainPage.css'
import { useState } from 'react';
import {GoogleMap, useLoadScript} from '@react-google-maps/api'

import DestinationPicker from '../Components/DestinationPicker';
const PathFinderMainPage = () => {
    
    const showMap = false

    const mapContainerStyleParameter = {
        width:'100%',
        height: '100%'

    }
    const [choosingDestination, setchoosingDestination] = useState(false);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const handleWhereToButtonClick = () =>{
        setchoosingDestination(!choosingDestination)
    }
    const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY})
    




    return (  
        <div className="PathFinderMapPage">
            <div className="main-container">
                {showMap ? 
                    ( isLoaded ? (<GoogleMap zoom={10} center={{ lat: 40.7678, lng: -73.9645 }} mapContainerStyle={mapContainerStyleParameter}/>) 
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

            </div>
        </div> 
    );
}
 
export default PathFinderMainPage;