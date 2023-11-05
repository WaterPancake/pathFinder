import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
//import APIService from '../Components/APIService'


/*
function Counter() {
  // what does the intial useState(0) do? 0 is the inital values
  // so the function Counter, hich has a function setCounter>
  // internal data as count which is the state and is initialized as 0

  const [count, setCounter] = useState(0);
  //useStaet() returns a variable and a function to update the state value
  // so count is the variable and setCounter is the function

  const increment = () => {
    setCounter(count + 1);
  };

  const decrement = () => {
    setCounter(count - 1);
  };

  return (
    // display the word "count++" folloed by the data member count 
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Count++</button>
      <div> <button onClick={decrement}>Count--</button></div>
    </div>
    
  );
}

export default Counter;
*/




function App() {

  const [cordinate, setLocation] = useState({ lat: '40.728728', lng: '-73.982614' });

//  const [keywords, setKeywords] = useState({keywords: ['Dim sum']})

  const [POI, setPOI] = useState({name: "", lat: '', lng: '' , placeID: ''});


  const handleChange = (event) => {
    //name is a variable that tells the fnction which proerty they wish to motify
    // in this case, name is specificed in the input, name = {lat, lon}
    const { name, value } = event.target;
    setLocation({ ...cordinate, [name]: value });
  };



  const handleClick = async () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/POI",
      header: {"Content-Type": "application/json"},
      data: {
        "lat": cordinate.lat,
        "lng": cordinate.lng
    }
    })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }



/*
  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        lat: "40.728728",
        lng: "-73.982614" 
        })
    };
    fetch('', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));

// empty dependency array means this effect will only run once (like componentDidMount in classes)
}, []);
*/

  //calling the Flask App when pressing a button 
  //return as an array of arrays, 3 POIs

  return (
    <div>
      <input
        type="text"
        name="lat"
        placeholder="Latitude"
        value={cordinate.lat}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lng"
        placeholder="Longitude"
        value={cordinate.lng}
        onChange={handleChange}
      />

      <h2>Point of orign: ({cordinate.lat}, {cordinate.lng})</h2>

      <button onClick={() => handleClick()}>Find POI</button>
      <div> 
        <h4>Results:</h4>
          Name: {POI.name}, location: ({POI.lat},{POI.lng}).
         </div>
    </div>
  );
}


export default App;
/*
function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(()=> {

    // get data from some api, in this case, a data base
    fetch('https://jsonplaceholder.typicode.com/users')
    // put it into JSON format 
    .then((response) => response.json())
    // put the JSON formated data through the setUsers state objects function
    .then((data) => setUsers(data));
  }, []);

  return (
    // displaying?
    <u1>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </u1>
  );
}

export default UsersList;
*/

/*
function SearchResults({query}) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const responce = await fetch(
      '`https://jsonplaceholder.typicode.com/posts?title_like=${query}'
    )
  }
  )
}
*/
/*
export default function Button() {

  
  return (
    
    <button onClick={function handleChange() {
      alert('Stop!')
    }}>
      Button that tells you "Stop!"
    </button>
    
    //same as 
    <button onClick={() => {
      alert('Clicked')
    }}>
      Another one
    </button>

  );
}
*/

/*
//function that has a two properties "message" and "children"
// the function is a button, that has as the member children as its prompt
// when click alerts with the message property
function AlertButton({message, children}) {
  return (
    <button onClick={ () => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message={"Playing!"}>
        Play Movie
      </AlertButton>

      <AlertButton message={"Uploading"}>
        Upload Image
      </AlertButton>
    </div>
  );
}
*/

/*
// overwritting the base button component?
// tells react to pass the functon as an argument
function Button({onClick, children}) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({movieName}) {
  function handlePlayClick() {
    //issue with the $ 
    alert("Playing ${movieName}!");
  }

  //output the function Button 
  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  )
}

function UploadButton() {
  return (
    <Button onClick={() => alert("Uploaded!")}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  retu  rn (
    <div>
      <PlayButton movieName={"Taxi Driver"}/>
      <UploadButton/>
    </div>
  );
}
*/

// Naming evenhandler props
/*
function Button({onSmash, children}) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}
 
export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing')}> 
        Play Movie
      </Button>

      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
*/

/*
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = scultpureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{scultpure.name}</i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {scultpureList.length})
      </h3>
      <img 
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
*/