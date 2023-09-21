import '../Styles/PathFinderMainPage.css'
import { useState } from 'react';
import DestinationPicker from '../Components/DestinationPicker';
const PathFinderMainPage = () => {
    const [choosingDestination, setchoosingDestination] = useState(false);
    const handleWhereToButtonClick = () =>{
        setchoosingDestination(!choosingDestination)
    }

    return (  
        <div className="PathFinderMapPage">
            <div className="main-container">

            </div>
            <div className="destination-calculator">
                <div className="destination-calculator-header-buttons">
                    <label className='where-to-button' htmlFor="Where To?" onClick={e => handleWhereToButtonClick()}>Where To?</label>
                    <label className='login-button' htmlFor="login">Login</label>
                </div>
                {choosingDestination ? <DestinationPicker/> : <></>}

            </div>
        </div> 
    );
}
 
export default PathFinderMainPage;