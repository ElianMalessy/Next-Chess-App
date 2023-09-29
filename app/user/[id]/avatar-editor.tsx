'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Avatar} from '@/components/ui/avatar';
import Image from 'next/image';
import {useProfilePicStore} from '@/hooks/useProfilePicStore';
import {Dialog, DialogContent} from '@/components/ui/dialog';

export default function AvatarEdit({img}: {img: string}) {
  const {startOffset, scale, setScale, setStartOffset} = useProfilePicStore();

  const [tempProfilePic, setTempProfilePic] = useState(img);
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
      // setStartOffset({x: 0, y: 0});
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

  const setEditorRef = (editor: any) => {
    if (editor) {
      console.log(editor.getBoundingClientRect());
      // scaledImg.current = editor.getImageScaledToCanvas().toDataURL();
    }
  };
  const [avatarClick, setAvatarClick] = useState(false);

  return (
    <>
      <Dialog open={avatarClick} onOpenChange={setAvatarClick}>
        <DialogContent>
          <div>
            <div className={`h-[25rem] w-[25rem] overflow-hidden relative`} onMouseDown={handleMouseDown}>
              <Image
                src={tempProfilePic}
                layout='fill'
                objectFit='contain'
                className={`w-full h-full`}
                ref={(ref: any) => setEditorRef(ref)}
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
          upload file
        </DialogContent>
      </Dialog>
      <Avatar className='w-24 h-24' onClick={() => setAvatarClick(true)}>
        <Image src={img} alt='user-profile-picture' width={96} height={96} priority />
      </Avatar>
    </>
  );
}
