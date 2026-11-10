import WrapperInterface from "./_types";

export default function Wrapper({
    children,
    className = '',
    backgroundColor = 'bg-white',
}: WrapperInterface) {
    return (
        <div
            className={`flex flex-grow items-center justify-center w-full text-black ${backgroundColor}`}
        >
            <div
                className={`w-full max-w-[1200px] px-4 md:w-[85%] md:px-[36px] lg:w-full ${className}`}
            >
                {children}
            </div>
        </div>
    );
}