import React, { useState } from 'react';
import { useRef } from 'react';
import VideoPlayer from '../video-player';
import SampleVideo from './assets/y2mate.com.mp4';

import './Demo.scss';

const Demo = () => {
  const $videoRef = useRef(null);
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(250);

  const onPlay = () => console.log('Video starts playing.');
  const onPause = () => console.log('Video paused.');
  const onMuted = () => console.log('Video muted');
  const onUnmuted = () => console.log('Video unmuted.');
  const onRestart = () => console.log('Video restarted.');
  const onEnded = () => console.log('Video ended.');
  const onTimeChanged = (n) =>
    console.log(`Video current time changed. Value ${n}`);
  const onVolumeChange = (n) => console.log(`Video volume changed. Value ${n}`);

  return (
    <div>
      <button onClick={() => $videoRef.current.play()}>Play</button>
      <button onClick={() => $videoRef.current.pause()}>Pause</button>
      <button onClick={() => $videoRef.current.restart()}>Restart</button>
      <button onClick={() => $videoRef.current.mute()}>Mute</button>
      <button onClick={() => $videoRef.current.unmute()}>Unmute</button>
      <button onClick={() => $videoRef.current.forward()}>Forward</button>
      <button onClick={() => $videoRef.current.backward()}>Backward</button>
      <button onClick={() => $videoRef.current.increaseVolume()}>
        Increase Volume
      </button>
      <button onClick={() => $videoRef.current.decreaseVolume()}>
        Decrease Volume
      </button>
      <button
        onClick={() => {
          setWidth((oldState) => oldState + 100);
          setHeight((oldState) => oldState + 100);
        }}
      >
        Make container larger
      </button>
      <button
        onClick={() => {
          setWidth((oldState) => oldState - 100);
          setHeight((oldState) => oldState - 100);
        }}
      >
        Make container smaller
      </button>

      <div style={{ width: width, height: height }}>
        <VideoPlayer
          className="example-name"
          ref={$videoRef}
          url={SampleVideo}
          volumeDelta={0.25}
          changeDelta={15}
          onPlay={onPlay.bind(this)}
          onPause={onPause.bind(this)}
          onMuted={onMuted.bind(this)}
          onUnmuted={onUnmuted.bind(this)}
          onRestart={onRestart.bind(this)}
          onEnded={onEnded.bind(this)}
          onTimeChanged={onTimeChanged.bind(this)}
          onVolumeChange={onVolumeChange.bind(this)}
        />
      </div>
    </div>
  );
};

export default Demo;
