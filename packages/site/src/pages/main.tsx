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


/*   function checkCookie(cookieName: string) {
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(cookieName + '=')); }
  if (!checkCookie('session-id')) {
    navigate("/login"); } */



/*     const handleSendHelloClick = async () => {
      try {
        var data =  await GetSharedSecret()
        console.log("store",data);
        await sendHello("SUPER TEST");
      } catch (error) {
        console.error(error);
       // dispatch({ type: MetamaskActions.SetError, payload: error });
      }} */
    //<button onClick={handleSendHelloClick} style={{ marginRight: '60px', padding: '20px 40px', fontSize: '1.7rem' }}>HELLO</button>


    const handleChatsClick = () => {
      navigate("/chats");    
    }

/*     const handleTestChatClick = () => {
      navigate("/chats/NewUser");    
    } */

    const handleCreateChatClick = () => {
      navigate("/chats/create");
    };



  const handleLogoutClick = async () => {
    const url_s = `http://127.0.0.1:8100/logout`;
    const session = localStorage.getItem('session-id');

    console.log(session)

    try {
      const response = await fetch(url_s, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: session }) 
      });
/*       localStorage.removeItem('session-id');
      document.cookie = `session-id; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; */
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
