import {useState, useEffect} from 'react';

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({width: 560 / 0.95, height: 560 / 0.95});

  useEffect(() => {
    function handleResize(width: number, height: number) {
      setWindowDimensions({width: width, height: width});
    }
    handleResize(window.innerWidth, window.innerWidth);

    window.addEventListener('resize', () => {
      handleResize(window.innerWidth, window.innerWidth);
    });
    return () => window.removeEventListener('resize', () => handleResize(window.innerWidth, window.innerWidth));
  }, []);

  return windowDimensions;
}
