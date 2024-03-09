import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
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
  color: white;
  font-weight: bold;
  flex-direction: row;
  background: #0a290a;
  padding: 10px;
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
  flex-grow: 1; /* Add this line to ensure message container takes up remaining space */
  overflow-y: auto; /* Add this line to enable scrolling */
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
  margin-left: auto; /* Add this property to align the button to the extreme right */
`;

const LogoutButton = styled.button`
  background: #006969;
  border: none;
  color: white;
  padding: 12px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 12px;
  border-radius: 12px;
  margin-left: auto;
  cursor: pointer;
`;

const MyMessage = styled.div`
  background: ${(props) => (props.isYours ? "#b6f395" : "#daf8cb")};
  max-width: 50%;
  color: #303030;
  padding: 8px 10px;
  font-size: 19px;
  text-align: right;
  margin-left: auto;
  align-self: flex-end;
  border: 1px solid black;
  border-radius: 5px;
`;

const ReceivedMessage = styled.div`
  background: ${(props) => (props.isYours ? "#daf8cb" : "white")};
  max-width: 50%;
  color: #303030;
  padding: 8px 10px;
  font-size: 19px;
  text-align: left;
  margin-right: auto;
  align-self: flex-start;
  border: 1px solid black;
  border-radius: 5px;
`;

const MessageTime = styled.span`
  font-size: 12px;
  margin-left: 8px; /* Add margin between message content and time */
`;

const sortObjectsByTimestamp = (arr) => {
  arr.sort((a, b) => {
    const timestampA = new Date(a.UpdatedAt).getTime();
    const timestampB = new Date(b.UpdatedAt).getTime();
    return timestampA - timestampB;
  });
  return arr;
};

const convertTo12HourFormat = (timestamp) => {
  const date = new Date(timestamp);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = date.toLocaleString("en-US", options);
  return formattedTime;
};

const ConversationComponent = ({ sharedState }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    getMessages();
    const intervalId = setInterval(getMessages, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [sharedState]);

  // useEffect(() => {
  //   // Scroll to the bottom of the message container when new messages are added
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTop =
  //       messageContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  const getMessages = async () => {
    try {
      const response = await fetch(
        "https://cabinet.minion.chat.junglesucks.com/getMessagesBetweenMeAndUser",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            ApiKey: localStorage.getItem("ApiKey"),
            Username: localStorage.getItem("name"),
            ReceiverName: sharedState,
          }),
        }
      );
      const data = await response.json();
      const arr = sortObjectsByTimestamp(data);
      setMessages(arr);
    } catch (error) {
      console.error(error);
    }
  };

  const postMessage = async () => {
    try {
      const response = await fetch(
        "https://cabinet.minion.chat.junglesucks.com/send",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            ApiKey: localStorage.getItem("ApiKey"),
            SenderName: localStorage.getItem("name"),
            ReceiverName: sharedState,
            Content: inputValue,
          }),
        }
      );
      if (response.ok) {
        console.log("message sent!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    postMessage();
    getMessages();
    setInputValue("");
  };

  const handleLogout = () => {
    window.location.href = "/login";
    localStorage.clear();
  };
  // setInterval(getMessages(), 5000);

  return (
    <Container>
      <ProfileHeader>
        {sharedState}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ProfileHeader>
      <MessageContainer>
        {sharedState ? (
          <React.Fragment>
            {messages &&
              messages.map((message, index) => {
                // Add a check for messages
                if (message.SenderName === localStorage.getItem("name")) {
                  return (
                    <MyMessage key={index} isYours>
                      {message.Content}
                      <MessageTime>
                        {convertTo12HourFormat(message.UpdatedAt)}
                      </MessageTime>
                    </MyMessage>
                  );
                } else if (message.SenderName === sharedState) {
                  return (
                    <ReceivedMessage key={index} isYours>
                      {message.Content}
                      <MessageTime>
                        {convertTo12HourFormat(message.UpdatedAt)}
                      </MessageTime>
                    </ReceivedMessage>
                  );
                } else {
                  return null;
                }
              })}
          </React.Fragment>
        ) : (
          <h3>Enjoy decentralized chatting!</h3>
        )}
      </MessageContainer>
      <ChatBox>
        <SearchContainer>
          <SearchInput
            placeholder="Type a message"
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
          />
          <Button onClick={handleButtonClick}>Send</Button>
        </SearchContainer>
      </ChatBox>
    </Container>
  );
};

export default ConversationComponent;
