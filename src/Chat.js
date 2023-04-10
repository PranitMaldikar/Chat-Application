import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponents";
import ConversationComponent from "./components/ConversationComponents";
import React, { useState } from 'react';

const Container = styled.div`
display : flex;
flex-direction: row;
height: 100vh;
width: 100%;
background: #f8f9fb;
`;

const App = () => {
  const [sharedState, setSharedState] = useState('');

  return (
  <Container>
    <ContactListComponent setSharedState = {setSharedState}/>  
    <ConversationComponent sharedState={sharedState}/>
  </Container>
  );
  };

export default App;
