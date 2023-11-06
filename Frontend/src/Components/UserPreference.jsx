import React, { useState } from 'react';
import '../Styles/UserPreference.css';
import ColorButton from '../Components/ColorButton';
import ItemDiv from '../Components/ItemDiv';
// import PriceBar from '../Components/PriceBar';

const UserPreference = ({setSelectedLocations}) => {
  const [visibleSections, setVisibleSections] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  // const [priceBarValue, setPriceBarValue] = useState(1);

  const toggleVisibility = (section) => {

    const updatedSections = { ...visibleSections };

    updatedSections[section] = !updatedSections[section];

    setVisibleSections(updatedSections);
  };

  const handleItemClick = (label) => {
    if (selectedItems.includes(label)) {
      // setSelectedItems([...selectedItems, label]);
      const updatedItems = selectedItems.filter((item) => item !== label);
      setSelectedItems(updatedItems);
      setSelectedLocations(updatedItems);


    } else {
    
      // setSelectedItems(selectedItems.filter((item) => item !== label));
      setSelectedItems([...selectedItems, label]);
      setSelectedLocations(selectedItems);
    }
  };

  // const handlePriceChange = (newValue) => {
  //   setPriceBarValue(newValue);
  //   console.log(newValue)
  // };

  const sendDataToBackend = () => {
    console.log(selectedItems)
    const dataToSend = {
      preference: selectedItems,
      // max_price: priceBarValue
    };
    
    fetch("/preference", {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching data", error));
  };

  return (
    <div className="UserPreference">
      {/* {selectedItems} */}
      <div className="filter">
      <ColorButton
        id="1"
        label="Other"
        target="Other"
        isVisible={visibleSections['Other']}
        toggleVisible={() => toggleVisibility('Other')}
      />
      <ColorButton
        id="2"
        label="Food"
        target="Food"
        isVisible={visibleSections['Food']}
        toggleVisible={() => toggleVisibility('Food')}
      />
      <ColorButton
        id="3"
        label="Activity"
        target="Activity"
        isVisible={visibleSections['Activity']}
        toggleVisible={() => toggleVisibility('Activity')}
      />
      <ColorButton
        id="4"
        label="Shelter"
        target="Shelter"
        isVisible={visibleSections['Shelter']}
        toggleVisible={() => toggleVisibility('Shelter')}
      />
      </div>

      {visibleSections['Other'] && (
        <div className="container">
          <div className="type">Other</div>
        </div>

      )}
      {visibleSections['Food'] && (
        <div className='container'>
          <div className="type">Dietary</div>
          <ItemDiv label="Cafe" buttonClick={() => handleItemClick("Cafe")} isSelected={selectedItems.includes("Cafe")} />
            <ItemDiv label="Bakery" buttonClick={() => handleItemClick("Bakery")} isSelected={selectedItems.includes("Bakery")} />
            <ItemDiv label="Convenience Store" buttonClick={() => handleItemClick("Convenience Store")} isSelected={selectedItems.includes("Convenience Store")} />
            <ItemDiv label= "Supermarket" buttonClick={() => handleItemClick("Supermarket")} isSelected={selectedItems.includes("Supermarket")} />
            <ItemDiv label= "Restaurant" buttonClick={() => handleItemClick("Restaurant")} isSelected={selectedItems.includes("Restaurant")} />
            <ItemDiv label= "Diner" buttonClick={() => handleItemClick("Diner")} isSelected={selectedItems.includes("Diner")} />
          </div>
      )}

      {visibleSections['Activity'] && (
        <div className="container">
          <div className="type">Activity</div>
            <ItemDiv label="Spa" onClick={() => handleItemClick("Spa")} isSelected={selectedItems.includes("Spa")} />
            <ItemDiv label="Zoo" onClick={() => handleItemClick("Zoo")} isSelected={selectedItems.includes("Zoo")} />
            <ItemDiv label="Park" onClick={() => handleItemClick("Park")} isSelected={selectedItems.includes("Park")} />
            <ItemDiv label= "Gym" onClick={() => handleItemClick("Gym")} isSelected={selectedItems.includes("Gym")} />
            <ItemDiv label= "Casino" onClick={() => handleItemClick("Casino")} isSelected={selectedItems.includes("Casino")} />
            <ItemDiv label= "Aquarium" onClick={() => handleItemClick("Aquarium")} isSelected={selectedItems.includes("Aquarium")} />
        </div>
      )}

      {visibleSections['Shelter'] && (
        <div className="container">
          <div className="type">Shelter</div>
        </div>
      )}

      {/* <PriceBar onValueChange={handlePriceChange} /> */}
      <button className="submit" onClick={sendDataToBackend}>Submit</button>
    </div>
  );
};

export default UserPreference;