import {useState,  useEffect} from 'react';
import '../Styles/RadiuBar.css';

const RadiuBar = ({ onRadiuChange }) => {

    const [radiu, setRadiu] = useState(1);

    const [maxRadiu, setMaxradiu] = useState(500);

    const handleRadiuChange = (event) => {
        const newRadiu = parseInt(event.target.value);
        setRadiu(newRadiu);
        onRadiuChange(newRadiu);
    };

    const handleMaxRadiuChange = (event) => {
        const newMaxRadiu = parseInt(event.target.value);
        setMaxradiu(newMaxRadiu);
    };

    useEffect(() => {
        if (radiu > maxRadiu) {
            setRadiu(maxRadiu);
        }
    }, [maxRadiu,radiu]);

    return (
        <div>
            <div className='type'>Radiu</div>
            <div>
            <input type='range' id="radiu" name="radiu" min="1" max={maxRadiu} radiu={radiu} onChange={handleRadiuChange}/>
            <input type="number" id="maxradiu" name="maxradiu" radiu={maxRadiu} onChange={handleMaxRadiuChange}/>
            <p className='radiu'>{radiu}</p>
            </div>
        </div>
    );
}

export default RadiuBar;