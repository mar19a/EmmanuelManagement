import React, { useState } from 'react';
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const navigate = useNavigate()
 
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // add your login logic here
       
        axios.post('http://localhost:8081/login', values)
        .then(res => 
            {
                if(res.data.Status == 'Success')
                {
                    navigate('/');
                } else{
                    setError(res.data.Error);
                }
            })
        .catch(err => console.log(err));
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
    onChange={e => setValues({...values, email: e.target.value})} className='form-control rounded-0 input-text' autoComplete='off'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className="text-white"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
    onChange={e => setValues({...values, password: e.target.value})} className='form-control rounded-0 input-text' />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0 mb-2'> Log in</button>
                   
                    <p className="text-white">You agree to our terms and policies</p>
                </form>
            </div>
        </div>
    )
}

export default Login;
