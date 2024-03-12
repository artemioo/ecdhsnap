import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { isLocalSnap } from '../utils';

import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 50px)',
    marginTop: '-100px',
  };
  
const userListStyle = {
    listStyle: 'none', 
    fontSize: '2.8rem',
};


export const CreateChat = () => {

    interface User {
      Id: number
      Username: string
      Address: string
      PubKey: string
    }

    const [Users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

    // Check if MetaMask and Snap are connected
  if (window.ethereum.isConnected()) {
    //console.log('MetaMask is connected!');
  } else {
    navigate("/login");
  }
    const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
      ? state.isFlask
      : state.snapsDetected;
  
  if (isMetaMaskReady) {
    //console.log('Snap is connected!');
  } else {
    navigate("/login");
  }

  
      
  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await fetch(`http://localhost:8100/users`, {
          method: "GET",
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error:', error);
        navigate("/");
      }
    }

    fetchAllUsers();
  }, []);




  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const usersArray = Object.values(Users);
  
  const filteredUsers = usersArray.filter((user) =>
    user.Username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container> 

    <div style={userListStyle}>
    <input
      type="text"
      value={filter}
      onChange={handleFilterChange}
      placeholder="username"
      style={{
        width: '300px',
        height: '40px',
        padding: '0 10px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'all 0.3s ease',
      }}
    />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.Id}>
          <Link to={`/send-message/${user.Username}`}> {user.Username} </Link>
            </li>
        ))}
      </ul>
    </div>
    </Container>
  );
};

export default CreateChat;