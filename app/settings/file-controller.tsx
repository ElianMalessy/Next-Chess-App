import {useCallback, useState, useRef} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {getBase64} from '@/lib/convertToFile';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export function FileController({name, control, defaultValue, render}: any) {
  const inputRef = useRef<any>(null);
  const {setValue} = useFormContext();
  const {field} = useController({name, control});
  const {setImg} = useProfilePicStore();
  const [base64, setBase64] = useState(defaultValue.name);

  const onChange = useCallback(
    async (event: any) => {
      if (event.target.files?.[0]) {
        const img = await getBase64(event.target.files[0]);
        setBase64(img);
        setImg(img);
        field.onChange(event.target.files[0]);
      }
    },
    [setImg, field]
  );

  return render({
    field: {
      type: 'file',
      accept: 'image/*',
      name,
      onChange,
      ref: (instance: any) => {
        field.ref(instance);
        inputRef.current = instance;
      },
    },
    base64,
    select: () => inputRef.current?.click(),
    remove: () => {
      setValue(name, null);
      setBase64(null);
    },
  });
}
