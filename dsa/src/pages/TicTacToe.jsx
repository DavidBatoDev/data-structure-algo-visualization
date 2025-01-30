import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import MinecraftBtn from '../components/MinecraftBtn';
import Button from '../components/Button.jsx';

import X from '/images/x.gif'; 
import O from '/images/o.gif'; 
import AnimatedClouds from '../components/AnimatedCloud';
import MarioRunning from '../components/MarioRunning';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);

  const clickSound = new Audio('/audio/button-click.mp3');

  useEffect(() => {
    document.title = 'Tic-Tac-Toe';
  }, []);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    if (board.every(cell => cell)) {
      return { winner: null, line: [], isDraw: true };
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    clickSound.currentTime = 0;
    clickSound.play().catch((err) => {
      console.log('Audio play failed:', err);
    });

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult.winner);
      setWinningLine(gameResult.line);
      setIsDraw(gameResult.isDraw || false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          flex justify-center items-center 
          h-20 w-20 cursor-pointer shadow-md rounded-lg border-2 border-yellow-600
          ${isWinningSquare ? 'bg-red-500' : 'bg-secondary-light'} 
          ${board[index] ? 'pointer-events-none' : ''} 
          transition-all duration-300
        `}
        onClick={() => handleClick(index)}
      >
        {board[index] === 'X' && (
          <motion.img
            src={X}
            alt="Mario X"
            className="h-12 w-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        {board[index] === 'O' && (
          <motion.img
            src={O}
            alt="Luigi O"
            className="h-12 w-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center  bg-secondary p-4"
    >
      {winner && <Confetti />}

      {/* Game Result */}
      <div className="shadow-[0_5px_0_0_var(--dark-color)] fixed top-4 right-4 bg-primary text-black border-2 border-black p-4 rounded-lg font-secondary">
        {winner ? (
          <div>
            Winner: {winner === 'X' ? 'X': 'O'}
          </div>
        ) : isDraw ? (
          <div>It's a Draw!</div>
        ) : null}
      </div>

      {/* Header */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          onClick={resetGame}
        >
          Another Round?
        </Button>
      </div>

      {/* Game Board */}
      <div className="shadow-[0_5px_0_0_var(--dark-color)] border-2 border-black rounded-xl p-6 bg-primary">
        <h2 className="text-3xl text-black text-center font-bold mb-4">Tic-Tac-Toe</h2>
        <div className="grid grid-cols-3 gap-4">
          {board.map((_, index) => renderSquare(index))}
        </div>
      </div>

      {/* Next Move */}
      <div className=" bg-primary rounded border-black border-2 p-3 flex items-center mt-6">
        <div className='flex items-center gap-2 font-secondary text-2xl text-black'>
          <div>Next move: </div> {isXNext ? <img src="/images/x.gif" className="w-10 h-10" alt="" /> : <img src="/images/o.gif" className="w-10 h-10" alt="" />}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;