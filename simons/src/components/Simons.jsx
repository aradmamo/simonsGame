import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../style.css";
export default function Simons() {
  const [sequence, setSequence] = useState([]);
  let [gameCounter, setGameCounter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [level, setLevel] = useState(1);
  const saveHighScore = () => {
    axios
      .post("http://localhost:3000/newScore", {
        score: level,
      })
      .then(
        () =>
          (document.querySelector(".highScoreSaved").innerHTML = "New Record")
      );
  };
  const colors = ["green", "red", "blue", "yellow"];
  const greenSound = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
  );
  greenSound.preload = "auto";
  const redSound = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
  );
  redSound.preload = "auto";
  const blueSound = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
  );
  blueSound.preload = "auto";
  const yellowSound = new Audio(
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  );
  yellowSound.preload = "auto";
  useEffect(() => {
    let timeoutIds = [];
    sequence.forEach((color, index) => {
      const timeoutId = setTimeout(() => {
        setIsPlaying(true);
        const colorButton = document.getElementById(`color-button-${color}`);
        if (colorButton) {
          colorButton.classList.add("active");
          timeoutIds.push(
            setTimeout(() => {
              colorButton.classList.remove("active");
              setIsPlaying(false);
            }, 500)
          );
        }
      }, (index + 1) * 1000);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [sequence]);
  const handleStart = () => {
    document.querySelector(".highScoreSaved").innerHTML = "";
    const staus = document.querySelector(".status");
    staus.innerHTML = "Running";
    const curSequenceItem = generateSequence(4);
    const newSequence = [curSequenceItem[0]];
    setSequence(newSequence);
    displayColorSequence();
    if (sequence.length < 1) {
      setTimeout(() => {
        switch (curSequenceItem[0]) {
          case "green":
            greenSound.play();
            break;
          case "red":
            redSound.play();
            break;
          case "blue":
            blueSound.play();
            break;
          case "yellow":
            yellowSound.play();
            break;
          default:
            break;
        }
      }, 1000);
    }
  };
  const displayColorSequence = async () => {
    let delay;
    for (let i = 0; i < sequence.length; i++) {
      const colorButton = document.getElementById(
        `color-button-${sequence[i]}`
      );
      if (colorButton) {
        setIsPlaying(true);
        function active() {
          setTimeout(() => {
            music();
            colorButton.classList.add("active");
          }, delay);
          setTimeout(() => {
            colorButton.classList.remove("active");
          }, delay + 500);
        }
        function music() {
          if (colorButton.classList.contains("yellow")) {
            yellowSound.play();
          } else if (colorButton.classList.contains("green")) {
            greenSound.play();
          } else if (colorButton.classList.contains("red")) {
            redSound.play();
          } else {
            blueSound.play();
          }
        }

        setLevel(sequence.length);

        if (sequence.length >= 3) {
          delay = (i + 1) * 750;
          active();
        } else if (sequence.length >= 5) {
          delay = (i + 1) * 400;
          active();
        } else if (sequence.length >= 7) {
          delay = (i + 1) * 300;
          active();
        } else if (sequence.length >= 10) {
          delay = (i + 1) * 220;
          active();
        } else if (sequence.length >= 15) {
          delay = (i + 1) * 130;
          active();
        } else {
          delay = (i + 1) * 800;
          active();
        }
      }
    }
    setTimeout(() => {
      setIsPlaying(false);
    }, (sequence.length + 1) * 900);
  };
  const clickColor = async (color) => {
    if (isPlaying) {
      return;
    }
    document.querySelector(`.${color}`).classList.add("active");
    setTimeout(() => {
      document.querySelector(`.${color}`).classList.remove("active");
    }, 200);
    switch (color) {
      case "green":
        greenSound.play();
        break;
      case "red":
        redSound.play();
        break;
      case "blue":
        blueSound.play();
        break;
      case "yellow":
        yellowSound.play();
        break;
      default:
        break;
    }
    if (color === sequence[gameCounter]) {
      if (gameCounter == sequence.length - 1) {
        setGameCounter(0);
        const curSequenceItem = generateSequence(4);
        sequence.push(curSequenceItem[0]);

        setTimeout(displayColorSequence, 1000);
      } else setGameCounter(gameCounter + 1);
    } else {
      setIsPlaying(true);
      setGameCounter(0);
      setSequence([]);
      setLevel(1);
      document.querySelector(".status").innerHTML = "Game Over";
      document.querySelector(".status").style.color = "red";
      saveHighScore();
    }
  };

  const stopGame = () => {
    const status = document.querySelector(".status");
    status.innerHTML = "Game Over";
    status.style.color = "red";
    setSequence([]);
    setGameCounter(0);
    setLevel(1);
  };

  function generateSequence(length) {
    const order = [];
    const randomIndex = Math.floor(Math.random() * colors.length);
    order.push(colors[randomIndex]);

    return order;
  }
  return (
    <div className="cont">
      <div className="d-flex flex-row content">
        <h2 className="status">Waiting...</h2>
        <h2 className="highScoreSaved"></h2>
      </div>
      <div className="simonsGame  ">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`${color} ${
              index <= gameCounter.length ? "active" : ""
            }`}
            id={`color-button-${color}`}
            onClick={() => clickColor(color)}
          ></div>
        ))}
      </div>
      <div className="control  ">
        <button className="startGame" onClick={handleStart}>
          start
        </button>

        <p className="level">
          Lv. <span className="text-success">{level}</span>
        </p>
      </div>
    </div>
  );
}
