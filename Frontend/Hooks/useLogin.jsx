import { useState } from 'react'

export const useLogin = () =>{

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const {dispatch} = useAuthContext()


    const login = async (email, password) => {
        if(!email || !password)
        {
            setError('All fields must be filled')
        }
        else{
            setIsLoading(true)
            setError(null)
            console.log("Is here")
            const response = await fetch('/user/login',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({ Email: email, Password: password })
            })
    
            const json =  await response.json()
            setIsLoading(false)
    
            if(!response.ok)
            {
                setIsLoading(false)
                setError(json.error)
                
            }
            if(response.ok)
            {
                setIsLoading(false)
                dispatch({type:"LOGIN", payload:json})
                localStorage.setItem('user',JSON.stringify(json))
            }
            
        }


    }    
    return{isLoading, login, error}
}
