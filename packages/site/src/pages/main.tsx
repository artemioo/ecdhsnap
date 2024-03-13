import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useContext } from 'react';

import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { isLocalSnap } from '../utils';


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

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Main = () => {

    const navigate = useNavigate();
    const [state, dispatch] = useContext(MetaMaskContext);

        // Check if MetaMask is connected
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


    const handleChatsClick = () => {
      navigate("/chats");    
    }

    const handleCreateChatClick = () => {
      navigate("/chats/create");
    };



  const handleLogoutClick = async () => {
    const url_s = `http://localhost:8100/logout`;
    const session = localStorage.getItem('session-id');

    try {
      const response = await fetch(url_s, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ "session-id": session }) 
      });

      localStorage.removeItem('session-id');
      navigate("/login");
    } catch (error) {
      console.error('Error:', error);
    }
  }


    return (
      <Container>
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '250px' }}>
          <h1><Span>ECDH Master</Span> </h1>
          <div style={{ marginBottom: '25px' }}>
           <button onClick={handleChatsClick} style={{ marginRight: '60px', padding: '20px 40px', fontSize: '1.7rem' }}>My Chats</button>
            <button onClick={handleCreateChatClick} style={{ padding: '20px 40px', fontSize: '1.7rem' }}>Create a new Chat</button>
          </div>
          <button onClick={handleLogoutClick} style={{ marginRight: '60px', backgroundColor: '#b81414', padding: '20px 40px', fontSize: '1.7rem' }}>Logout</button>
        </div>
        </Container>
      );
    };

export default Main;
