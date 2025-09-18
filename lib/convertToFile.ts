import { getBaseUrl } from './get-base-url';

export const toDataURL = async (url: string) => {
  // Only run on client side
  if (typeof window === 'undefined') {
    throw new Error('toDataURL can only be called on the client side');
  }
  
  const response = await fetch(getBaseUrl() + `/api/get-image-blob?imgURL=${url}`);
  const data = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(data);
  });
};
export default function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}
export function fileToDataurl(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export async function urlToFile(url: string) {
  // Only run on client side
  if (typeof window === 'undefined') {
    throw new Error('urlToFile can only be called on the client side');
  }
  
  const response = await fetch(getBaseUrl() + `/api/get-image-blob?imgURL=${url}`);
  const data = await response.blob();
  const metadata = {
    type: 'image/jpeg',
  };
  return new File([data], 'profile-pic.jpeg', metadata);
}
