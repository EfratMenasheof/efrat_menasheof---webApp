"use client";

import { useState } from "react";
import styles from "./page.module.css";

function Square({ value, onClick }) {
  return (
    <button className={styles.square} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay }) {
  function handleClick(i) {
    onPlay(i);
  }

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
      />
    );
  }

  return (
    <div className={styles.board}>
      <div className={styles.row}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.row}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.row}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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

  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToePage() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isBoardFull = squares.every((sq) => sq !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isBoardFull
    ? "Draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function handlePlay(i) {
    if (squares[i] || winner) return; // לא נותנים לשחק אחרי שיש מנצח או על תא תפוס
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
      <Board squares={squares} onPlay={handlePlay} />
      <div className={styles.info}>
        <span>{status}</span>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    </main>
  );
}
