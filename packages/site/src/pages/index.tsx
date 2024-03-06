import { useContext } from 'react';
import styled from 'styled-components';
import {
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  GenerateKeys,
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';



import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Web3Provider from 'ethers';

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

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const navigate = useNavigate();

  const [UserName, setUserName] = useState<string>("");
  const [UserAddress, setUserAddress] = useState<string>("");
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

/*   const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }; */


  const HandleCreateUser = async () => {

    const pub_key = await GenerateKeys() 


    const params = {
      username: UserName,
      address: UserAddress,
      pubkey: pub_key
    }

    const url = `http://localhost:8100/user/create`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params) 
      });
    
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const UserId = await response.json();
    
      if (UserId) {
        const url_s = `http://localhost:8100/login`;
        try {
          const response_s = await fetch(url_s, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ Id: UserId }) 
          });
          
          const response_s_data = await response_s.json() 
          localStorage.setItem('session-id', response_s_data.session_id);

          if (!response_s.ok) {
            throw new Error(`Failed to fetch data: ${response_s.statusText}`);
          }
          
        } catch (error) {
          console.error('login fetch error:', error);
        }
      } else {
        console.error('Failed to get User ID');
      }
    } catch (error) {
      console.error('User Create fetch error:', error);
    }

    navigate("/")

  };


  return (
    <Container>
      <Heading>
        Welcome to <Span>ECDH Master</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the ECDH snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}


          <FormControl>
            <FormLabel fontSize={20} fontWeight={400} marginBottom={"10px"}>
            Your Name
            </FormLabel>
            <Input
              borderRadius={"22px"}
              border={"1px solid #F7F5F0"}
              bg={"rgba(247, 245, 240, 0.40)"}
              width={"550px"}
              height={"56px"}
              flexShrink={0}
              paddingLeft={8}
              fontSize={16}
              placeholder="for example: Bob"
              value={UserName}
              onChange={(e) => {
                setUserName(e.currentTarget.value);
              }}
            />
          
        </FormControl>

        <FormControl>
            <FormLabel fontSize={20} fontWeight={400} marginBottom={"10px"}>
            Your Address
            </FormLabel>
            <Input
              borderRadius={"22px"}
              border={"1px solid #F7F5F0"}
              bg={"rgba(247, 245, 240, 0.40)"}
              width={"550px"}
              height={"56px"}
              flexShrink={0}
              paddingLeft={8}
              fontSize={16}
              placeholder="for example: 0xAbCdEf012...  "
              value={UserAddress}
              onChange={(e) => {
                setUserAddress(e.currentTarget.value);
              }}
            />
          
        </FormControl>

        <Button
          mt={20} 
          colorScheme="teal"
          onClick={HandleCreateUser}
        >
          Let`s start
        </Button>

      </CardContainer>
    </Container>
  );
};

export default Index;

