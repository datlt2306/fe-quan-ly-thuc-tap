import classNames from 'classnames';
import tw from 'twin.macro';

export const Skeleton = tw.div`overflow-hidden relative my-2 h-3 w-full rounded-sm bg-gray-100 before:absolute before:h-full before:w-1/2 before:animate-slide before:bg-gradient-to-r before:from-transparent before:via-[#e5e7eb90] before:to-transparent before:[content:'*']`;
