'use client';
import {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';

import {Button} from '@/components/ui/button';
import {uploadProfilePicKV} from '@/lib/server-actions/upload-profile-pic';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export default function AvatarEdit({
  aspectRatio,
  currentUserData,
  currentUserId,
}: {
  aspectRatio: number;
  currentUserData: any;
  currentUserId: string;
}) {
  const {startOffset, scale, setScale, setStartOffset, img, setImg} = useProfilePicStore();

  useEffect(() => {
    setScale(currentUserData.scale);
    setStartOffset(currentUserData.startOffset);
    setImg(currentUserData.photoURL);
  }, [currentUserData, setScale, setStartOffset, setImg]);

  const [tempScale, setTempScale] = useState(scale);
  const [tempStartOffset, setTempStartOffset] = useState({x: 0, y: 0});
  const [offset, setOffset] = useState(startOffset);
  const [isDragging, setIsDragging] = useState(false);

  const handleScale = useCallback((e: any) => {
    const newScale = parseFloat(e.target.value);
    setTempScale(newScale);
  }, []);

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
    },
    [isDragging]
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

  return (
    <>
      <div className='h-full w-full flex items-center flex-col'>
        <div className={`h-[288px] w-[288px] overflow-hidden relative`} onMouseDown={handleMouseDown}>
          <Image
            src={img}
            fill
            style={{
              objectFit: 'cover',
              transform: `scale(${tempScale}) translate(${offset.x}px, ${offset.y}px)`,
            }}
            alt='profile-pic-editor'
          />
          <div
            className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full border-white border-4 h-[288px] w-[288px]`}
          />
        </div>
        <br />
        <div className='flex items-center justify-center'>
          Zoom:
          <input
            name='scale'
            type='range'
            onChange={handleScale}
            min={`${aspectRatio}`}
            max='10'
            step='0.01'
            defaultValue='1'
            style={{width: '250px', marginLeft: '0.15rem', marginTop: '0.2rem'}}
          />
        </div>
      </div>
      <Button
        onClick={async () => {
          if (currentUserId === '') return;
          setScale(tempScale);
          setStartOffset(offset);
          console.log(currentUserId, offset, tempScale);
          await uploadProfilePicKV(currentUserId, offset, tempScale, img);
        }}
      >
        Edit
      </Button>
    </>
  );
}
