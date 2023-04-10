import React, { useState } from "react";



export const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSwitch = (formType) => {
    // console.log(props);
    props.onFormSwitch(formType);
    window.history.replaceState(null, null, `/${formType}`); // update URL
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
    setErrorMessage('Username and password cannot be empty.');
    return;
  }
    try {
      const response = await fetch('https://cabinet.minion.chat.junglesucks.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      // console.log(response);
      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setApiKey(data.ApiKey);
        // props.onLoginSuccess(username);
        console.log(`API key received: ${data.ApiKey}`);
        handleFormSwitch('chat');
      } else if (response.status === 409) {
        setErrorMessage('Invalid username or password.');
      } else {
        console.error('Failed to login');
      }
    } 
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="existingbeepboop" id="username" name="username" />
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" >Log In</button>
      </form>
      <button className="link-btn" onClick={() => handleFormSwitch('register')}>
        Don't have an account? Register here.
      </button>
    </div>
  )
}
export default Login;
