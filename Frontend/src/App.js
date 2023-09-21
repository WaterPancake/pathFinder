import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Remove the extra space here
import './App.css';
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import PathFinderMainPage from './Pages/PathFinderMainPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path = '/user/login' element={<LoginPage/>}/>
          <Route exact path = '/user/signup' element={<SignupPage/>}/>
          <Route exact path = '/pathfinder' element={<PathFinderMainPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
