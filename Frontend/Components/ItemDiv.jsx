import { useState } from 'react';
import '../Styles/UserPreference.css';

const ItemDiv = ({ label }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const itemDivClass = `item ${isClicked ? 'clicked' : ''}`;

    return (
        <div className={itemDivClass} onClick={handleClick}>
            {label}
        </div>
    );
};

export default ItemDiv;