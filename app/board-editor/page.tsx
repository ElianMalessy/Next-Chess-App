import Navbar from '@/components/navbar/navbar';
import BoardEditor from '@/components/board/board-editor';

export default function BoardEditorPage() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='flex h-full w-full flex-row items-center justify-center'>
          <div className='grid 2xs:grid-rows-2 sm:grid-rows-3 2xs:grid-cols-1 2xs:gap-2 lg:grid-rows-1 lg:grid-cols-5 lg:gap-8 lg:mt-12'>
            <div className='flex justify-center items-center 2xs:row-span-2 2xs:row-start-1 lg:col-span-3 lg:row-span-1 2xs:h-[100vw] sm:h-auto'>
              <div className='relative h-[min(560px,calc(100vw-1rem))] w-[min(560px,calc(100vw-1rem))]'>
                <BoardEditor />
              </div>
            </div>
            <div className='2xs:row-start-3 lg:row-start-1 lg:col-span-2 lg:col-start-4 flex items-center 2xs:h-[20rem] 2xs:max-w-[min(560px,calc(100vw-1rem))] lg:h-[min(560px,calc(100vw-1rem))] lg:max-w-[20rem]'>
              <div className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Board Editor & Analysis</h2>
                <p className='text-sm text-muted-foreground'>
                  Move pieces freely to analyze positions. Both white and black pieces can be moved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
