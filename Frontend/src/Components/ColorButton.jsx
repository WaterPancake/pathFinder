import { useState } from 'react';
import '../Styles/UserPreference.css';

const ColorButton = ({ label, target, isVisible, toggleVisible }) => {

    const [isClicked, setIsClicked] = useState(false);
  
    const handleClick = () => {
      setIsClicked(!isClicked);
      toggleVisible(target, !isVisible);
    };
  
    const buttonClasses = `choice ${isClicked ? 'clicked' : ''}`;
  
    return (
      <div>
        <button className={buttonClasses} onClick={handleClick}>
          {label}
        </button>
      </div>
    );
  };
  
  export default ColorButton;