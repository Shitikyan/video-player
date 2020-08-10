import React from 'react';
import SampleVideo from './assets/RecordedVideo.webm';

const VideoPlayer = () => (
  <video src={SampleVideo} controls>
    <p>
      Your browser doesn't support HTML5 video. Here is a{' '}
      <a href="rabbit320.webm">link to the video</a> instead.
    </p>
  </video>
);

export default VideoPlayer;
