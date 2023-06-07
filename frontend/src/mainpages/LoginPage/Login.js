import { AltRoute, FilterCenterFocusSharp } from '@mui/icons-material';
import React, { useState, useContext } from 'react';
import "./login.css"
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../components/AuthContext';

const Login = () => {

  /*set states for the username and password*/
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();
  const {setToken} = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    //checking with the backend if the user credentials are valid
    try{
      const response = await fetch('/api/login', {
          method: 'POST', 
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({Username: username, Password: password}),
        });

        console.log("JSON DATA IS: ", JSON.stringify({username: username, password: password}));

        if (response.ok){
          console.log("Logged in successfully")
          const token = await response.text(); 
          localStorage.setItem("token", token); //store the token in local storage
          setToken(token); // setting token in AuthContext
          navigate('/units') //placeholder navigation for now 

        }
        
        else{
          setErrorMessage("Incorrect username or password") 
        }
    }
    catch(error){
      setErrorMessage("Unable to connect to server") //status code 400 error
    }

    };

  return (
    <form onSubmit={handleLogin} className='login' data-testid = 'login-form'>
        <label htmlFor='username'>
             Username:
            <input data-testid="username-input" type="username" name="username" id='username' value={username} onChange={event => setUsername(event.target.value)} />
        </label>
        <label htmlFor='password'>
            Password:
            <input  id='password' data-testid='password-input' type="password" value={password} onChange={event => setPassword(event.target.value)} />
        </label>
        <div className='button-padding'>
            <button>Login</button>
        </div>
        {errorMessage && <div className='error-message'>{errorMessage}</div>}
    </form>
  );
}

export default Login;
