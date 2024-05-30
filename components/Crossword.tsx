// components/Crossword.tsx
"use client"
// components/Crossword.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { createEmptyGrid, getRandomWords, placeWordsInGrid, Grid, CrosswordData, Clues } from '../utils/crosswordUtils';

const CrosswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 40px); /* Adjust the number of columns */
  grid-template-rows: repeat(10, 40px);    /* Adjust the number of rows */
  gap: 5px;
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CellContainer = styled.div`
  position: relative;
`;

const Cell = styled.input<{ isIncorrect: boolean }>`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: ${({ isIncorrect }) => (isIncorrect ? '#f8d7da' : 'white')};
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Number = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 10px;
  color: black;
`;

const ClueList = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const Clue = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Message = styled.div<{ success: boolean }>`
  margin-top: 20px;
  font-size: 18px;
  color: ${({ success }) => (success ? 'green' : 'red')};
`;

const Crossword: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [clues, setClues] = useState<Clues>({ across: {}, down: {} });
  const [positions, setPositions] = useState<{ [key: string]: { row: number; col: number; direction: 'across' | 'down' } }>({});
  const [answers, setAnswers] = useState<Grid>([]);
  const [incorrectCells, setIncorrectCells] = useState<{ row: number; col: number }[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const size = 10; // Define the grid size
    const emptyGrid = createEmptyGrid(size);
    const randomWords = getRandomWords(5); // Get a random subset of words
    const { grid: newGrid, clues: newClues, positions: newPositions } = placeWordsInGrid(emptyGrid, randomWords);

    setGrid(newGrid);
    setClues(newClues);
    setPositions(newPositions);
    setAnswers(newGrid.map(row => row.map(cell => '')));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const newAnswers = [...answers];
    newAnswers[row][col] = e.target.value.toUpperCase();
    setAnswers(newAnswers);
  };

  const checkSolution = () => {
    let isCorrect = true;
    const newIncorrectCells: { row: number; col: number }[] = [];

    for (let row = 0; row < answers.length; row++) {
      for (let col = 0; col < answers[row].length; col++) {
        if (grid[row][col] !== '' && answers[row][col] !== grid[row][col]) {
          isCorrect = false;
          newIncorrectCells.push({ row, col });
        }
      }
    }

    setIncorrectCells(newIncorrectCells);
    if (isCorrect) {
      setMessage('Congratulations! You solved the crossword!');
    } else {
      setMessage('Some answers are incorrect. Try again!');
    }
  };

  return (
    <CrosswordContainer>
      <GridContainer>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const clueNumber = Object.keys(positions).find(
              key => positions[key].row === rowIndex && positions[key].col === colIndex
            );
            return (
              <CellContainer key={`${rowIndex}-${colIndex}`}>
                <Cell
                  value={answers[rowIndex][colIndex]}
                  onChange={(e) => handleChange(e, rowIndex, colIndex)}
                  disabled={cell === ''}
                  isIncorrect={incorrectCells.some(
                    incorrectCell =>
                      incorrectCell.row === rowIndex && incorrectCell.col === colIndex
                  )}
                />
                {clueNumber && <Number>{clueNumber}</Number>}
              </CellContainer>
            );
          })
        )}
      </GridContainer>
      <ClueList>
        <h3>Across Clues</h3>
        {Object.entries(clues.across).map(([key, word]) => (
          <Clue key={key}>{key}. {word}</Clue>
        ))}
        <h3>Down Clues</h3>
        {Object.entries(clues.down).map(([key, word]) => (
          <Clue key={key}>{key}. {word}</Clue>
        ))}
      </ClueList>
      <button onClick={checkSolution}>Check Solution</button>
      {message && <Message success={message.includes('Congratulations')}>{message}</Message>}
    </CrosswordContainer>
  );
};

export default Crossword;
