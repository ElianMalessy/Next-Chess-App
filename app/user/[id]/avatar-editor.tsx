'use client';
import AvatarEditor from 'react-avatar-editor';

export default function AvatarEdit({img}: {img: string}) {
  return (
    <AvatarEditor
      image={img}
      width={250}
      height={250}
      border={50}
      color={[255, 255, 255, 0.6]} // RGBA
      scale={1.2}
      rotate={0}
    />
  );
}
