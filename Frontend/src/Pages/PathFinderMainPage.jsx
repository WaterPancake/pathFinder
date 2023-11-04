import React, { useEffect, useRef, useState } from 'react';
import {useJsApiLoader,Autocomplete } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

import '../Styles/PathFinderMainPage.css';
import UserPreference from '../Components/UserPreference';

import '../Styles/UserPreference.css';

const PathFinderMainPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
/**Boolean for deciding if you want the map to Render
 * TO BE REMOVED IN FINAL PRODUCT
 */
  const [showMap, setShowMap] = useState(false);
/**Booleand for deciding if you want to show the origin and destination picker */
  const [showDestinationPicker, setShoeDestinationPicker] = useState(false);
  /**Holds the geolocation(latitiude and longiutude), for the user current location, if it can be found */
  const [location, setLocation] = useState(null);
  /**Holds the google maps object of type window.google.maps.Maps */
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
/**Boolean fo showing if the users current location is being located */
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
/**Holds the value for the distance of the route */
  const [distance, setDistance] = useState('');
  /**Holds the value for the duration in minutes fior a route */
  const [duration, setDuration] = useState('');
/**Google Maps API. Holds the object that will be calculating a route based on origin and destination
 * of @type google.maps.DirectionService
 */
  const [directionService, setDirectionService] = useState(/** @type google.maps.DirectionsService */ (null));
  /**Google Maps API. Holds the object that will be used to render the original route to the map. 
   * of @type window.google.maps.DirectionRenderer
   */
  const [directionRenderer, setDirectionRenderer] = useState(/** @type google.maps.DirectionsRenderer */(null));

  // const [directionRenderForCalculatedRoutes, setDirectionRenderForCalculatedRoutes] = useState(/** @type {Array<google.maps.DirectionsRenderer>}  */[]);

  const [directionsArray, setDirectionsArray] = useState([]);
  const [nodesAlongRoute, setNodesAlongRoute] = useState([]);
  const [pickRoute, setPickRoute] = useState(0);

  /**Holds the lng lat object array for each route */
  const [calculatedRouteWaypoints, setCalculatedRouteWaypoints] = useState([]);

  /**Routes generated from the way points calculated fro the ML api */
  const [generatedRoutes, setGeneratedRoutes] = useState([])
  
/**Is a reference to the div that will be containting the map */
  const mapDivRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()


  const handleWhereToButtonClick = () => {
    setShoeDestinationPicker(!showDestinationPicker);
  };

  const center = { lat: 40.7678, lng: -73.9645 };

  // Use geolocation API to get the user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsGettingCurrentLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          console.log(`Location is lat: ${position.coords.latitude} lng:${position.coords.longitude} `)
          setIsGettingCurrentLocation(false);
        },
        (error) => {
          setIsGettingCurrentLocation(false);
        }
      );
    } else {
      console.log('Error: Geolocation is not supported');
    }
    
    
  }, []);
  
useEffect(()=>{
  
  if(isLoaded && showMap)
  {
    const mapOptions = {
        zoom:14,
        center:location ||{ lat: 40.748817, lng: -73.9857 }
    }
    const newMap = new window.google.maps.Map(mapDivRef.current, mapOptions)
    setMap(newMap)

    setDirectionService(new window.google.maps.DirectionsService());
    setDirectionRenderer(new window.google.maps.DirectionsRenderer());
  
     
    

  }
  
},[isLoaded,showMap,location])

// Calculate and display the route between origin and destination
const newCalculateRoute = () =>{
  setDistance(null)
  setDuration(null)
  directionRenderer.setMap(null)
  setDirectionsArray([])
  setNodesAlongRoute([])
  if(!originRef.current.value || !destinationRef.current.value){
    alert('Both fields must be filled');
  };
  const origin = originRef.current.value;
  const destination = destinationRef.current.value;
  const request = {
    origin,
    destination,
    travelMode: 'DRIVING'
  };
  directionService.route(request,(result, status)=>{
    if(status === 'OK'){
      directionRenderer.setMap(map)
      directionRenderer.setDirections(result)
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
      setDirectionsArray([result])
      fetchNodesAlongRoute(result)
      // console.log(directionsArray)

    };

  }) 

};
  // Clear the route and related information
