import { useContext } from 'react';
import styled from 'styled-components';
import {
  Input,
  Spinner,
  FormControl,
  FormLabel,
  Box,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';


import { getSecretKey } from 'snap/src/secret_key'

import React, { useCallback, useState, useEffect } from "react";

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
  justify-content: space-between;
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
  /** String input for Second Side */
  const [SecondSide_key, setSecondSide_key] = useState<string>("");
  
  const [SharedKey, setSharedKey] = useState<string | null>(null);
  
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

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };


  const getPublicKey = async (name: string): Promise<Uint8Array> => {
    // request to my backend
    const url = `http://127.0.0.1:8000/get_pub_key/${name}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
  
      // const data = await response.json();

      const data = await response.arrayBuffer();
      const byteArray = new Uint8Array(data);

   
      return byteArray
      
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const HandleGenerateSharedKey = async () => {
    // обращаюсь к RPC snap`а и получаю пк

    // console.log('second - ', SecondSide_key)

    const second_user_pk = await getPublicKey(SecondSide_key)
    console.log('публ ключ 2 юзера: ', second_user_pk) 
    const secret = await getSecretKey(second_user_pk)

    try {
      // Получить общий секретный ключ
      const secretKey = secret
      console.log('общий секретный - ' ,secretKey)
      
      // Проверка, является ли secretKey строкой
      if (typeof secretKey === 'string') {
        // console.log('secretKey - ', secretKey)
        setSharedKey(secretKey);
   
      } else {
        console.error('Unexpected result from getSecretKey:', secretKey);
        setSharedKey('Unexpected result');
      }
    } catch (error) {
      console.error('Error while getting secret key:', error);
      setSharedKey('Error occurred'); 
    }

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
                'Get started by connecting to and installing the example snap.',
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
        <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

          <FormControl>
            <FormLabel fontSize={20} fontWeight={400} marginBottom={"10px"}>
            Second Side's Name
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
              value={SecondSide_key}
              onChange={(e) => {
                setSecondSide_key(e.currentTarget.value);
              }}
            />
        </FormControl>

        <Button
          mt={9} 
          colorScheme="teal"
          onClick={HandleGenerateSharedKey}
        >
          Generate Secret Key
        </Button>


        <Box  overflow="hidden">
            <Text fontSize={20} fontWeight={400} marginTop={5} marginBottom={"4px"}>
              Your Secret Key
            </Text>
            <Flex
              justify={"right"}
              textAlign={"center"}
              width={"580px"}
              height={"58px"}
              flexShrink={"0"}
              padding={"25px 0"}
              borderRadius={"22px"}
              fontSize={16}
              border={"1px solid #F7F5F0"}
              bg={"rgba(247, 245, 240, 0.40)"}

            >
            <Box margin="0 20px">
              {SharedKey !== null ? (
                SharedKey // show secret key
              ) : (
                '--'
              )}
            </Box>
          </Flex>
        </Box>


      </CardContainer>
    </Container>
  );
};

export default Index;

