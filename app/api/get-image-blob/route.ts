import {NextResponse, NextRequest} from 'next/server';
export async function GET(request: NextRequest) {
  const imgURL = request.nextUrl.searchParams.get('imgURL');
  if (!imgURL) return NextResponse.next();

  const imgData = await fetch(imgURL);
  const imgBlob = await imgData.blob();
  return new NextResponse(imgBlob, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
