import React, { useState } from 'react';
import '../Styles/UserPreference.css';
import ColorButton from '../Components/ColorButton';
import ItemDiv from '../Components/ItemDiv';
import PriceBar from '../Components/PriceBar';

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
            <ItemDiv label="Cafe" />
            <ItemDiv label="Bakery" />
            <ItemDiv label="Convenience Store" />
            <ItemDiv label= "Supermarket"/>
            <ItemDiv label= "Restaurant"/>
            <ItemDiv label= "Take-out"/>
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

      <PriceBar/>
    </div>
  );
};

export default UserPreference;