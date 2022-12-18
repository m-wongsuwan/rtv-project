import React from 'react'

export default function AuthForm(props) {

    const {
        btnText,
        handleChange,
        inputs,
        handleSubmit
    } = props

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder='Username'
                name='username'     
                value={inputs.username}
                onChange={handleChange}
            />
            <input 
                type="text"
                placeholder='Password'
                name='password'     
                value={inputs.password}
                onChange={handleChange}
            />
            <button>{btnText}</button>
        </form>
    )
}