interface ButtonProps{
  text: string,
  onClick: () => void,
}

export function ButtonLight({text, onClick} : ButtonProps) {
 
  return(
    <button onClick={onClick} className={`bg-white text-neutral-700 font-medium w-full md:w-auto py-2 px-10 rounded border-[1px] border-pinkBackground md:ml-8 mt-5 h-14 md:mt-0 hover:border-neutral-700 hover:text-white hover:bg-pinkBackground focus:outline-none focus:bg-bg-pink-600 transition-all`}>
      {text}
    </button>
  )
}