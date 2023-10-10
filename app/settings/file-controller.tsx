import {useCallback} from 'react';
import {getBase64} from '@/lib/convertToFile';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export function FileController({name, errors, register}: any) {
  const {setImg} = useProfilePicStore();
  const {onChange, ref} = register(name);

  const onAvatarChange = useCallback(async (event: any) => {
    if (event.target.files?.[0]) {
      const base64: any = await getBase64(event.target.files[0]);

      setImg(base64);
      onChange(event);
    }
  }, []);

  return (
    <div>
      <input type='file' accept='image/*' name={name} ref={ref} onChange={onAvatarChange} />
      <p>{errors[name]?.message}</p>
    </div>
  );
}
