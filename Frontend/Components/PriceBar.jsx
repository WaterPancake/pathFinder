import {useState,  useEffect} from 'react';
import '../Styles/UserPreference.css';

const PriceBar = () => {

    const [value, setValue] = useState(1);

    const [maxValue, setMaxValue] = useState(100);

    const handlePriceChange = (event) => {
        setValue(event.target.value);
    };

    const handleMaxValueChange = (event) => {
        const newMaxValue = parseInt(event.target.value, 10);
        setMaxValue(newMaxValue);
    };

    useEffect(() => {
        if (value > maxValue) {
            setValue(maxValue);
        }
    }, [maxValue]);

    return (
        <div>
            <div className='type'>Price</div>
            <div>
            <input type='range' id="price" name="price" min="1" max={maxValue} value={value} onChange={handlePriceChange}/>
            <input type="number" id="maxValue" name="maxValue" value={maxValue} onChange={handleMaxValueChange}/>
            <p className='value'>${value}</p>
            </div>
        </div>
    );
}

export default PriceBar;