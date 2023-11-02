import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
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
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [directionService, setDirectionService] = useState(null);
  const [directionRenderer, setDirectionRenderer] = useState(null);
  const [directionsArray, setDirectionsArray] = useState([]);
  const [nodesAlongRoute, setNodesAlongRoute] = useState([]);
  const [pickRoute, setPickRoute] = useState(0);
  const [calculatedRouteWaypoints, setCalculatedRouteWaypoints] = useState([]);
  const [generatedRoutes, setGeneratedRoutes] = useState([]);

  const mapDivRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef();

  const handleWhereToButtonClick = () => {
    setShowDestinationPicker(!showDestinationPicker);
  };

  const center = { lat: 40.7678, lng: -73.9645 };

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsGettingCurrentLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          console.log(`Location is lat: ${position.coords.latitude} lng:${position.coords.longitude}`);
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

  useEffect(() => {
    if (isLoaded && showMap) {
      const mapOptions = {
        zoom: 14,
        center: location || { lat: 40.748817, lng: -73.9857 },
      };
      const newMap = new window.google.maps.Map(mapDivRef.current, mapOptions);
      setMap(newMap);
      setDirectionService(new window.google.maps.DirectionsService());
      setDirectionRenderer(new window.google.maps.DirectionsRenderer());
    }
  }, [isLoaded, showMap, location]);

  const newCalculateRoute = () => {
    setDistance(null);
    setDuration(null);
    directionRenderer.setMap(null);
    setDirectionsArray([]);
    setNodesAlongRoute([]);
    if (!originRef.current.value || !destinationRef.current.value) {
      alert('Both fields must be filled');
    }
    const origin = originRef.current.value;
    const destination = destinationRef.current.value;
    const request = {
      origin,
      destination,
      travelMode: 'DRIVING',
    };
    directionService.route(request, (result, status) => {
      if (status === 'OK') {
        directionRenderer.setMap(map);
        directionRenderer.setDirections(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setDuration(result.routes[0].legs[0].duration.text);
        setDirectionsArray([result]);
        fetchNodesAlongRoute(result);
      }
    });
  };

  const newClearRoute = () => {
    originRef.current.value = '';
    destinationRef.current.value = '';
    setDistance(null);
    setDuration(null);
    directionRenderer.setMap(null);
    setDirectionsArray([]);
    setNodesAlongRoute([]);
  };

  const addWaypoint = () => {
    const wayPoint = { location: { lat: 40.7484, lng: -73.985428 }, stopover: true };
    if (!originRef.current.value || !destinationRef.current.value) {
      alert('Both fields must be filled');
    }
    const origin = originRef.current.value;
    const destination = destinationRef.current.value;
    const request = {
      origin,
      destination,
      travelMode: 'DRIVING',
      waypoints: [wayPoint],
    };
    directionService.route(request, (result, status) => {
      if (status === 'OK') {
        directionRenderer.setMap(map);
        directionRenderer.setDirections(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setDuration(result.routes[0].legs[0].duration.text);
        setDirectionsArray((array) => [...array, result]);
        setGeneratedRoutes((array) => [...array, directionsArray[0], result]);
        setCalculatedRouteWaypoints([]);
      }
    });
  };

  const toggleRoutes = () => {
    if (directionsArray.length > 1) {
      directionRenderer.setDirections(directionsArray[pickRoute]);
      setPickRoute((index) => ((index + 1) % directionsArray.length));
    }
  };

  const fetchNodesAlongRoute = (directionRouteResult) => {
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
        const fraction = remainingDistance / segmentDistance;
        const markerPosition = new window.google.maps.LatLng(
          startPoint.lat() + fraction * (endPoint.lat() - startPoint.lat()),
          startPoint.lng() + fraction * (endPoint.lng() - startPoint.lng())
        );

        new window.google.maps.Marker({
          position: markerPosition,
          map: map,
          title: 'Marker',
        });

        const waypoint = { key: markerCount, lat: markerPosition.lat(), lng: markerPosition.lng() };
        setNodesAlongRoute((nodeArray) => [...nodeArray, waypoint]);
        markerCount++;
        remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
      }
    }
    setNodesAlongRoute((nodeArray) => nodeArray.slice(0, -1));
  };

  const generateRoutesForUser = async () => {
    setCalculatedRouteWaypoints([]);
    const results = await fetch('http://localhost:8000/pathFinder/generate-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodesAlongRoute),
    });

    setCalculatedRouteWaypoints(results.routeWayPoints);

    results.routeWaypoints.forEach((route) => {
      let stopoverWaypoints = [];
      route.forEach((waypoint) => {
        stopoverWaypoints.push({ location: waypoint, stopover: true });
      });
      const request = {
        origin,
        destination,
        travelMode: 'DRIVING',
        waypoints: stopoverWaypoints,
        optimizeWaypoints: true,
      };
      directionService.route(request, (result, status) => {
        if (status === 'OK') {
          setGeneratedRoutes((prev) => [...prev, result]);
        }
      });
    });
  };

  const selectRoute = (routeIndex) => {
    directionRenderer.setDirections(generatedRoutes[routeIndex]);
    setDistance(generatedRoutes[routeIndex].routes[0].legs[0].distance.text);
    setDuration(generatedRoutes[routeIndex].routes[0].legs[0].duration.text);
  };

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
            {showDestinationPicker ? (
              <div className="DestinationPicker">
                <Autocomplete>
                  <input ref={originRef} type="text" name="" id="" placeholder="Choose a starting location..." />
                </Autocomplete>
                <Autocomplete>
                  <input ref={destinationRef} type="text" name="" id="" placeholder="Choose a destination..." />
                </Autocomplete>
              </div>
            ) : null}
            <div className="customize-trip"></div>
            <label htmlFor="">Duration: {duration} </label>
            <label htmlFor="">Distance: {distance} </label>
            <button onClick={() => map.panTo(center)}>reset</button>
            <button onClick={() => console.log(originRef.current.value, destinationRef.current.value)}>console</button>
            <button onClick={() => newCalculateRoute()}>Calculate Route</button>
            <button onClick={() => newClearRoute()}>Clear Route</button>
            <button onClick={() => addWaypoint()}>Add Waypoint Route</button>
            <button onClick={() => generateRoutesForUser()}>Find Routes</button>
            <button onClick={() => toggleRoutes()}>Toggle Routes</button>
            {nodesAlongRoute.map((object) => (
              <label key={object.id}>Lat: {object.lat}, Lng: {object.lng}</label>
            ))}
          </div>
          {generatedRoutes.length > 0 && (
            <div className="display-generated-routes">
              {generatedRoutes.map((route, index) => {
                return (
                  <div key={index} className="route-details">
                    <button className="select-route-button" onClick={() => selectRoute(index)}>{`Route ${index + 1}`}</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PathFinderMainPage;
