import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import UserPreference from '../Components/UserPreference';
import '../Styles/PathFinderMainPage.css';

const PathFinderMainPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [showMap, setShowMap] = useState(false);
  const mapContainerStyleParameter = {
    width: '100%',
    height: '100%', 
  };
const [selectedRouteColor, setSelectedRouteColor] = useState(null);

  const [choosingDestination, setChoosingDestination] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [autoCompleteOrigin, setAutoCompleteOrigin] = useState(null);
  const [autoCompleteDestination, setAutoCompleteDestination] = useState(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [albanyTestRoute, setAlbanyTestRoute] = useState(null)
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [testWaypoints, setTestWaypoints] = useState([]) 

  const originRef = useRef(null);
  const destinationRef = useRef(null);

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
  const fetchPlacesAlongRoute = (routePath) => {
    const placesService = new window.google.maps.places.PlacesService(map);
    const radiusMeters = 1609.34 * 10; // 10 miles in meters

    routePath.forEach((point) => {
      const request = {
        location: point,
        radius: radiusMeters,
        type: ['restaurant', 'gas_station', 'landmark'], // Specify the types of places you want
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === 'OK') {
          console.log('Places along the route:', results);
        } else {
          console.error('Places request failed:', status);
        }
      });
    });
  };
 

  const createAlbanyRoute = async () => {
    const directionServiceTest = new window.google.maps.DirectionsService();
    const albanyRoute = {
      origin: { lat: 40.7678, lng: -73.9654 },
      destination: { lat: 42.6526, lng: -73.7562 },
      travelMode: 'DRIVING',
    };
    const testResult = await directionServiceTest.route(albanyRoute);
    setAlbanyTestRoute(testResult);
  
    // Calculate the marker interval (every 5th of the route)
    const routePath = testResult.routes[0].overview_path;
    const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath);
    const markerIntervalMeters = totalDistance / 5;
  
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
        new window.google.maps.Marker({
          position: markerPosition,
          map: map,
          title: 'Marker',
        });
        const geoPoint = {lng:markerPosition.lng(), last:markerPosition.lat()}
        setTestWaypoints(prev => prev.concat(geoPoint))
  
        console.log(`Marker ${markerCount + 1} - Position: lat: ${markerPosition.lat()}, lng: ${markerPosition.lng()}`);
        markerCount++;
  
        // Move to the next marker interval
        remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
      }
    }
  };
  useEffect(()=>{
    testWaypoints.forEach((object)=>{
      console.log(JSON.stringify(object))
    })
  },[testWaypoints])
  
  // Calculate and display the route between origin and destination
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

    // Call a function to fetch places within a radius along the route
    fetchPlacesAlongRoute(results.routes[0].overview_path);
  };

  // Clear the route and related information
  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  };
//   const handleOriginPicker = (e) =>{

//   }
const handleClickRoute = () =>{
  setSelectedRouteColor('#e60986');
  console.log(selectedRouteColor)
  console.log("Clicked Here");
}
useEffect(()=>{

},[selectedRouteColor])


  return (
    <div className="PathFinderMapPage">
      {isGettingCurrentLocation ? <div className="getting-current-location">Getting Current Location...</div> : null}
      <button onClick={() => setShowMap((toggle) => !toggle)}>Render Map</button>
      {isLoaded ? (
        <div className="path-finder">
          <div className="main-container">
            {showMap ? (
              isLoaded ? (
                <GoogleMap
                  zoom={10}
                  center={location || { lat: 0, lng: 0 }}
                  mapContainerStyle={mapContainerStyleParameter}
                  onLoad={(map) => setMap(map)}
                  onClick={(event) => console.log(event.latLng.lat(), event.latLng.lng())}
                >
                  <MarkerF position={location || { lat: 0, lng: 0 }} />
                  {directionResponse && (
                    <DirectionsRenderer
                      directions={directionResponse}
                      options={{ polylineOptions: { strokeColor:"#000000" } }}
                    />
                  )}                  
                  {albanyTestRoute && <DirectionsRenderer directions={albanyTestRoute} />}
                </GoogleMap>
              ) : (
                <div className="map-is-loading">Is Loading...</div>
              )
            ) : null}
          </div>

          <div className="destination-calculator">
            <div className="destination-calculator-header-buttons">
              <label className="where-to-button" htmlFor="Where To?" onClick={handleWhereToButtonClick}>
                Where To?
              </label>
              <label className="login-button" htmlFor="login">
                Login
              </label>
            </div>
            {choosingDestination ? ( <div className="DestinationPicker">
                <Autocomplete onLoad={(autoComplete) => setAutoCompleteOrigin(autoComplete)} onPlaceChanged={() => setOrigin(autoCompleteOrigin.getPlace().name)}>
                    <input ref={originRef} type="text" name="" id="" placeholder="Choose a starting location..."  />
                </Autocomplete>
                <Autocomplete onLoad={(autoComplete) => setAutoCompleteDestination(autoComplete)} onPlaceChanged={() => setDestination(autoCompleteDestination.getPlace().name)}>
                    <input ref={destinationRef} type="text" name="" id="" placeholder="Choose a destination..."  />
                </Autocomplete>
            </div>): null}
            <div className="customize-trip"></div>
                <label htmlFor="">Duration: {duration} </label>
                <label htmlFor="">Distance: {distance} </label>
                <button onClick={() => map.panTo(center)}>reset</button>
                <button onClick={() => console.log(origin, destination)}>console</button>
                {/* <button onClick={getLocation}>location</button> */}
                <button onClick={calculateRoute}>Calculate Route</button>
                <button onClick={clearRoute}>Clear Route</button>
                <button onClick={createAlbanyRoute}>Creare Albany Route</button>
            <UserPreference/>
        </div>
        </div>
      ) : null}
    </div>
  );
};

export default PathFinderMainPage;
