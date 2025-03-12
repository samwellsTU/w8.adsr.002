ADSR Envelope in Web Audio API

This repot covers the implementation of an **ADSR (Attack, Decay, Sustain, Release) envelope** in the Web Audio API. We'll modify the amplitude envelope (`ampEnv.gain`) of an oscillator to shape its dynamics over time.

---

## ADSR Parameters

We define the standard ADSR components as follows:

```javascript
let attack = 0.02;
let decay = 0.02;
let sustain = 0.5;
let release = 1.0;
```

Additionally, set the initial amplitude envelope gain value to `0.0`:

```javascript
ampEnv.gain.value = 0.0;
```

---

## Implementing the ADSR Envelope

### Attack Component in `startNote()`

```javascript
// Saves the current time reference
let now = thisAudio.currentTime;

// Loads the correct starting value for the ramp
ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);

// Increases gain from 0 to 1.0 over the attack duration
ampEnv.gain.linearRampToValueAtTime(1.0, now + attack);
```

### Decay Component in `startNote()`

```javascript
// Decreases gain to the sustain level after attack phase
ampEnv.gain.linearRampToValueAtTime(sustain, now + attack + decay);
```

### Release Component in `stopNote()`

```javascript
// Ensures smooth release when stopping the note
ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);
ampEnv.gain.linearRampToValueAtTime(0.0, now + release);
```

---

## Handling Premature Stops and Restarts

To avoid unexpected behavior when stopping and restarting notes quickly, we cancel scheduled changes:

```javascript
// In playNote()
ampEnv.gain.cancelScheduledValues(now);

// In stopNote()
ampEnv.gain.cancelScheduledValues(now);
```

---

## Stopping the Oscillator

The oscillator can be scheduled to stop slightly after the release phase:

```javascript
myOsc.stop(now + release + 0.01);
```

---

## Handling `onended` for Cleanup

The oscillator's `.onended` property can store a function that runs when the oscillator stops, ensuring proper disconnection:

```javascript
const endOsc = function(){
    myOsc.disconnect();
    myOsc = null;
};

// Assign to oscillator in playNote()
myOsc.onended = endOsc;
```

---

## Summary

- **Defined ADSR parameters** to control amplitude dynamics.
- **Implemented attack, decay, and release phases** in Web Audio API.
- **Handled premature stopping/restarting** by canceling scheduled changes.
- **Scheduled oscillator stop** and used `onended` for cleanup.

This approach ensures a **smooth, natural envelope for synthesizer sounds**, preventing abrupt cuts and unwanted behaviors.

---

## Next Steps

- Experiment with different **ADSR values** to hear their impact.
- Extend this concept by applying ADSR to **filter or frequency modulation**.
