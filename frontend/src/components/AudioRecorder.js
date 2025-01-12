import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg"; // Import FFmpeg
import { fetchFile, toBlobURL } from "@ffmpeg/util"; // Correct utility imports
import LoadingSpinner from "./LoadingSpinner"; 
import "./AudioRecorder.css";
const AudioRecorder = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioResponseUrl, setAudioResponseUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); 
  const mediaRecorderRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg());

  // ✅ Load FFmpeg Core
  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => console.log("FFmpeg Log:", message));

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    setIsLoaded(true);
  };

  // ✅ Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", async () => {
        const webmBlob = new Blob(audioChunks, { type: "audio/webm" });
        const mp3Blob = await convertWebmToMp3(webmBlob);
        await sendAudioToBackend(mp3Blob);
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // ✅ Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // ✅ Convert WebM to MP3
  const convertWebmToMp3 = async (webmBlob) => {
    const ffmpeg = ffmpegRef.current;
    const webmFile = await fetchFile(webmBlob);

    await ffmpeg.writeFile("input.webm", webmFile);
    await ffmpeg.exec(["-i", "input.webm", "output.mp3"]);
    const mp3Data = await ffmpeg.readFile("output.mp3");

    return new Blob([mp3Data.buffer], { type: "audio/mp3" });
  };

  // ✅ Send MP3 to Backend
  const sendAudioToBackend = async (mp3Blob) => {
    try {
        
        setIsProcessing(true); 
        const formData = new FormData();
        formData.append("audio", mp3Blob, "recording.mp3");

      const response = await fetch("http://localhost:5000/api/process-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.audioUrl) {
        const backendAudioUrl = `http://localhost:5000/${data.audioUrl}`;
        setAudioResponseUrl(backendAudioUrl);
        playAudio(backendAudioUrl);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }  
    finally {
        setIsProcessing(false); 
    }
  };

  // ✅ Play Backend Audio
  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play();
  };
  return (
    <div className="App">
      <h1>TaskPilot AI Voice Assistant</h1>

      {isProcessing ? (
        // ✅ Show the spinner if processing is happening
        <LoadingSpinner message="Processing your request... Please wait." />
      ) : isLoaded ? (
        <>
          <button onMouseDown={startRecording} onMouseUp={stopRecording}>
            {isRecording ? "Recording..." : "Hold to Record"}
          </button>
        </>
      ) : (
        <button onClick={loadFFmpeg}>Share Your Query With Us!</button>
      )}
    </div>
  );
};


export default AudioRecorder;
