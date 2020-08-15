import React from 'react';
import ReactPlayer from 'react-player';

import './VideoPlayer.scss';

/**
 * @summary Represents video player component.
 *
 * @param {string} url Video url. Required.
 * @param {number} [volume=1] Initial volume value. Defaults to 1.
 * @param {number} [volumeDelta=0.1] Valume change rate. Defaults to 0.1.
 * @param {number} [changeDelta=5] Video backward/forward change rate. Defaults to 5.
 * @param {boolean} [muted=false] Is video muted initially. Defaults to false.
 * @param {boolean} [controls=false] Indicates if video default controls will be shown. Defaults to false.
 *
 * @fires onPlay Fired when video starts playing.
 * @fires onPause Fired when video paused.
 * @fires onMuted Fired when video muted.
 * @fires onUnmuted Fired when video unmuted.
 * @fires onRestart Fired when video restarts.
 * @fires onEnded Fired when video ends.
 * @fires onTimeChanged Fired when backward or forward is requested.
 * @fires onVolumeChange Fired when volume increased or decreased.
 */
export default class VideoPlayer extends React.Component {
  constructor(options) {
    super(options);
    if (!Boolean(options.url)) {
      console.error('[video-player] Url prop is required.');
    }

    if (!ReactPlayer.canPlay(options.url)) {
      console.error(
        '[video-player] Unable to play video by the url specidifed.'
      );
    }

    this.$player = React.createRef();
    this.VOLUME__DELTA__DEFAULT = 0.1;
    this.VIDEO__DELTA__DEFAULT = 5;
    this.playerInternal = null;

    this.state = {
      playing: false,
      url: options.url,
      volume: options.volume ?? 1,
      muted: Boolean(options.muted),
    };
  }

  /**
   * Starts playing video.
   */
  play() {
    this.setState({ playing: true });
  }

  /**
   * Pausing video.
   */
  pause() {
    this.setState({ playing: false });
  }

  /**
   * Restarts video.
   */
  restart() {
    this.$player.current.seekTo(0, 'seconds');
    this.setState({
      playing: true,
    });

    this.emitEvent('onRestart');
  }

  /**
   * Internal usage.
   */
  end() {
    this.emitEvent('onEnded');
  }

  /**
   * Mutes video volume.
   */
  mute() {
    this.setState({ muted: true });
    this.emitEvent('onMuted');
  }

  /**
   * Unmutes video volume.
   */
  unmute() {
    this.setState({ muted: false });
    this.emitEvent('onUnmuted');
  }

  /**
   * Forwards video.
   */
  forward() {
    this.changeCurrentTime(this.changeDelta);
  }

  /**
   * Backwards video.
   */
  backward() {
    this.changeCurrentTime(-this.changeDelta);
  }

  /**
   * Internal usage.
   */
  changeCurrentTime(n) {
    this.getPlayerInternal.currentTime += n;
    this.emitEvent('onTimeChanged', this.getPlayerInternal.currentTime);
  }

  /**
   * Increases volume.
   */
  increaseVolume() {
    this.changeVolume(this.volumeDelta);
  }

  /**
   * Increases volume.
   */
  decreaseVolume() {
    this.changeVolume(-this.volumeDelta);
  }

  /**
   * Internal usage.
   * Fires when volume was changed by hand.
   */
  volumeChanged() {
    this.emitEvent('onVolumeChange', this.getPlayerInternal.volume);
  }

  /**
   * Internal usage.
   */
  changeVolume(n) {
    let nextValue = Number((this.getPlayerInternal.volume + n).toFixed(1));

    if (nextValue > 1) nextValue = 1;
    else if (nextValue < 0) nextValue = 0;

    this.setState({ volume: nextValue });
  }

  /**
   * Internal usage.
   */
  emitEvent(type, ...args) {
    if (this.props[type]) {
      this.props[type](...args);
    }
  }

  get getPlayerInternal() {
    if (!Boolean(this.playerInternal)) {
      this.playerInternal = this.$player.current.getInternalPlayer();
    }

    return this.playerInternal;
  }

  /**
   * Internal usage.
   */
  get volumeDelta() {
    if (this.props.volumeDelta) {
      return this.props.volumeDelta;
    }

    return this.VOLUME__DELTA__DEFAULT;
  }

  /**
   * Internal usage.
   */
  get changeDelta() {
    if (this.props.changeDelta) {
      return this.props.changeDelta;
    }

    return this.VIDEO__DELTA__DEFAULT;
  }

  /**
   * Internal usage.
   */
  eventProxy(handler, eventType, ...eventArgs) {
    return () => {
      handler();
      this.emitEvent(eventType, ...eventArgs);
    };
  }

  render() {
    const { url, volume, playing, muted } = this.state;
    const { controls, className } = this.props;

    return (
      <ReactPlayer
        controls={controls}
        className={className ?? null}
        ref={this.$player}
        url={url}
        volume={volume}
        playing={playing}
        muted={muted}
        onPlay={this.eventProxy(this.play.bind(this), 'onPlay')}
        onPause={this.eventProxy(this.pause.bind(this), 'onPause')}
        onEnded={this.eventProxy(this.end.bind(this), 'onEnded')}
        onVolumeChange={this.volumeChanged.bind(this)}
        width="100%"
        height="100%"
        config={{
          file: {
            forceVideo: true,
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
      />
    );
  }
}
