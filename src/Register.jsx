import React, { useState } from "react";

export const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigateToLogin = () => {
    window.location.href = '/login';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setErrorMessage('Username and password cannot be empty.');
      return;
    }
    
    const minion1 = 'https://cabinet.minion.chat.junglesucks.com';
    // If the first URL fails, use this as backup
    const minion2 = 'https://lecture.minion.chat.junglesucks.com';
    
    const data = {
      'username': username,
      'password': password,
      'clientUrlIdentifier': 'a'
    };
    
    fetch(`${minion1}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        navigateToLogin();
      } else if (response.status === 409) {
        setErrorMessage('Username already taken, please choose a different one.');
      } else {
        // If the first URL fails, try the backup
        return fetch(`${minion2}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (response.ok) {
            navigateToLogin();
          } else {
            throw new Error('Failed to register.');
          }
        });
      }
    })
    .catch(error => console.error(error));
  };
  

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="newbeepboop" id="username" name="username" />
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Register</button>
      </form>
      <button className="link-btn" onClick={navigateToLogin}>Already have an account? Login here.</button>
    </div>
  )
}
