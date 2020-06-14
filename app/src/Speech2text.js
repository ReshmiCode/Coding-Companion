"use strict";
import React, { Component } from "react";
import logo from "./logo.svg";
import duck from "./spritesheet.png";

import Spritesheet from "react-responsive-spritesheet";
//------------------------SPEECH RECOGNITION-----------------------------

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

//------------------------COMPONENT-----------------------------

class Speechy extends Component {
  constructor() {
    super();
    this.state = {
      listening: false,
      finalTranscript: "",
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
  }

  async sendData() {
    console.log("Sending to parent", this.state.finalTranscript);
    this.props.parentCallback(this.state.finalTranscript);
  }

  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening,
      },
      this.handleListen
    );
  }

  handleListen() {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        console.log("...continue listening...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped listening per click");
      };
    }

    recognition.onstart = () => {
      console.log("Listening!");
    };

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      document.getElementById("interim").innerHTML = interimTranscript;
      document.getElementById("final").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");
      const stopCmd = transcriptArr.slice(-3, -1);
      console.log("stopCmd", stopCmd);
      this.setState({ finalTranscript: finalTranscript });
      console.log("Final transcript", this.state.finalTranscript);
      this.sendData();

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();
        recognition.onend = () => {
          console.log("Stopped listening per command");
          const finalText = transcriptArr.slice(0, -3).join(" ");
          document.getElementById("final").innerHTML = finalText;
        };
      }
    };

    //-----------------------------------------------------------------------

    recognition.onerror = (event) => {
      console.log("Error occurred in recognition: " + event.error);
    };
  }

  render() {
    return (
      <div>
        <button id="microphone-btn" onClick={this.toggleListen}>
          <Spritesheet
            image={duck}
            widthFrame={780}
            heightFrame={607}
            steps={12}
            fps={8}
            direction={"forward"}
            autoplay={false}
            loop={true}
            isResponsive={true}
            onMouseOver={(spritesheet) => {
              spritesheet.play();
            }}
            onMouseOut={(spritesheet) => {
              spritesheet.pause();
            }}
          />
        </button>

        <div id="interim"></div>
        <div id="final"></div>
      </div>
    );
  }
}

export default Speechy;
