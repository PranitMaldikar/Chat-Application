import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import ConversationComponents from './ConversationComponents';

/* 



*/



const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 0.8;
  color: black;
`;

const SearchBox = styled.div`
  display: flex;
  background: #f6f6f6;
  padding: 10px;
`;

const UserListItem = styled.p`
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
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

const ContactListComponent = ({setSharedState}) => {
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Call function to retrieve list of users
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      // Perform GET request to retrieve user list data
      const response = await fetch(
        'https://cabinet.minion.chat.junglesucks.com/users'
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSharedState(inputValue);
    // console.log(inputValue)
  };

  return (
    <Container>
      <SearchBox>
        <SearchContainer>
          <SearchIcon src={'/search-icon.svg'} />
          <SearchInput
            placeholder='Search user'
            value={inputValue}
            onChange={handleInputChange}
          />
          <SearchButton onClick={handleSearch}>Search</SearchButton>
        </SearchContainer>
      </SearchBox>
      {users.map((user) => (
        <UserListItem key={user.Username}>{user.Username}</UserListItem>
      ))}
    
    </Container>
  );
};

export default ContactListComponent;
