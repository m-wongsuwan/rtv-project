import React, { useState } from 'react'
import AuthForm from './AuthForm'
import { UserContext } from '../context/UserProvider'

const initInputs = {username: "", password: ""}

export default function Auth() {
    const [inputs, setInputs] = useState(initInputs)
    const [alreadyMemberToggle, setAlreadyMemberToggle] = React.useState(false)

    const { signup, login } = React.useContext(UserContext)

    function handleChange(e) {
        const {name, value} = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleSignup(e) {
        e.preventDefault()
        signup(inputs)
    }

    function handleLogin(e) {
        e.preventDefault()
        login(inputs)
    }



    return (
        <>
            <h1>This is the auth componenet which contains AuthForm </h1>
            {!alreadyMemberToggle ? 
                <>
                    <AuthForm 
                        handleChange={handleChange}
                        btnText="Sign Up" 
                        inputs={inputs}
                        handleSubmit={handleSignup}
                    />
                    <button onClick={()=>setAlreadyMemberToggle(prev => !prev)}>Already a member?</button>
                </>
                :
                <>
                    <AuthForm 
                        handleChange={handleChange}
                        btnText="Log in" 
                        inputs={inputs}
                        handleSubmit={handleLogin}

                    />
                    <button onClick={()=>setAlreadyMemberToggle(prev => !prev)}>Not yet a member?</button>
                </>
            }
            
        </>
    )
}
