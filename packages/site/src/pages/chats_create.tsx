import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { isLocalSnap } from '../utils';

import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';


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

    const [Users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

    // Check if MetaMask and Snap are connected
  if (window.ethereum.isConnected()) {
    console.log('MetaMask is connected!');
  } else {
    navigate("/login");
  }
    const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
      ? state.isFlask
      : state.snapsDetected;
  
  if (isMetaMaskReady) {
    console.log('Snap is connected!');
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
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
        navigate("/");
      }
    }

    fetchAllUsers();
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUser(userId); 
  };

  const handleSendMessage = () => {
    if (selectedUser) {
    const selectedUserData = Object.values(Users).find(user => user.Id === selectedUser);
    if (selectedUserData) {
      navigate(`/send-message/${selectedUserData.Username}`);
  }
}
};

  return (
    <div style={centerStyle}>
      <div>
        <h2 style={{ marginTop: '50px' }}>Users:</h2>
        {Users.length === 0 ? (
          <p>You have no chats yet</p>
        ) : (
          <ul style={userListStyle}>
            {Object.values(Users).map((user) => (
              <li key={user.Id}>
                <label>
                  <input
                    type="radio"
                    name="selectedUser"
                    value={user.Id}
                    checked={selectedUser === user.Id}
                    onChange={() => handleUserSelection(user.Id)}
                  />
                  {user.Username}
                </label>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleSendMessage} disabled={!selectedUser}>
          Send a Message
        </button>
      </div>
    </div>
  )}
