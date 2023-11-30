import { useState } from 'react';
import { Link } from 'react-router-dom';
import {useLogin} from '../Hooks/useLogin'
import drivingPig from '../Images/ezgif.com-crop.gif'

import '../Styles/LoginPage.css'
const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emptyFields, setEmptyFields] = useState([])

    const {error, isLoading, login, setError} = useLogin()

    const handleSubmit = (e) =>{ 
        e.preventDefault() 
        setEmptyFields([])
        setError(null)
        login(email, password)
    }
    return (  
        <div className='user-login-screen'>
            <div className="side-display">
                {/* <img src={MangoMentorsLogo} alt="" /><br /> */}
                <label className='remainder'><strong>Log in to your account<br /></strong></label>
                <br/><h3 className='remainder'>Don't have an account? <Link to="/user/signup">Sign Up</Link></h3><br/>
                <form onSubmit={handleSubmit}>
                    <h2 className='email'>Email</h2>
                    <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email} 
                    className={emptyFields.includes('email') ? 'error': '' }/>

                    <h2 className='password'>Password</h2>
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password}
                    className={emptyFields.includes('password') ? 'error': ''} /> <br />

                    <br/><h3 className='remainder'>Forgot your password?</h3> 
                    <h3 className='remainder'>Click <a href="/">Here</a></h3><br/>
                    {error && <div className="error">{error}</div> }
 
                    <button className="login-button" disabled={isLoading}>Login</button>

                    <h3> <Link to="/pathfinder">Skip</Link></h3>
                </form>
            </div>
            <div className="main-display">
            <img src={drivingPig} alt="" />
            </div>
        </div>     
    );
}
 
export default LoginPage;