const newClearRoute = () =>{
  originRef.current.value = '';
  destinationRef.current.value = '';
  setDistance(null);
  setDuration(null);
  directionRenderer.setMap(null);
  setDirectionsArray([]);
  setNodesAlongRoute([]);
  setGeneratedRoutes([]);

};

const addWaypoint = () =>{
  const wayPoint = {location:{lat:40.7484, lng:-73.985428}, stopover:true}
  if(!originRef.current.value || !destinationRef.current.value){
    alert('Both fields must be filled');
  };
  const origin = originRef.current.value;
  const destination = destinationRef.current.value;
  const request = {
    origin,
    destination,
    travelMode: 'DRIVING',
    waypoints: [wayPoint]
  };
  directionService.route(request,(result, status)=>{
    if(status === 'OK'){
      directionRenderer.setMap(map)
      directionRenderer.setDirections(result)
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
      setDirectionsArray((array)=>[...array,result])
      setGeneratedRoutes((array)=>[...array,directionsArray[0],result])
      setCalculatedRouteWaypoints([])
      console.log(directionsArray)

    };

  }) 
}
const toggleRoutes = ()=>{
 if(directionsArray.length>1){ 
    directionRenderer.setDirections(directionsArray[pickRoute]);
    // console.log(pickRoute,directionsArray.length)
    setPickRoute((index)=> ((index +1)%directionsArray.length));
  }
}
const fetchNodesAlongRoute = (directionRouteResult) =>{

    // Calculate the marker interval (every 5th of the route)
    const routePath = directionRouteResult.routes[0].overview_path;
    const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath);
    const markerIntervalMeters = totalDistance / 4;
  
    let remainingDistance = markerIntervalMeters;
    let markerCount = 0;
  
    for (let i = 0; i < routePath.length - 1; i++) {
      const startPoint = routePath[i];
      const endPoint = routePath[i + 1];
      const segmentDistance = window.google.maps.geometry.spherical.computeDistanceBetween(startPoint, endPoint);
  
      if (segmentDistance < remainingDistance) {
        remainingDistance -= segmentDistance;
      } else {
        // Calculate the position of the marker along the current segment
        const fraction = remainingDistance / segmentDistance;
        const markerPosition = new window.google.maps.LatLng(
          startPoint.lat() + fraction * (endPoint.lat() - startPoint.lat()),
          startPoint.lng() + fraction * (endPoint.lng() - startPoint.lng())
        );
  
        // Place a marker at the markerPosition
        // new window.google.maps.Marker({
        //   position: markerPosition,
        //   map: map,
        //   title: 'Marker',
        // });
        
        // const geoPoint = {lng:markerPosition.lng(), lat:markerPosition.lat()}
        // setTestWaypoints(prev => prev.concat(geoPoint))
        const waypoint = {key: markerCount,lat:markerPosition.lat(), lng:markerPosition.lng()};
        setNodesAlongRoute((nodeArray)=> [...nodeArray,waypoint]);
        // console.log(`Marker ${markerCount+ 1 } - Position: lat: ${markerPosition.lat()}, lng: ${markerPosition.lng()}`);
        markerCount++;
  
        // Move to the next marker interval
        remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
      }
    }
    setNodesAlongRoute((nodeArray)=>nodeArray.slice(0,-1))
};
const generateRoutesForUser = async()=>{
    setCalculatedRouteWaypoints([])
    //URL to be changbed
    const results = await fetch('http://localhost:8000/pathFinder/generate-routes',{
      method: 'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(nodesAlongRoute)
    });

    /**This Calculates a route for each set of waypoints from the api */
    //Get the origin coordinates
    const origin = originRef.current.value;
    //get the destination coordinates
    const destination = destinationRef.current.value;
    //results.routeWayPoints is subject to change
    setCalculatedRouteWaypoints(results.routeWayPoints);
    //For each array of waypoints
    results.routeWaypoints.forEach((route)=>{
      let stopoverWaypoints = []
      //creates a waypoint object and saves it to an array 
      route.forEach((waypoint)=>{
          stopoverWaypoints.push({location:waypoint, stopover:true});
      })
      //create the DirectionService request object
      const request = {
        origin,
        destination,
        travelMode: 'DRIVING',
        waypoint:stopoverWaypoints,
        optimizeWaypoints: true
      };
      //Uses the directionService.route to generate a route and saves it to generated route
      directionService.route(request, (result,status) =>{
        if(status === 'OK')
        {
          setGeneratedRoutes((prev)=>[...prev,result]);

        }
      })
    })
};
const selectRoute = (routeIndex)=>{
  console.log(calculatedRouteWaypoints);
  directionRenderer.setDirections(generatedRoutes[routeIndex]);
  setDistance(generatedRoutes[routeIndex].routes[0].legs[0].distance.text);
  setDuration(generatedRoutes[routeIndex].routes[0].legs[0].duration.text);

}
    return (
    <div className="PathFinderMapPage">
      {isGettingCurrentLocation ? <div className="getting-current-location">Getting Current Location...</div> : null}
      <button onClick={() => setShowMap(!showMap)}>Render Map</button>
      {isLoaded ? ( 
        <div className="path-finder">
          <div className="main-container" ref={mapDivRef}></div>

          <div className="destination-calculator">
            <div className="destination-calculator-header-buttons">
              <label className="where-to-button" htmlFor="Where To?" onClick={handleWhereToButtonClick}>
                Where To?
              </label>
              <label className="login-button" htmlFor="login">
                <Link to="/user/login">Login</Link>
              </label>
            </div>
            {showDestinationPicker ? ( <div className="DestinationPicker">
                <Autocomplete>
                    <input ref={originRef} type="text" name="" id="" placeholder="Choose a starting location..."  />
                </Autocomplete>
                <Autocomplete>
                    <input ref={destinationRef} type="text" name="" id="" placeholder="Choose a destination..."  />
                </Autocomplete>
            </div>): null}
            <div className="customize-trip"></div>
                <label htmlFor="">Duration: {duration} </label>
                <label htmlFor="">Distance: {distance} </label>
                <button onClick={() => map.panTo(center)}>reset</button>
                <button onClick={() => console.log(originRef.current.value, destinationRef.current.value)}>console</button>
                {/* <button onClick={getLocation}>location</button> */}
                <button onClick={()=>newCalculateRoute()}>Calculate Route</button>
                <button>Try Again</button>
                <button onClick={()=> newClearRoute()}>Clear Route</button>
                <button onClick={()=> addWaypoint()}>Add Waypoint Route</button>
                <button onClick={()=> generateRoutesForUser()}>Find Routes</button>
                <button onClick={()=>toggleRoutes()}>toggle routes</button>
                                {nodesAlongRoute.map((object) => (
                  <label key={object.id}>Lat: {object.lat}, Lng: {object.lng}</label>
                ))}
                {/* <button onClick={createAlbanyRoute}>Creare Albany Route</button> */}
                {generatedRoutes.length>0 && <div className="display-generated-routes">
              {generatedRoutes.map((route,index) =>{
                return(<div key={index} className="route-details">
                  <button className='select-route-button' onClick={()=>selectRoute(index)}>{`route ${index+1}`}</button>
                </div>)
              })}
            </div>}
                <UserPreference/>
            </div>
            
        </div>
      ) : null}
    </div>
  );
};

export default PathFinderMainPage;
 
