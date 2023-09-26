// import {useRef, useState, useEffect} from 'react';
// import ProfilePic from './change-pic';
// import dataURLtoFile from '../../../lib/convertToFile';
// import {Button} from '@/components/ui/button';

// export default function Modal({setOpen, changeProfilePic, isOpen, profilePic, setProfilePic}: any) {
//   const fileInputRef = useRef();
//   const [tempProfilePic, setTempProfilePic] = useState(profilePic);
//   useEffect(
//     () => {
//       if (tempProfilePic !== profilePic) setTempProfilePic(profilePic);
//     },
//     // eslint-disable-next-line
//     [profilePic]
//   );

//   function submitUrl(e) {
//     console.log(e.target.value);
//     setTempProfilePic(e.target.value);
//   }

//   function newProfilePicFile(e) {
//     var files = e.target.files[0]; // FileList object
//     if (files === undefined) return;
//     var reader = new FileReader();

//     // Closure to capture the file information.
//     reader.onload = (function (file) {
//       return function (e: any) {
//         setTempProfilePic(e.target.result);
//       };
//     })(files);

//     // Read in the image file as a data URL.
//     reader.readAsDataURL(files);
//   }
//   return (
//     <>
//       {isOpen && (
//         <div onClick={() => setOpen(false)}>
//           <Button
//             onClick={() => {
//               setProfilePic(tempProfilePic);
//               const file = dataURLtoFile(tempProfilePic, 'user.jpg');
//               changeProfilePic(file);
//             }}
//           />
//           <ProfilePic />
//         </div>
//       )}
//     </>
//   );
// }
