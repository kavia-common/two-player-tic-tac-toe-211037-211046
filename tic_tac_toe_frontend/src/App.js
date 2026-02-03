import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Calculates a win result (if any) for a given board.
 * Returns null if there is no winner yet.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, isWinning, isDisabled }) {
  /** A single square button on the Tic Tac Toe board. */
  return (
    <button
      type="button"
      className={[
        "ttt-square",
        value ? "ttt-square--filled" : "",
        isWinning ? "ttt-square--winning" : "",
      ].join(" ")}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      <span className="ttt-square__mark" aria-hidden="true">
        {value}
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onPlay, winningLine, isGameOver }) {
  /** Renders the 3x3 board and handles square click events. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onPlay(idx)}
          isWinning={Boolean(winningLine && winningLine.includes(idx))}
          isDisabled={isGameOver || Boolean(value)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Status({ winner, isDraw, nextPlayer }) {
  /** Displays the current game state: whose turn, winner, or draw. */
  const text = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw game";
    return `Next player: ${nextPlayer}`;
  }, [winner, isDraw, nextPlayer]);

  return (
    <div
      className={[
        "ttt-status",
        winner ? "ttt-status--winner" : "",
        isDraw ? "ttt-status--draw" : "",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main app component: orchestrates game state and renders layout. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winResult = useMemo(() => calculateWinner(squares), [squares]);
  const winner = winResult?.winner ?? null;
  const winningLine = winResult?.line ?? null;

  const isBoardFull = squares.every((s) => s !== null);
  const isDraw = !winner && isBoardFull;
  const isGameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handlePlay = (idx) => {
    /** Applies a move to the selected square index if valid. */
    if (isGameOver) return;
    if (squares[idx]) return;

    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((v) => !v);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Resets the game state to the initial empty board. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-shell">
        <section className="ttt-card" aria-label="Tic Tac Toe game">
          <header className="ttt-header">
            <div className="ttt-titleRow">
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <div className="ttt-badge" aria-hidden="true">
                2P LOCAL
              </div>
            </div>
            <p className="ttt-subtitle">
              Take turns on the same device. First to get three in a row wins.
            </p>
          </header>

          <Status
            winner={winner}
            isDraw={isDraw}
            nextPlayer={xIsNext ? "X" : "O"}
          />

          <Board
            squares={squares}
            onPlay={handlePlay}
            winningLine={winningLine}
            isGameOver={isGameOver}
          />

          <div className="ttt-actions">
            <button
              type="button"
              className="ttt-btn"
              onClick={handleRestart}
              aria-label="Restart game"
            >
              Restart
            </button>

            <div className="ttt-hint" aria-hidden="true">
              Tip: Winning line glows.
            </div>
          </div>
        </section>

        <footer className="ttt-footer">
          Built with React • No backend • Retro vibes
        </footer>
      </main>
    </div>
  );
}

export default App;
