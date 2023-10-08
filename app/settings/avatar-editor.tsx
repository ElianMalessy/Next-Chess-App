'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export default function AvatarEdit() {
  const {startOffset, scale, setScale, setStartOffset, img, setImg} = useProfilePicStore();

  const [tempScale, setTempScale] = useState(scale);
  const [tempStartOffset, setTempStartOffset] = useState(startOffset);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const handleScale = (e: any) => {
    const newScale = parseFloat(e.target.value);
    setTempScale(newScale);
  };

  const handleMouseMove = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!isDragging) return;
      setOffset({x: e.clientX - tempStartOffset.x, y: e.clientY - tempStartOffset.y});
    },
    [isDragging, tempStartOffset]
  );
  const handleMouseUp = useCallback(
    (e: any) => {
      if (!isDragging) return;
      setIsDragging(false);
      setStartOffset(offset);
      setScale(tempScale);
    },
    [setStartOffset, isDragging, setScale, tempScale, offset]
  );
  const handleMouseDown = useCallback((e: any) => {
    setIsDragging(true);
    setTempStartOffset({x: e.clientX, y: e.clientY});
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  function submitUrl(e: any) {
    console.log(e.target.value);
    setImg(e.target.value);
  }
  function newProfilePicFile(e: any) {
    var files = e.target.files[0]; // FileList object
    if (files === undefined) return;
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (file) {
      return function (e: any) {
        setImg(e.target.result);
      };
    })(files);

    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
  }
  // async function createFile(url: string) {
  //   let response = await fetch(url);
  //   let data = await response.blob();
  //   let metadata = {
  //     type: 'image/jpeg',
  //   };
  //   let f = new File([data], 'test.jpg', metadata);
  //   updateProfilePic(f)
  //   // ... do something with the file or return it
  // }

  return (
    <div>
      <div className={`h-[25rem] w-[25rem] overflow-hidden relative`} onMouseDown={handleMouseDown}>
        <Image
          src={img}
          layout='fill'
          objectFit='contain'
          className={`w-full h-full`}
          style={{transform: `scale(${tempScale}) translate(${offset.x}px, ${offset.y}px)`}}
          alt='profile-pic-editor'
        />
        <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full border-white border-4 h-[25rem] w-[25rem]' />
      </div>
      <br />
      <div className='flex items-center justify-center'>
        Zoom:
        <input
          name='scale'
          type='range'
          onChange={handleScale}
          min='1'
          max='10'
          step='0.01'
          defaultValue='1'
          style={{width: '250px', marginLeft: '0.15rem', marginTop: '0.2rem'}}
        />
      </div>
    </div>
  );
}
