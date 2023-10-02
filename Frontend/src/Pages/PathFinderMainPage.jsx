import '../Styles/PathFinderMainPage.css'
import { useEffect, useRef, useState } from 'react';
import {GoogleMap, useJsApiLoader, MarkerF, Autocomplete, DirectionsRenderer} from '@react-google-maps/api'

const PathFinderMainPage = () => {
    const {isLoaded} = useJsApiLoader({id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries:['places']}) 
    

    

    
    const [showMap, setShowMap] = useState();
    const mapContainerStyleParameter = {
        width:'100%',
        height: '100%'

    }
    const [choosingDestination, setchoosingDestination] = useState(false);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [location, setLocation] = useState(null)
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    /** To store the autocomplete object int a variable */
    const [autoCompleteOrigin, setAutoCompleteOrigin] = useState(/**@type google.maps.places.Autocomplete */ (null));
    const [autoCompleteDestination, setAutoCompleteDestination] = useState(/**@type google.maps.places.Autocomplete */  (null));

    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false)

    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    /** @type React.MutableRefObject<HTMLInputElement> */
    const  originRef = useRef()

    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()

    const handleWhereToButtonClick = () =>{
        setchoosingDestination(!choosingDestination)
        
    }
    // const service = new google.maps.DirectionsService()
    // const handleMarkerClick = () =>{


    // }
    // const request = {
    //     origin: { lat: 40.712776, lng: -74.005974 },
    //     destination: { lat: 34.052235, lng: -118.243683 },
    //     travelMode: 'DRIVING'
    //   };
      const center = { lat: 40.7678, lng: -73.9645 };

      useEffect(()=>{
        if('geolocation' in navigator)
        {
            console.log("Geolocation is available")
            setIsGettingCurrentLocation(true)

            navigator.geolocation.getCurrentPosition((position)=>{
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                setLocation({lat:position.coords.latitude, lng: position.coords.longitude})
                setIsGettingCurrentLocation(false)
            },
            (error)=>{
                if(error.code === 1) {
                    console.log("Error: Access is denied!");
                 } else if( error.code === 2) {
                    console.log("Error: Position is unavailable!");
                 }
                 setIsGettingCurrentLocation(false)

            })
        }
        else{
            console.log("Error: Geolocation is not supported")
        }
    },[])
    const getLocation = () =>{
        if('geolocation' in navigator)
        {
            console.log("Geolocation is available")
            setIsGettingCurrentLocation(true)
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log("position is", ...position)
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                setLocation({lat:position.coords.latitude, lng: position.coords.longitude})
                
                setIsGettingCurrentLocation(false)
            },
            (error)=>{
                if(error.code === 1) {
                    console.log("Error: Access is denied!");
                 } else if( error.code === 2) {
                    console.log("Error: Position is unavailable!");
                 }
                 setIsGettingCurrentLocation(false)

            })
        }
        else{
            console.log("Error: Geolocation is not supported")
        }
    } 
    useEffect(()=>{
       if(location && map)
       {
        map.panTo(location)
       }

    },[location,map])
    // Function to fetch places along the route
const fetchPlacesAlongRoute = (routePath) => {
    const placesService = new window.google.maps.places.PlacesService(map); // Provide your map object
    const radiusMeters = 1609.34 * 10; // Convert miles to meters
  
    routePath.forEach((point) => {
      const request = {
        location: point,
        radius: radiusMeters,
        type: ['restaurant', 'gas_station', 'landmark'], // Specify the types of places you want
      };
  
      placesService.nearbySearch(request, (results, status) => {
        if (status === 'OK') {
          // Handle the list of places within the radius
          console.log('Places along the route:', results);
        } else {
          console.error('Places request failed:', status);
        }
      });
    });
  };
    
    
    const calculateRoute = async () => {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
          return;
        }
      
        const directionService = new window.google.maps.DirectionsService();
        const results = await directionService.route({
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          travelMode: 'DRIVING',
        });
      
        setDirectionResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
      
        // Call a function to fetch places within a radius
        fetchPlacesAlongRoute(results.routes[0].overview_path);
      };

    const clearRoute = () =>{
        setDirectionResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value('')
        destinationRef.current.value('')
    };




    return (  
        <div className="PathFinderMapPage">
            {/* <div className='getting-current-location' >Getting Current Location...</div> */}
            {isGettingCurrentLocation ? <div className='getting-current-location' >Getting Current Location...</div> : <></> }
            <button onClick={()=>(setShowMap(toggle => !toggle))}>Render Map</button>
            {isLoaded?<div className="path-finder">
                <div className="main-container">
                    {showMap ?
                        ( isLoaded ? (
                        <GoogleMap zoom={10} center={location || { lat: 0, lng: 0 }} mapContainerStyle={mapContainerStyleParameter} onLoad={(map)=>setMap(map)} onClick={(event)=>console.log(event.latLng.lat(),event.latLng.lng())}>
                            <MarkerF position={location || { lat: 0, lng: 0 }} />
                            {directionResponse && <DirectionsRenderer directions={directionResponse}/>}
                        </GoogleMap>)
                        : (<div className='map-is-loading'>Is Loading...</div>))
                    : null}
                </div>
                <div className="destination-calculator">
                    <div className="destination-calculator-header-buttons">
                        <label className='where-to-button' htmlFor="Where To?" onClick={e => handleWhereToButtonClick()}>Where To?</label>
                        <label className='login-button' htmlFor="login">Login</label>
                    </div>
                    {choosingDestination? (<div className="destination-picker">
                        <Autocomplete  onLoad={(autoComplete)=> {setAutoCompleteOrigin(autoComplete)}} onPlaceChanged={()=>setOrigin(autoCompleteOrigin.getPlace().name)}>
                            <input ref={originRef} type="text" name="" id="" placeholder='Choose a starting location...' onChange={e => setOrigin(e.target.value) }/>
                        </Autocomplete>
                        <Autocomplete onLoad={(autoComplete)=> setAutoCompleteDestination(autoComplete)} onPlaceChanged={()=>setDestination(autoCompleteDestination.getPlace().name)}>
                            <input ref={destinationRef} type="text" name="" id="" placeholder='Choose a destination...' onChange={e => setDestination(e.target.value)}/>
                        </Autocomplete>
                    </div>): <></>}
                    <div className="customize-trip">
                        {/* <label htmlFor="" className="customize-trip-button"> Customize</label> */}
                    </div>
                    <label htmlFor="">Duration: {duration} </label>
                    <label htmlFor="">Distance: {distance} </label>
                    <button onClick={()=> map.panTo(center)}>reset</button>
                    <button onClick={()=>{
                        console.log(origin, destination)
                    }}>console</button>
                    <button onClick={getLocation}>locaton</button>
                    
                    <button onClick={calculateRoute}>Calculate Route</button>
                    <button onClick={clearRoute}>Clear Route</button>
                </div>
            </div>: <></>}
        </div> 
    );
}
 
export default PathFinderMainPage;