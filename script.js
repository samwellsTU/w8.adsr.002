// ADSR Params

let attack = 1; //attack time in seconds
let decay = 1; //decay  time in seconds
let sustain = 0.125; //sustain level in linear amplitude
let release = 0.5; // release  time in seconds

//----------WEB AUDIO CONTEXT-------------------
/**
 * Creates a new Web Audio API context for handling audio processing.
 * @type {AudioContext}
 */
const thisAudio = new AudioContext();

//----------WEB AUDIO NODES-------------------

/**
 * Placeholder variable for an oscillator node.
 * @type {OscillatorNode | null}
 */
let myOsc = null;

/**
 * Gain node for amplitude envelope control.
 * @type {GainNode}
 */
let ampEnv = thisAudio.createGain();
ampEnv.gain.value = 0.0;

/**
 * Master gain node to control overall volume.
 * @type {GainNode}
 */
let masterGain = thisAudio.createGain();
masterGain.gain.value = 0.5;

//---------CONNECTIONS--------------

ampEnv.connect(masterGain);
masterGain.connect(thisAudio.destination);

//---------FUNCTIONS--------------

/**
 * Creates and starts an oscillator with a triangle waveform at 220 Hz.
 * The oscillator is connected to the amplitude envelope gain node.
 */
const playNote = function (freq) {
  let now = thisAudio.currentTime;

  myOsc = thisAudio.createOscillator();

  myOsc.onended = function () {
    myOsc.disconnect(ampEnv);
    myOsc = null;
    console.log("Hey the oscillator stopped");
  };

  myOsc.frequency.value = freq;
  myOsc.type = "triangle";
  myOsc.connect(ampEnv);
  myOsc.start();

  //clear ramps
  ampEnv.gain.cancelScheduledValues(now);
  //loads correct starting value for ramp
  ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);

  //attack
  ampEnv.gain.linearRampToValueAtTime(1, now + attack);

  //decay
  ampEnv.gain.linearRampToValueAtTime(sustain, now + attack + decay);
};

/**
 * Stops and disconnects the active oscillator.
 */
const stopNote = function () {
  let now = thisAudio.currentTime;
  //clear ramps
  ampEnv.gain.cancelScheduledValues(now);
  //loads correct starting value for ramp
  ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);
  //release
  ampEnv.gain.linearRampToValueAtTime(0, now + release);

  myOsc.stop(now + release + 0.01);
};

//---------EVENT LISTENERS--------------

/**
 * Button to start playing the note.
 * @type {HTMLElement}
 */
let startButton = document.getElementById("start");

/**
 * Button to stop playing the note.
 * @type {HTMLElement}
 */
let stopButton = document.getElementById("stop");

// Add event listeners to buttons
startButton.addEventListener("click", playNote);
stopButton.addEventListener("click", stopNote);

let isPlaying = false;

document.addEventListener("keydown", function (event) {
  if (!isPlaying) {
    if (event.key == "a") {
      playNote(261.36);
      isPlaying = true;
    } else if (event.key == "s") {
      playNote(295.36);
      isPlaying = true;
    } else if (event.key == "d") {
      playNote((261.63 * 5) / 4);
      isPlaying = true;
    } else if (event.key == "w") {
      playNote((261.63 * 16) / 15);
      isPlaying = true;
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (isPlaying) {
    if (event.key == "a") {
      stopNote();
      isPlaying = false;
    } else if (event.key == "s") {
      stopNote();
      isPlaying = false;
    } else if (event.key == "d") {
      stopNote();
      isPlaying = false;
    } else if (event.key == "w") {
      stopNote();
      isPlaying = false;
    }
  }
});
