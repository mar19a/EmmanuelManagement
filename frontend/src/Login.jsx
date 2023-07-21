import React, { useState } from 'react';
import './style.css'

function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        // add your login logic here
        console.log(values);
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-danger'>
                    {error && error}
                </div>
                <h2 className="text-white">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email" className="text-white"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email' 
                          onChange={e => setValues({...values, email: e.target.value})} className='form-control rounded-0 text-white' autoComplete='off'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className="text-white"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                          onChange={e => setValues({...values, password: e.target.value})} className='form-control rounded-0 text-white' />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>
                    <p className="text-white">You agree to our terms and policies</p>
                </form>
            </div>
        </div>
    )
}

export default Login;