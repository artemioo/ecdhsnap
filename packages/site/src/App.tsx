import type { FunctionComponent, ReactNode } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';

import { Footer, Header } from './components';
import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Chat}  from './pages/chats';
import Index  from '../src/pages/index'
import Main from './pages/main';
import { CreateChat } from './pages/chats_create';
import SendMessage from './pages/send_message';
import ChatWithPartner from './pages/chat_with_partner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
          <Router>
            <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Index />} /> 
            <Route path="/chats" element={<Chat />} />    
            <Route path="/chats/:username" element={<ChatWithPartner />} /> 
            <Route path="/chats/create" element={<CreateChat />} /> 
            <Route path="/send-message/:username" element={<SendMessage />} /> 


           {/*  {children} */}
          </Routes>
          </Router>

        <Footer />
      </Wrapper>
    </>
  );
};
