import {useState, useEffect} from 'react';

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({width: 560 / 0.95, height: 560 / 0.95});

  useEffect(() => {
    function handleResize(width: number, height: number) {
      setWindowDimensions({width: width, height: height});
    }
    handleResize(document.body.clientWidth, document.body.clientHeight);

    window.addEventListener('resize', () => {
      handleResize(window.innerWidth, window.innerHeight);
    });
    return () => window.removeEventListener('resize', () => handleResize(window.innerWidth, window.innerHeight));
  }, []);

  return windowDimensions;
}
