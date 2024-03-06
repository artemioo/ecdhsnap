import { useContext } from 'react';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext } from '../hooks';
import { isLocalSnap,} from '../utils';
import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};


export const Chat = () => {

    const [pairs, setPairs] = useState([]);
    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

    // Check if MetaMask is connected
  if (window.ethereum.isConnected()) {
    console.log('MetaMask is connected!');
  } else {
    navigate("/login");
  }
      // Check if Snap is connected
    const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
      ? state.isFlask
      : state.snapsDetected;
  
  if (isMetaMaskReady) {
    console.log('Snap is connected!');
  } else {
    navigate("/login");
  }


      
  useEffect(() => {
    async function fetchRelatedPair() {
      try {
        const response = await fetch(`http://localhost:8100/pair/related`, {
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
        console.log(data);
        setPairs(data);
        localStorage.setItem("pair_ids", JSON.stringify(data))
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchRelatedPair();
  }, []);

  return (
    <div style={centerStyle}>
      <div>
        <h2>Chats:</h2>
        {pairs.length === 0 ? (
          <p>You have no chats yet</p>
        ) : (
        <ul>
          {Object.values(pairs).map(pair => (
            <li key={pair.Id}>
              <p>Name: <Link to={`/chats/${pair.Username}`}>{pair.Username}</Link></p>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}