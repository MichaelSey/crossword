// pages/index.tsx
'use client';
import Crossword from '../components/Crossword';
import styled from 'styled-components';

const PageContainer = styled.div`
  background: #e0e7ff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Home: React.FC = () => {
  return (
    <PageContainer>
      <Title>Crossword Game</Title>
      <Crossword />
    </PageContainer>
  );
};

export default Home;
