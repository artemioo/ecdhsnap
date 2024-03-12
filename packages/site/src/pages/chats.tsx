import { useContext } from 'react';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext } from '../hooks';
import { isLocalSnap,} from '../utils';
import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
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

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',


  listStyleType: 'none',
  padding: 0,
  marginTop: '-230px',
};


export const Chat = () => {

    const [pairs, setPairs] = useState([]);
    const [state, dispatch] = useContext(MetaMaskContext);
    const navigate = useNavigate();

    // Check if MetaMask is connected
  if (window.ethereum.isConnected()) {
    //console.log('MetaMask is connected!');
  } else {
    navigate("/login");
  }
      // Check if Snap is connected
    const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
      ? state.isFlask
      : state.snapsDetected;
  
  if (isMetaMaskReady) {
    //console.log('Snap is connected!');
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
        <h2> <Span> Chats: </Span></h2>
        {pairs.length === 0 ? (
          <p>You have no chats yet</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Object.values(pairs).map(pair => (
            <li key={pair.Id} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <Link to={`/chats/${pair.Username}`} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: 'inherit' }}>
                <h6 style={{ margin: 0 }}>{pair.Username}</h6>

              </Link>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}