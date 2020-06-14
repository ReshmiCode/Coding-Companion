import React, { useState } from "react";
import isElectron from "is-electron";
import { Link } from "react-router-dom";
import "./App.css";
import Speech from "speak-tts";
import Speechy from "./Speech2text";
import Modal from "./Modal";
//const { shell } = require('electron');

const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");

var styles = {
  button: {
    width: 120,
    height: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#5295c7",
    border: "none",
    color: "#07002c",
  },
  field: {
    borderRadius: 20,
    width: 200,
    height: 40,
    border: "none",
    backgroundColor: "#d4eaf9",
  },
};

function MainApp() {
  const [user, setUser] = useState("");
  const [quizQues, setQuizQues] = useState(-1);
  const [commits, setCommits] = useState(null);
  const [debugNumb, setDebugNumb] = useState(0);
  const [text, setText] = useState("");

  async function callbackFunction(childData) {
    callMatchingFunction(childData);
  }

  //Check if speech is available
  const speech = new Speech();
  if (speech.hasBrowserSupport()) {
    console.log("speech synthesis supported");
  }
  //Initalize speech with voice
  speech
    .init({
      volume: 1,
      lang: "en-US",
      rate: 1,
      pitch: 1,
      voice: "Samantha",
      splitSentences: true,
    })
    .catch((e) => {
      console.error("An error occured while initializing : ", e);
    });

  function openWebsiteInBrower() {
    console.log("Website");
    //shell.openExternal("https://github.com/ReshmiCode/Coding-Companion");
  }

  async function callMatchingFunction(message) {
    console.log(message);
    console.log(isElectron());
    if (message.includes("hello") || message.includes("hi"))
      await textToSpeech("Quack, hey there friend!");
    else if (message.includes("joke")) getJoke();
    else if (message.includes("programming quote")) getProgrammingQuote();
    else if (
      message.includes("inspirational quote") ||
      message.includes("inspiration") ||
      message.includes("inspire")
    )
      getQuote();
    else if (message.includes("fact")) getFact();
    else if (message.includes("advice")) giveAdvice();
    else if (message.includes("question") || message.includes("quiz"))
      getQuestion();
    else if (
      message.includes("commits") ||
      message.includes("commit") ||
      message.includes("github")
    )
      getCommits();
    else if (message.includes("answer")) checkAnswer(message);
    else if (
      message.includes("help") ||
      message.includes("debug") ||
      message.includes("next")
    )
      getHelp();
    else if (message.includes("fix") || message.includes("thank you"))
      endHelp();
    else if (message.includes("quack")) await textToSpeech("Quack to you too");
    else if (message.length > 1)
      await textToSpeech("Quack I'm just a duck I don't understand!");
  }

  async function textToSpeech(text) {
    speech
      .speak({
        text: text,
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  }

  async function getHelp() {
    await textToSpeech(CODINGQUES[debugNumb]);
    const nextIndex = debugNumb + 1;
    if (nextIndex === CODINGQUES.length) setDebugNumb(0);
    else setDebugNumb(nextIndex);
  }

  async function endHelp() {
    await textToSpeech(
      "Glad to help, that was a very productive coding session! Nice work!"
    );
    setDebugNumb(0);
  }

  async function getCommits() {
    const commits = await axios.get(
      `https://api.github.com/users/${user}/events`
    );
    const push = _.filter(commits.data, { type: "PushEvent" });
    const today = _.filter(push, (obj) =>
      moment(obj.created_at).isSame(moment(), "day")
    );
    let count = 0;
    _.forEach(today, (obj) => {
      count += obj.payload.commits.length;
    });

    setCommits(count);
    await textToSpeech("You made " + count + " commits today");
  }

  async function handleChange(event) {
    setUser(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await getCommits();
  }

  async function getJoke() {
    const { data } = await axios.get(
      "https://official-joke-api.appspot.com/jokes/programming/random"
    );
    setText(data[0].setup + "\n - " + data[0].punchline);
    await textToSpeech(data[0].setup);
    await textToSpeech(data[0].punchline);
  }

  async function getProgrammingQuote() {
    const { data } = await axios.get(
      "http://quotes.stormconsultancy.co.uk/random.json"
    );
    setText(data.quote + "\n - " + data.author);
    await textToSpeech(data.quote);
    await textToSpeech(data.author);
  }

  async function getQuote() {
    const { data } = await axios.get("http://api.quotable.io/random");
    setText(data.content + "\n - " + data.author);
    await textToSpeech(data.content);
    await textToSpeech(data.author);
  }

  async function getQuestion() {
    const index = Math.floor(Math.random() * PROGQUES.length);
    setQuizQues(index);
    setText(PROGQUES[index].question);
    await textToSpeech(PROGQUES[index].question);
  }

  async function checkAnswer(message) {
    const words = message.split(" ");
    if (words.indexOf("a") != -1) {
      if (PROGQUES[quizQues].answer === "a")
        await textToSpeech("Correct answer!");
      else
        await textToSpeech(
          "Incorrect answer. The right answer was " + PROGQUES[quizQues].answer
        );
    }
    if (words.indexOf("b") != -1) {
      if (PROGQUES[quizQues].answer === "b")
        await textToSpeech("Correct answer!");
      else
        await textToSpeech(
          "Incorrect answer. The right answer was " + PROGQUES[quizQues].answer
        );
    }
    if (words.indexOf("c") != -1) {
      if (PROGQUES[quizQues].answer === "c")
        await textToSpeech("Correct answer!");
      else
        await textToSpeech(
          "Incorrect answer. The right answer was " + PROGQUES[quizQues].answer
        );
    }
    if (words.indexOf("d") != -1) {
      if (PROGQUES[quizQues].answer === "d")
        await textToSpeech("Correct answer!");
      else
        await textToSpeech(
          "Incorrect answer. The right answer was " + PROGQUES[quizQues].answer
        );
    }
  }

  async function getFact() {
    const index = Math.floor(Math.random() * PROGFACTS.length);
    setText(PROGFACTS[index].fact);
    await textToSpeech(PROGFACTS[index].fact);
  }

  async function giveAdvice() {
    const { data } = await axios.get("https://api.adviceslip.com/advice");
    setText(data.slip.advice + "\n - Your code companion");
    await textToSpeech(data.slip.advice);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Modal user={user} changeUser={handleChange} />
        <Speechy parentCallback={callbackFunction} />
        <p> Ducky ^_^ </p>
        <button style={styles.button} onClick={getCommits}>
          Get Commits
        </button>
        {commits && <p> {commits} Commits Today</p>}

        <button style={styles.button} onClick={getJoke}>
          Joke
        </button>
        <button style={styles.button} onClick={getProgrammingQuote}>
          Programming Quote
        </button>
        <button style={styles.button} onClick={getQuote}>
          Inspirational Quote
        </button>
        <button style={styles.button} onClick={getQuestion}>
          Programming Question
        </button>
        <button style={styles.button} onClick={giveAdvice}>
          Advice
        </button>
        <button style={styles.button} onClick={getFact}>
          Programming Fact
        </button>
        {isElectron() ? (
          <button onClick={openWebsiteInBrower}>
            {" "}
            View Website in Browser{" "}
          </button>
        ) : (
          <Link to="/">
            <button style={styles.button}> Homepage </button>
          </Link>
        )}
      </header>
    </div>
  );
}

export default MainApp;

const CODINGQUES = [
  "Hello, let's get quacking! Can you describe the problem? Please use small sentences, I am only a duck.",
  "Can you explain what the function, object, or thing is that is not working?",
  "Is there any chance you could break this down into smaller parts?",
  "So does it just do one thing? Any chance you could test it seperately?",
  "Do you fully understand what it does? Do you need to research any parts?",
  "What parts of it are you certain work and what are your unknowns?",
  "Is it being compiled? Can you restart the complier or build?",
  "Could it, or the variables in it, be overriden?",
  "Sorry, my super-duck-powers have failed. Have you tried google or stack overflow? This debugging session will end.",
];

const PROGQUES = [
  {
    question:
      "What is a syntax error?A. An error due to incorrect logic. B. An error due to the language rules being broken. C. An error you will never find. D. An error caused by bad network connection.",
    answer: "b",
  },
  {
    question:
      "What is FIFO? A. First in Few Out. B. Fade in fade out. C. First in first out. D. False in fact out.",
    answer: "c",
  },
  {
    question:
      "What is a short section of code made to complete a task? A. A function. B. A buffer. C. An array. D. An variable.",
    answer: "a",
  },
  {
    question:
      "What data type holds a single letter or number? A. Word. B. Double. C. Integer. D. Character.",
    answer: "d",
  },
];

const PROGFACTS = [
  {
    fact:
      "The first programmer in the world was a woman. Her name was Ada Lovelace and she worked on an analytical engine back in the 1,800’s.",
  },
  {
    fact:
      "Recent studies have shown that over 70% of coding jobs are in fields outside of technology.",
  },
  {
    fact: "The first computer virus was created in 1983.",
  },
  {
    fact: "The first computer game was created in 1961.",
  },
  {
    fact:
      'The word computer "bug" was inspired by a real bug. It was founded by Grace Hopper in 1947.',
  },
  {
    fact:
      "Nowadays, there are over 700 different programming languages. All experts recommend for kids to start with a visual editor and a blockly based programming language for them to learn in a smoother and easier way.",
  },
  {
    fact:
      "The first programming language (per sé) was called Fortran, and it was created in the ’50s.",
  },
  {
    fact:
      "Almost any powered with electricity needs to be coded. Can you imagine?!",
  },
  {
    fact:
      "Since many programming languages share the same structure, it is easy for students to learn a new programming language once they have already mastered one before.",
  },
  {
    fact:
      "Computers run on binary code, which means that their software is written using only 1s and 0s.",
  },
  {
    fact:
      "Learning coding has stunning cognitive-related benefits, such as problem-solving, computational thinking, analytical thinking, creative thinking, leadership-related skills, and even teamwork.",
  },
  {
    fact:
      "In the near future knowing how to code will be as necessary as knowing how to write is today. Yes, regardless of the field or career your students decide for their future.",
  },
];
