import { useState } from 'react';
import { Link } from 'react-router-dom';
// import {useLogin} from '../hook/useLogin'

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
                <label><strong>Log in to your account</strong></label>
                <h3>Don't have an account? <Link to="/user/signup">Sign Up</Link></h3>
                <form onSubmit={handleSubmit}>
                    <h2 className='email'>email</h2>
                    <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email} 
                    className={emptyFields.includes('email') ? 'error': '' }/>

                    <h2 className='password'>password</h2>
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password}
                    className={emptyFields.includes('password') ? 'error': ''} /> <br />

                    <h3>Forgot your password? Click <a href="/">Here</a></h3> <br />

                    {error && <div className="error">{error}</div> }
 
                    <button disabled={isLoading}>Login</button>
                    
                </form>
            </div>
            <div className="main-display">
                GFDBFBD
            </div>
        </div>     
    );
}
 
export default LoginPage;