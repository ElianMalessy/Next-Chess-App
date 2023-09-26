'use client';
import {useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';

export default function AvatarEdit({img}: {img: string}) {
  const [tempProfilePic, setTempProfilePic] = useState(img);

  const scaledImg = useRef(tempProfilePic);
  const [state, setState] = useState({
    position: {x: 0.5, y: 0.5},
    scale: 1,
    height: 165,
    width: 165,
  });

  const handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    setState({...state, scale: scale});
    setTempProfilePic(scaledImg.current);
  };

  const handlePositionChange = (e: any) => {
    setState({...state, position: e});
    setTempProfilePic(scaledImg.current);
  };

  const setEditorRef = (editor: any) => {
    if (editor) {
      scaledImg.current = editor.getImageScaledToCanvas().toDataURL();
    }
  };
  return (
    <div>
      <AvatarEditor
        crossOrigin='anonymous'
        scale={state.scale}
        image={tempProfilePic}
        width={state.width}
        height={state.height}
        position={state.position}
        borderRadius={state.width / 2}
        onPositionChange={handlePositionChange}
        ref={(ref: any) => setEditorRef(ref)}
      />
      <br />
      <div className='flex items-center justify-center'>
        Zoom:
        <input
          name='scale'
          type='range'
          onChange={handleScale}
          min={'1'}
          max='2'
          step='0.01'
          defaultValue='1'
          style={{width: state.width, marginLeft: '0.15rem', marginTop: '0.2rem'}}
        />
      </div>
    </div>
  );
}
