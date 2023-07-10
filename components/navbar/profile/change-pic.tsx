import {useRef, useState, useEffect} from 'react';
import AvatarEditor from 'react-avatar-editor';
export default function ProfilePic({tempProfilePic, children, setTempProfilePic}: any) {
  const scaledImg = useRef(tempProfilePic);
  const [state, setState] = useState({
    image: tempProfilePic,
    position: {x: 0.5, y: 0.5},
    scale: 1,
    height: 165,
    width: 165,
  });

  const firstLoad = useRef(true);
  useEffect(
    () => {
      if (firstLoad.current) firstLoad.current = false;
      else if (state.image !== tempProfilePic) setState({...state, image: tempProfilePic});
    },
    // eslint-disable-next-line
    [tempProfilePic]
  );
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
    <div style={{position: 'absolute'}}>
      <AvatarEditor
        crossOrigin='anonymous'
        scale={parseFloat(state.scale)}
        image={state.image}
        width={state.width}
        height={state.height}
        position={state.position}
        borderRadius={state.width / 2}
        onPositionChange={handlePositionChange}
        ref={(ref: any) => setEditorRef(ref)}
      />
      <br />
      <div className='d-flex align-items-center justify-content-center'>
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

      {children}
    </div>
  );
}
