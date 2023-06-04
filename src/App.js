import { useEffect, useRef } from 'react';
import './App.css';

import videoSrc from './assets/video-test-2.mp4';

const FPS = 30;
let now;
let then = Date.now();
const INTERVAL = 1000 / FPS;
let delta;

function App() {

  const video = useRef(null);
  const canvas = useRef(null);
  const animation = useRef(null);

  useEffect(() => {
    if (video.current && canvas.current) {
      video.current.addEventListener('play', () => initCanvas());
      video.current.addEventListener('pause', () => cancelAnimationFrame(animation.current));
    }
  }, [video, canvas]);

  const initCanvas = () => {
    const ctx = canvas.current.getContext('2d');
    const { width, height } = video.current.getBoundingClientRect();
    const positionWidth = (window.innerWidth / 2) - (width / 2);
    const positionHeight = (window.innerHeight / 2) - (height / 2);

    draw({
      ctx,
      width,
      height,
      positionWidth,
      positionHeight
    });
  }

  const draw = ({ ctx, width, height, positionWidth, positionHeight }) => {
    animation.current = requestAnimationFrame(() => draw({
      ctx,
      width,
      height,
      positionWidth,
      positionHeight
    }));

    now = Date.now();
    delta = now - then;

    if (delta > INTERVAL) {
      then = now - (delta % INTERVAL);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.filter = 'blur(100px)';
      ctx.drawImage(video.current, positionWidth, positionHeight, width, height);
    }
  }

  return (
    <div className="theater-container">
      <div className='theater'>
        <canvas width={ window.innerWidth } height={ window.innerHeight } ref={ canvas } />
      </div>
      <video controls src={ videoSrc } loop autoPlay muted ref={ video } />
    </div>
  );
}

export default App;
