import { useContext } from 'react';
import styled from 'styled-components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  EnсryptMessage,
  isLocalSnap,

} from '../utils';


import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';


export const SendMessage = () => {

    const { username } = useParams();

    const [message, setMessage] = useState('');
    const handleChange = (event) => {
      setMessage(event.target.value);
    };


    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

        // Check if MetaMask is connected
    if (window.ethereum.isConnected()) {
        //console.log('MetaMask is connected!');
    } else {
      navigate("/login");
        return null;
    }
        const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
        ? state.isFlask
        : state.snapsDetected;
    
    if (isMetaMaskReady) {
        //console.log('Snap is connected!');
    } else {
      navigate("/login");
        return null;
    }

    

    const handleSubmit = async (event) => {
        event.preventDefault();

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

          if (username == undefined) {
            throw new Error('URL path was not ok');
          } else {
            const ciphertext = await EnсryptMessage(data["pubKey"], message);
          

        const GetPairId = await fetch(`http://localhost:8100/pair/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({id_user_partner: data["id"]})
        });

        if (!GetPairId.ok) {
            throw new Error(`Failed to fetch data: ${GetPairId.statusText}`);
        }

        const PairId = await GetPairId.json();

        
        const SendMessage = await fetch(`http://localhost:8100/message/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({Id_pair: PairId, Encrypted_message: ciphertext})
        });

        if (!GetPairId.ok) {
            throw new Error(`Failed to fetch data: ${GetPairId.statusText}`);
        }

          //navigate(`/chats/${username}`)
          navigate(`/chats`)
        }
      }
        
        catch(error) {
          console.error('Server error:', error);
        };
        
      };
      

    return (
        
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <h3 style={{ marginBottom: '20px' }}>Sent a Message to <strong>{username}</strong></h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <textarea
          value={message}
          onChange={handleChange}
          placeholder="your text here..."
          style={{
            width: '550px',
            height: '160px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px',
          }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '20px' }}>Send</button>
      </form>
    </div>
  );
};
export default SendMessage;
