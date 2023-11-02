
import { useState } from "react"
export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()


    const signup = async (email, firstName, lastName, password) =>{
        setError(null)
        setIsLoading(false)

        const response = await fetch('/user/signup',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({Email:email, Password:password, First_Name:firstName, Last_Name:lastName})
        })

        const json =  await response.json()

        if(!response.ok)
        {
            setError(json.error)
            setIsLoading(false)
        }
        if(response.ok)
        {
            setIsLoading(false)
            dispatch({type:'LOGIN', payload:json})
            localStorage.setItem('user',JSON.stringify(json))

        }

        

    }
    return {isLoading, error, signup, setError}





}