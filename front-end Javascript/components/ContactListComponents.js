import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider } from "@material-ui/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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

// const SearchBox = styled.div`
//   display: flex;
//   background: #f6f6f6;
//   padding: 10px;
// `;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 16px;
  width: 100%;
  padding: 20px 0;
`;

// const SearchIcon = styled.img`
//   width: 28px;
//   height: 28px;
//   padding-left: 10px;
// `;

export const SearchInput = styled.input`
  width: 80%; /* Update width to reduce size */
  outline: none;
  border: none;
  padding-left: 10px; /* Update padding to reduce size */
  font-size: 14px; /* Update font-size to reduce size */
  margin-left: 5px;
`;

const MessageTime = styled.span`
  font-size: 12px;
  margin-left: 8px; /* Add margin between message content and time */
`;

// const SearchButton = styled.button`
//   background: #4caf50;
//   border: none;
//   color: white;
//   padding: 12px 16px;
//   text-align: center;
//   text-decoration: none;
//   font-size: 12px;
//   border-radius: 12px;
//   margin-left: 8px;
//   cursor: pointer;
// `;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ContactListComponent = ({ setSharedState }) => {
  // const [apiKey, setApiKey] = useState(null);
  const [usersIchatWith, setUsers] = useState([]);
  const [recentUsers, setRecent] = useState([]);
  // const [myMessages, setMyMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputUser, setInputUser] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getUsers();
    const intervalId = setInterval(updateContactList, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [recentUsers]);

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

  const WelcomeText = styled.div`
    text-decoration: underline;
    text-decoration-color: gray;
  `;

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
            ReceiverName: inputUser,
            Content: inputMessage,
          }),
        }
      );
      if (response.ok) {
        console.log("message sent!");
        setSharedState(inputUser);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (inputValue) => {
    setSharedState(inputValue);
  };
  const handleInputMessage = (e) => {
    setInputMessage(e.target.value);
  };

  const handleInputUser = (e) => {
    setInputUser(e.target.value);
  };

  const handleButtonClick = () => {
    postMessage();
    getUsers();
    setInputMessage("");
    setInputUser("");

    // setInputValue("");
  };

  return (
    <Container>
      <ProfileHeader>
        <WelcomeText>
          Welcome to decentralized chat {localStorage.getItem("name")}!
        </WelcomeText>
      </ProfileHeader>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{
          borderRadius: "20px",
          backgroundColor: "#8bc34a",
          color: "white",
        }}
      >
        Click here to start new chat with a user
      </Button>

      {/* <Divider style={{ backgroundColor: "black" }} /> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <SearchInput
              placeholder="Type username"
              type="text"
              value={inputUser}
              onChange={(e) => handleInputUser(e)}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <SearchInput
              placeholder="Type your message"
              type="text"
              value={inputMessage}
              onChange={(e) => handleInputMessage(e)}
            />
          </Typography>
          <Button onClick={handleButtonClick}>Send message</Button>
        </Box>
      </Modal>
      {/* <Divider style={{ backgroundColor: "black" }} /> */}
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
