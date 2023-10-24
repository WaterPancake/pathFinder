import React, { useEffect, useRef, useState } from 'react';
import {useJsApiLoader,Autocomplete } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

import '../Styles/PathFinderMainPage.css';
import '../Styles/UserPreference.css';

const PathFinderMainPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [showMap, setShowMap] = useState(false);

  const [choosingDestination, setChoosingDestination] = useState(false);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [directionService, setDirectionService] = useState(/** @type google.maps.DirectionsService */ (null));
  const [directionRenderer, setDirectionRenderer] = useState(/** @type google.maps.DirectionsRenderer */(null));
  const [directionsArray, setDirectionsArray] = useState([]);
  const [routeNodes, setRouteNodes] = useState([])
  const [pickRoute, setPickRoute] = useState(0)
  

  const mapDivRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()


  const handleWhereToButtonClick = () => {
    setChoosingDestination(!choosingDestination);
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

  

  // Function to fetch places along the route
  // const fetchPlacesAlongRoute = (routePath) => {
  //   const placesService = new window.google.maps.places.PlacesService(map);
  //   const radiusMeters = 1609.34 * 10; // 10 miles in meters

  //   routePath.forEach((point) => {
  //     const request = {
  //       location: point,
  //       radius: radiusMeters,
  //       type: ['restaurant', 'gas_station', 'landmark'], // Specify the types of places you want
  //     };

  //     placesService.nearbySearch(request, (results, status) => {
  //       if (status === 'OK') {
  //         console.log('Places along the route:', results);
  //       } else {
  //         console.error('Places request failed:', status);
  //       }
  //     });
  //   });
  // };
 

  // const createAlbanyRoute = async () => {
  //   const directionServiceTest = new window.google.maps.DirectionsService();
  //   const albanyRoute = {
  //     origin: { lat: 40.7678, lng: -73.9654 },
  //     destination: { lat: 42.6526, lng: -73.7562 },
  //     travelMode: 'DRIVING',
  //   };
  //   const testResult = await directionServiceTest.route(albanyRoute);
  //   setAlbanyTestRoute(testResult);
  
  //   // Calculate the marker interval (every 5th of the route)
  //   const routePath = testResult.routes[0].overview_path;
  //   const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath);
  //   const markerIntervalMeters = totalDistance / 5;
  
  //   let remainingDistance = markerIntervalMeters;
  //   let markerCount = 0;
  
  //   for (let i = 0; i < routePath.length - 1; i++) {
  //     const startPoint = routePath[i];
  //     const endPoint = routePath[i + 1];
  //     const segmentDistance = window.google.maps.geometry.spherical.computeDistanceBetween(startPoint, endPoint);
  
  //     if (segmentDistance < remainingDistance) {
  //       remainingDistance -= segmentDistance;
  //     } else {
  //       // Calculate the position of the marker along the current segment
  //       const fraction = remainingDistance / segmentDistance;
  //       const markerPosition = new window.google.maps.LatLng(
  //         startPoint.lat() + fraction * (endPoint.lat() - startPoint.lat()),
  //         startPoint.lng() + fraction * (endPoint.lng() - startPoint.lng())
  //       );
  
  //       // Place a marker at the markerPosition
  //       new window.google.maps.Marker({
  //         position: markerPosition,
  //         map: map,
  //         title: 'Marker',
  //       });
  //       const geoPoint = {lng:markerPosition.lng(), lat:markerPosition.lat()}
  //       setTestWaypoints(prev => prev.concat(geoPoint))
  
  //       console.log(`Marker ${markerCount + 1} - Position: lat: ${markerPosition.lat()}, lng: ${markerPosition.lng()}`);
  //       markerCount++;
  
  //       // Move to the next marker interval
  //       remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
  //     }
  //   }
  // };
 
  
  // Calculate and display the route between origin and destination
  // const calculateRoute = async () => {
  //   if (originRef.current.value === '' || destinationRef.current.value === '') {
  //     return;
  //   }

  //   const directionService = new window.google.maps.DirectionsService();
  //   const results = await directionService.route({
  //     origin: originRef.current.value,
  //     destination: destinationRef.current.value,
  //     travelMode: 'DRIVING',
  //   });

  //   setDirectionResponse(results);
  //   setDistance(results.routes[0].legs[0].distance.text);
  //   setDuration(results.routes[0].legs[0].duration.text);

  //   // Call a function to fetch places within a radius along the route
  //   fetchPlacesAlongRoute(results.routes[0].overview_path);
  // };

  
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
    // console.log(`map is ${map}`)
    console.log("called")
     
    

  }
  
},[isLoaded,showMap,location])

// Calculate and display the route between origin and destination
const newCalculateRoute = () =>{
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
      fetchNodesAlongRoute(result
        )
      console.log(directionsArray)

    };

  }) 

};
  // Clear the route and related information
  const newClearRoute = () =>{
    originRef.current.value = '';
    destinationRef.current.value = '';
    setDistance('')
    setDuration(null)
    directionRenderer.setMap(null)
    setDirectionsArray([])
    setRouteNodes([])

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
      console.log(directionsArray)

    };

  }) 
}
const toggleRoutes = ()=>{
 if(directionsArray.length>1){ 
    directionRenderer.setDirections(directionsArray[pickRoute]);
    // console.log(pickRoute,directionsArray.length)
    setPickRoute((index)=> ((index +1)%directionsArray.length))
  }
}
const fetchNodesAlongRoute = (directionRouteResult) =>{

    // Calculate the marker interval (every 5th of the route)
    const routePath = directionRouteResult.routes[0].overview_path;
    const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath);
    const markerIntervalMeters = totalDistance / 5;
  
    let remainingDistance = markerIntervalMeters;
    let markerCount = 1;
  
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
        new window.google.maps.Marker({
          position: markerPosition,
          map: map,
          title: 'Marker',
        });
        // const geoPoint = {lng:markerPosition.lng(), lat:markerPosition.lat()}
        // setTestWaypoints(prev => prev.concat(geoPoint))
        setRouteNodes((nodeArray)=> [...nodeArray,{key: markerCount,lat:markerPosition.lat(), lng:markerPosition.lng()}])
        console.log(`Marker ${markerCount } - Position: lat: ${markerPosition.lat()}, lng: ${markerPosition.lng()}`);
        markerCount++;
  
        // Move to the next marker interval
        remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
      }
    }
}
  return (
    <div className="PathFinderMapPage">
      {isGettingCurrentLocation ? <div className="getting-current-location">Getting Current Location...</div> : null}
      {/* <button onClick={() => setShowMap((toggle) => !toggle)}>Render Map</button> */}
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
            {choosingDestination ? ( <div className="DestinationPicker">
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
                <button onClick={() => console.log(isLoaded, showMap)}>console</button>
                {/* <button onClick={getLocation}>location</button> */}
                <button onClick={()=>newCalculateRoute()}>Calculate Route</button>
                <button onClick={()=> newClearRoute()}>Clear Route</button>
                <button onClick={()=> addWaypoint()}>Add Waypoint Route</button>
                <button onClick={()=>toggleRoutes()}>toggle routes</button>
                                {routeNodes.map((object) => (
                  <label key={object.id}>Lat: {object.lat}, Lng: {object.lng}</label>
                ))}
                {/* <button onClick={createAlbanyRoute}>Creare Albany Route</button> */}
            </div>
        </div>
      ) : null}
    </div>
  );
};

export default PathFinderMainPage;
 