import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";

const TowerOfHanoi = () => {
  const [disks, setDisks] = useState(3);
  const [towers, setTowers] = useState([
    Array.from({ length: 3 }, (_, i) => 3 - i),
    [],
    [],
  ]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(true);
  const [exceededMoves, setExceededMoves] = useState(false);
  const [draggedDisk, setDraggedDisk] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [hoveredTower, setHoveredTower] = useState(null);

  const minMoves = Math.pow(2, disks) - 1;

  useEffect(() => {
    document.title = 'Towers of Mario Hanoi';
  }, []);

  useEffect(() => {
    const isComplete = towers[2].length === disks;
    setIsSolved(isComplete);
    setExceededMoves(moves > minMoves);
  }, [towers, moves, disks]);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);


  useEffect(() => {
    let interval = null;

    if (isTimerRunning && !isSolved) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, isSolved]);

  const resetGame = () => {
    setTowers([Array.from({ length: disks }, (_, i) => disks - i), [], []]);
    setMoves(0);
    setIsSolved(false);
    setExceededMoves(false);
    setTimer(0);
    setIsTimerRunning(false);
    setErrorMessage(""); 
    setHoveredTower(null); 
  };

  const handleDragStart = (disk) => {
    setDraggedDisk(disk);
    if (!isTimerRunning && !isSolved) {
      setIsTimerRunning(true);
    }
  };

  const handleDrop = (to) => {
    if (draggedDisk === null || isSolved) return;

    const from = towers.findIndex((tower) => tower.includes(draggedDisk));

    if (
      from !== -1 &&
      (towers[to].length === 0 || towers[to][towers[to].length - 1] > draggedDisk)
    ) {
      const newTowers = towers.map((tower, index) => {
        if (index === from) {
          return tower.slice(0, -1);
        }
        if (index === to) {
          return [...tower, draggedDisk];
        }
        return tower;
      });
      setTowers(newTowers);
      setMoves(moves + 1);
      setErrorMessage(""); 
    } else {
      setErrorMessage("Invalid move! Disk is larger");
    }
    setDraggedDisk(null);
    setHoveredTower(null); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/images/2-bg.jpg')] bg-contain text-white relative">


      <div className="absolute top-0 left-0 w-full h-full bg-secondary z-1"></div>
      <div className="text-center mb-4 z-10 mt-20">
        <h1 className="text-4xl font-secondary text-black">Towers of Mario Hanoi</h1>
        <div className="flex gap-4 items-center justify-center">
          <p className="text-lg text-black font-secondary">Number of disks:</p>
          <input
            type="number"
            value={disks}
            min={3}
            max={5}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setDisks(num);
              setTowers([Array.from({ length: num }, (_, i) => num - i), [], []]);
              setMoves(0);
              setIsSolved(false);
              setExceededMoves(false);
              setTimer(0);
              setIsTimerRunning(false);
              setErrorMessage("");
            }}
            className="text-center border-none border-black rounded-md p-2 bg-transparent text-black"
          />
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-start w-full max-w-4xl">
        <div className="bg-primary border-2 border-black h-10 w-full absolute bottom-[-39px]"></div>
        {towers.map((tower, i) => (
          <div
            key={i}
            className="w-40 flex justify-center"
            onDragOver={(e) => {
              e.preventDefault();
              setHoveredTower(i); 
            }}
            onDrop={() => handleDrop(i)}
            onDragLeave={() => setHoveredTower(null)} 
          >
            <div
              className={`flex flex-col items-center justify-end relative h-64 w-[30px] bg-primary border-2 border-black border-b-0 ${hoveredTower === i ? "bg-slate-400" : ""}`}
            >
              {tower.map((disk, index) => (
                <motion.div
                  key={disk}
                  className={` absolute bg-secondary border-2 text-black font-bold text-center border-black rounded-md cursor-grab ${
                    draggedDisk === disk ? "opacity-50" : "opacity-100"
                  }`}
                  draggable={index === tower.length - 1}
                  onDragStart={() => handleDragStart(disk)}
                  style={{
                    width: `${40 + disk * 20}px`,
                    height: "24px",
                    bottom: `${index * 26}px`,
                    left: `calc(50% - ${(40 + disk * 20) / 2}px)`,
                  }}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="z-10 flex mt-14 gap-5">
        <Button
          variant="primary"
          onClick={resetGame}
          className="px-6 py-2 text-black rounded-md hover:bg-red-600 transition-all duration-300"
        >
          Reset
        </Button>
        <div className="flex gap-5 absolute top-10 right-10 font-secondary">
          <p className={`text-lg font-bold ${exceededMoves ? "text-red-500" : "text-black"}`}>
            Moves: {moves}
          </p>
          <p className="text-lg font-bold text-black">Time: {timer}s</p>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="z-20 absolute top-16 right-5 text-lg text-red-600 font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSolved && (
          <motion.p
            className={`z-20 absolute top-10 right-5 mt-6 text-lg ${exceededMoves ? "text-yellow-600" : "text-green-600"} font-bold`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {exceededMoves
              ? "At least you did it, but with more moves than necessary!"
              : "Congratulations! You solved it!"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TowerOfHanoi;
