import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 0.8;
  color: black;
`;

const ProfileHeader = styled.div`
  display: flex;
  color: black;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  align-items: center;
  gap: 10px;
`;

const SearchBox = styled.div`
  display: flex;
  background: #f6f6f6;
  padding: 10px;
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 16px;
  width: 100%;
  padding: 20px 0;
`;

const SearchIcon = styled.img`
  width: 28px;
  height: 28px;
  padding-left: 10px;
`;

export const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  padding-left: 15px;
  font-size: 17px;
  margin-left: 10px;
`;

const MessageTime = styled.span`
  font-size: 12px;
  margin-left: 8px; /* Add margin between message content and time */
`;

const SearchButton = styled.button`
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

const ContactListComponent = ({ setSharedState }) => {
  const [apiKey, setApiKey] = useState(null);
  const [usersIchatWith, setUsers] = useState([]);
  const [recentUsers, setRecent] = useState([]);
  // const [myMessages, setMyMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getUsers();
  }, [recentUsers]);

  useEffect(() => {
    const intervalId = setInterval(updateContactList, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://cabinet.minion.chat.junglesucks.com/getUsersIChatWith",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            ApiKey: localStorage.getItem("ApiKey"),
            Username: localStorage.getItem("name"),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const arr = sortObjectsByTimestamp(data);
        setUsers(arr);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sortObjectsByTimestamp = (arr) => {
    arr.sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampB - timestampA;
    });
    return arr;
  };

  const convertTo12HourFormat = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = date.toLocaleString("en-US", options);
    return formattedTime;
  };

  const updateContactList = async () => {
    try {
      const response = await fetch(
        "https://cabinet.minion.chat.junglesucks.com/checkNewMessages",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            ApiKey: localStorage.getItem("ApiKey"),
            Username: localStorage.getItem("name"),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (data != null) {
          setRecent(data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Use setTimeout to call the function again after a delay
      setTimeout(updateContactList, 5000); // 5 seconds interval
    }
  };
  // setInterval(updateContactList, 5000);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (inputValue) => {
    setSharedState(inputValue);
  };

  return (
    <Container>
      {/* <SearchBox>
        <SearchContainer>
          <SearchIcon src={"/search-icon.svg"} />
          <SearchInput
            placeholder="Search user"
            value={inputValue}
            onChange={handleInputChange}
          />
        </SearchContainer>
      </SearchBox>
      <SearchButton onClick={handleSearch(inputValue)}>Search</SearchButton> */}
      <ProfileHeader>
        Logged in as: {localStorage.getItem("name")}
      </ProfileHeader>
      <List style={{ overflow: "auto", maxHeight: "300px" }}>
        {usersIchatWith ? (
          usersIchatWith.map((user, index) => (
            <React.Fragment key={user.username}>
              <ListItem>
                <Button fullWidth onClick={() => handleSearch(user.username)}>
                  <ListItemText primary={user.username} />
                  <MessageTime>
                    {convertTo12HourFormat(user.timestamp)}
                  </MessageTime>
                </Button>
              </ListItem>
              {index < usersIchatWith.length && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No users to chat" />
          </ListItem>
        )}
      </List>

      {/* <p>{localStorage.getItem("name")}</p> */}
    </Container>
  );
};

export default ContactListComponent;
