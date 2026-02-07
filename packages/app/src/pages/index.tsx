import { NextPage } from 'next';
import { useState } from 'react';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

interface Move {
  player: Player;
  idx: number;
}

interface WinResult {
  player: Player;
  cells: number[];
}

const HomePage: NextPage = () => {
  const WIN: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [board, setBoard] = useState<Board>(new Array(9).fill(null));
  const [current, setCurrent] = useState<Player>('X');
  const [history, setHistory] = useState<{ X: number[]; O: number[] }>({
    X: [],
    O: [],
  });
  const [moves, setMoves] = useState<Move[]>([]);
  const [winner, setWinner] = useState<WinResult | null>(null);

  const checkWinner = (b: Board): WinResult | null => {
    for (const combo of WIN) {
      const [a, bb, cc] = combo;
      if (b[a] && b[a] === b[bb] && b[a] === b[cc]) {
        return { player: b[a], cells: combo };
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    const newHistory = { X: [...history.X], O: [...history.O] };
    const newMoves = [...moves];

    // Add new move
    newBoard[i] = current;
    newHistory[current].push(i);
    newMoves.push({ player: current, idx: i });

    // If > 3 marks, remove oldest
    if (newHistory[current].length > 3) {
      const removed = newHistory[current].shift()!;
      newBoard[removed] = null;

      // Remove from move history
      for (let k = newMoves.length - 1; k >= 0; k--) {
        if (newMoves[k].player === current && newMoves[k].idx === removed) {
          newMoves.splice(k, 1);
          break;
        }
      }
    }

    const w = checkWinner(newBoard);

    setBoard(newBoard);
    setHistory(newHistory);
    setMoves(newMoves);
    setWinner(w);

    if (!w) setCurrent(current === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(new Array(9).fill(null));
    setHistory({ X: [], O: [] });
    setMoves([]);
    setCurrent('X');
    setWinner(null);
  };

  const undo = () => {
    if (moves.length === 0 || winner) return;

    const newBoard = [...board];
    const newHistory = { X: [...history.X], O: [...history.O] };
    const newMoves = [...moves];

    const last = newMoves.pop()!;
    if (newBoard[last.idx] === last.player) newBoard[last.idx] = null;

    const arr = newHistory[last.player];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === last.idx) {
        arr.splice(i, 1);
        break;
      }
    }

    setBoard(newBoard);
    setHistory(newHistory);
    setMoves(newMoves);
    setCurrent(last.player);
    setWinner(null);
  };

  // Find the soon-to-disappear index for current player
  const aboutToDisappear =
    history[current].length >= 3 ? history[current][0] : null;

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-6">
      <div className="card bg-base-100 w-full max-w-sm p-4 shadow-xl">
        <h1 className="mb-2 text-center text-xl font-bold">T3 - Tic-Tac-Toe</h1>
        <p className="mb-4 text-sm opacity-70">
          Each player may have max <strong>3</strong> active marks. When placing
          the 4th, the <em>oldest</em> one disappears.
        </p>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {board.map((v, i) => {
            const isAboutToDisappear = i === aboutToDisappear;
            const isWin = winner?.cells.includes(i);

            // Color-coded marks
            const textColor =
              v === 'X' ? 'text-info' : v === 'O' ? 'text-error' : '';

            return (
              <div key={`${v}-${i}`} className="aspect-square w-full">
                <button
                  onClick={() => handleClick(i)}
                  className={`btn btn-square h-full w-full text-6xl transition-opacity duration-500 ${isWin ? 'btn-warning' : 'btn-neutral'} ${isAboutToDisappear ? 'opacity-30' : 'opacity-100'} ${textColor} `}>
                  {v}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            {winner ? (
              <div className="text-warning font-semibold">
                Winner: {winner.player}
              </div>
            ) : (
              <div>
                Current:{' '}
                <span className="text-info font-semibold">{current}</span>
              </div>
            )}
          </div>

          <div className="text-xs opacity-70">
            X moves: {history.X.join(', ') || '—'} <br />O moves:{' '}
            {history.O.join(', ') || '—'}
          </div>

          <div className="mb-3 flex gap-2">
            <button onClick={reset} className="btn btn-primary btn-sm">
              Reset
            </button>
            <button onClick={undo} className="btn btn-secondary btn-sm">
              Undo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
