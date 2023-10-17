import React, { useState } from 'react';
import '../Styles/UserPreference.css';
import ColorButton from '../Components/ColorButton';

const UserPreference = () => {
  const [visibleSection, setVisibleSection] = useState(null);

  const toggleVisibility = (section) => {
    if (visibleSection === section) {
      setVisibleSection(null);
    } else {
      setVisibleSection(section);
    }
  };

  return (
    <div className="UserPreference">
      <div className="filter">
        <ColorButton label="Other" target="Other" isVisible={visibleSection === 'Other'} toggleVisible={() => toggleVisibility('Other')} />
        <ColorButton label="Food" target="Food" isVisible={visibleSection === 'Food'} toggleVisible={() => toggleVisibility('Food')} />
        <ColorButton label="Activity" target="Activity" isVisible={visibleSection === 'Activity'} toggleVisible={() => toggleVisibility('Activity')} />
        <ColorButton label="Shelter" target="Shelter" isVisible={visibleSection === 'Shelter'} toggleVisible={() => toggleVisibility('Shelter')} />
      </div>
      {visibleSection === 'Other' && (
        <div className="container">
          <div className="type">Other</div>
        </div>

      )}
      {visibleSection === 'Food' && (
        <div className='container'>
          <div className="type">Dietary</div>
            <div className='item food'>Vegetarian</div>
            <div className='item food'>Kosher</div>
            <div className='item food'>Halal</div>
            <div className='item food'>Low-carb</div>
            <div className='item food'>Dairy</div>
            <div className='item food'>Pescado</div>
            <div className='item food'>Keto</div>
            <div className='item food'>Vegan</div>
          </div>
      )}
      {visibleSection === 'Food' && (
        <div className='container'>
          <div className="type">Crusine</div>
          <div className='item food'>American</div>
          <div className='item food'>Asian</div>
          <div className='item food'>Seafood</div>
          <div className='item food'>Ukrain</div>
          <div className='item food'>Italian</div>
          <div className='item food'>Thai</div>
          <div className='item food'>Japanese</div>
        </div>
      )}

      {visibleSection === 'Activity' && (
        <div className="container">
          <div className="type">Activity</div>
        </div>
      )}
      {visibleSection === 'Shelter' && (
        <div className="container">
          <div className="type">Shelter</div>
        </div>
      )}
    </div>
  );
};

// const UserPreference = () => {

//   const [visibleDietary, setVisibleDietary] = useState(false);

//   const toggleDietary = () => {
//     setVisibleDietary(!visibleDietary);
//   };
  
//   return ( 
//     <div className="UserPreference">
//                 <div className="filter">
//                   <ColorButton label="Other" onClick={toggleDietary} />
//                   <ColorButton label="Food" onClick={toggleDietary} />
//                   <ColorButton label="Activity" onClick={toggleDietary} />
//                   <ColorButton label="Shelter" onClick={toggleDietary} />
//                 </div>
//                 {visibleDietary && (
//                   <div className='container'>
//                     <div className="type">Dietary</div>
//                     <div className='item food'>Vegetarian</div>
//                     <div className='item food'>Kosher</div>
//                     <div className='item food'>Halal</div>
//                     <div className='item food'>Low-carb</div>
//                     <div className='item food'>Dairy</div>
//                     <div className='item food'>Pescado</div>
//                     <div className='item food'>Keto</div>
//                     <div className='item food'>Vegan</div>
//                   </div>
//                 )}
//                 <div className='container'>
//                   <div className="type">Crusine</div>
//                     <div className='item food'>American</div>
//                     <div className='item food'>Asian</div>
//                     <div className='item food'>Seafood</div>
//                     <div className='item food'>Ukrain</div>
//                     <div className='item food'>Italian</div>
//                     <div className='item food'>Thai</div>
//                     <div className='item food'>Japanese</div>
//                 </div>
//                 <div>
//                     <div className='container'>Price</div>
//                     <input type='range' id="price" name="price" min="1" max="10000"></input>
//                     <input type="button" id="max" value="Set Max" onclick="msg()"></input>
//                 </div>
//               </div>

//     );
// }

export default UserPreference;