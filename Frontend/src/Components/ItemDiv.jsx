import { useState } from 'react';
import '../Styles/UserPreference.css';

const ItemDiv = ({ label, onClick}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
        onClick();
    };

    const itemDivClass = `item ${isClicked ? 'clicked' : ''}`;

    return (
        <div className={itemDivClass} onClick={handleClick}>
            {label}
        </div>
    );
};

export default ItemDiv;