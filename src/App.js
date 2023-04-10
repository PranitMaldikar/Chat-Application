import React, { useState } from "react";
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";
import Chat from './Chat';


function App() {
  const [authForm, setAuthForm] = useState('login');

  const handleFormSwitch = (formName) => {
    setAuthForm(formName);
  }

  return (
    <div className="App">
      {authForm === 'register' && <Register onFormSwitch={handleFormSwitch} />}
      {authForm === 'login' && <Login onFormSwitch={handleFormSwitch} />}
      {authForm === 'chat' && <Chat onFormSwitch={handleFormSwitch} />}
    </div>
  );
}

export default App;
