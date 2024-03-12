import { useContext } from 'react';
import styled from 'styled-components';

import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  DeсryptMessage,
  isLocalSnap,
} from '../utils';


import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

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


export const ChatWithPartner = () => {
  const { username } = useParams();
  const [pairId, setPairId] = useState('');
  const [messages, setMessages] = useState([]);
  const [decryptedMessages, setDecryptedMessages] = useState<{ [key: string]: string }>({});
  const [isDecrypted, setIsDecrypted] = useState(false);


    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

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

  


  const handleMessageClick = () => {
    navigate(`/send-message/${username}`);    
  }

  const decryptAllMessages = async () => {
    if (username) {
    try {


      const response = await fetch(`http://localhost:8100/user/${username}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    const data = await response.json();

      const decryptedMessagesData = {};
      for (const messageId in messages) {
        decryptedMessagesData[messageId] = await DeсryptMessage(data["pubKey"], messages[messageId].Encrypted_message);
      }
    
      setDecryptedMessages(decryptedMessagesData);
      setIsDecrypted(true);
    } catch (error) {
      console.error('Error decrypting messages:', error);
    }
  } else {
    throw new Error('URL path was not ok');
  }
  };
      
  useEffect(() => {
    async function fetchData() {
      try {
        var partnerIdStr = localStorage.getItem('pair_ids');
        if (!partnerIdStr) {
          console.error('No partner ID found in local storage');
          return;
        }
        
        var partnerIdObj = JSON.parse(partnerIdStr);
        var UserInfo = partnerIdObj[username];
        
        const GetPairId = await fetch(`http://localhost:8100/pair/create`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({id_user_partner: UserInfo["Id"]})
        });

        if (!GetPairId.ok) {
          throw new Error(`Failed to fetch data: ${GetPairId.statusText}`);
        }

        const Id = await GetPairId.json();
        setPairId(Id);
      } catch (error) {
        console.error('Error fetching pairId:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (pairId) {
      async function fetchMessages() {
        try {
          const response = await fetch(`http://localhost:8100/message/related/${pairId}`, {
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

          const messages = await response.json();
          setMessages(messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }

      // run fetchMessages, if pairId set and not null
      fetchMessages();
    }
  }, [pairId]);

  return (
    <Container>  
      <div>
      <h1>Chat with <Span>{username}</Span> </h1>

        {isDecrypted ? (
          Object.keys(messages).map(messageId => (
            <div key={messageId}>
              <p> <strong>Decrypted message: </strong> {decryptedMessages[messageId]}</p>
              <p>Sent at: {messages[messageId].Sent_at}</p>
              <hr />
            </div>
          ))
        ) : (
          Object.keys(messages).map(messageId => (
            <div key={messageId}>
              <p> <strong>   Encrypted message: </strong> {messages[messageId].Encrypted_message}</p>
              <p>Sent at: {messages[messageId].Sent_at}</p>
              <hr />
            </div>
          ))
        )}
        {!isDecrypted && (
          <button onClick={decryptAllMessages} style={{ display: 'inline-block', marginRight: '350px' }}>Decrypt All</button>
        )}

          <button onClick={handleMessageClick} style={{ display: 'inline-block' }}>Send Message</button>
      </div>
    </Container>
  );

}
export default ChatWithPartner;