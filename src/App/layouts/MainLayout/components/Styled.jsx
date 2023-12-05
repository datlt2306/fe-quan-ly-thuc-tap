import tw from 'twin.macro';

const Main = tw.div`lg:pl-72 h-screen flex flex-col overflow-hidden`;
Main.Content = tw.div`min-h-fit py-10 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200`;
const Aside = tw.div`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`;
Aside.Content = tw.div`flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4`;
const Image = tw.img`max-w-[10rem] object-contain translate-x-2`;

export { Main, Aside, Image };
