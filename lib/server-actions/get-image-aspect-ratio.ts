'use server';

const probe = require('probe-image-size');
export default async function getImageAspectRatio(imgURL: string) {
  const result = await probe(imgURL);
  const width = result.width;
  const height = result.height;
  return width && height ? (width > height ? width / height : height / width) : 1;
}
