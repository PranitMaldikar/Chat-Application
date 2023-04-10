import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { SearchContainer, SearchInput } from "./ContactListComponents";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 2;
  background: #f6f7f8;
`;

const ProfileHeader = styled.div`
  display: flex;
  color: black;
  flex-direction: row;
  background: #ededed;
  padding: 15px;
  align-items: center;
  gap: 10px;
`;

const ChatBox = styled.div`
  display: flex;
  background: #f0f0f0;
  padding: 10px;
  align-items: center;
  bottom: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #e5ddd6;
  color: black;
`;

const Button = styled.button`
  background: #4caf50;
  border: none;
  color: white;
  padding: 12px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 12px;
  border-radius: 12px;
  margin-left: 8px;
  cursor: pointer;
`;

const ConversationComponent = ({ sharedState }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      const response = await fetch(
        'https://cabinet.minion.chat.junglesucks.com/getMessagesBetweenMeAndUser'
      );
      const data = await response.json();

      setMessages(data.Content);
    } catch (error) {
      console.error(error);
    }
  };

  const postMessage = async () => {
    try {
      const response = await fetch(
        'https://cabinet.minion.chat.junglesucks.com/send',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            SenderName: "current_user", 
            ReceiverName: sharedState, 
            SenderMinionUrlIdentifier:  "", 
            ReceiverMinionUrlIdentifier: "",
            Content: inputValue }),
        }
      );

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { text: inputValue }]);
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    postMessage();
  };

  const Message = ({ text }) => {
    return <div>{text}</div>;
  };

  return (
    <Container>
      <ProfileHeader>{sharedState}</ProfileHeader>
      <MessageContainer>
        {messages.map((message, index) => (
          <Message key={index}>{message.text}</Message>
        ))}
        {inputValue && <Message text={inputValue} />}
      </MessageContainer>
      <ChatBox>
        <SearchContainer>
          <SearchInput
            placeholder="Type a message"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button onClick={handleButtonClick}>Send</Button>
        </SearchContainer>
      </ChatBox>
    </Container>
  );
};

export default ConversationComponent;
