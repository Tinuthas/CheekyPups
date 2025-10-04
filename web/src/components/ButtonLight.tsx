interface ButtonProps{
  text: string,
  style?: string,
  onClick: () => void,
}

export function ButtonLight({text, onClick, style} : ButtonProps) {
 
  return(
    <button onClick={onClick} className={`bg-white text-neutral-700 font-semibold py-2 rounded-lg border-[2px] border-pinkBackground md:ml-8 mt-5 h-14 md:mt-0 hover:border-pinkBackground hover:text-white hover:bg-pinkBackground focus:outline-none focus:bg-bg-pink-600 transition-all ${style != null ? style : "w-full md:w-auto px-8"}`}>
      {text}
    </button>
  )
}