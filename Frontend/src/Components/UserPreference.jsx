import '../Styles/UserPreference.css';

const UserPreference = () => {
    return ( 
    <div className="UserPreference">
                <div className="filter">
                    <button className='choice' onclick="filterSelection('other')">Other</button>
                    <button className='choice' onclick="filterSelection('food')">Food</button>
                    <button className='choice' onclick="filterSelection('activity')">Activity</button>
                    <button className='choice' onclick="filterSelection('shelter')">Shelter</button>
                </div>
                <div className='container'>
                  <div className="type">Dietary</div>
                    <div className='item food'>Vegatarian</div>
                    <div className='item food'>Kosher</div>
                    <div className='item food'>Halal</div>
                    <div className='item food'>Low-crab</div>
                    <div className='item food'>Dairy</div>
                    <div className='item food'>Pescado</div>
                    <div className='item food'>Keto</div>
                    <div className='item food'>Vegan</div>
                </div>
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
                <div>
                    <div className='container'>Price</div>
                    <input type='range' id="price" name="price" min="1" max="10000"></input>
                    <input type="button" id="max" value="Set Max" onclick="msg()"></input>
                </div>
              </div>

    );
}
 
export default UserPreference;