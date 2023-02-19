interface ButtonProps{
  text: string,
  onClick: () => void
}

export function ButtonDark({text, onClick} : ButtonProps) {
 
  return(
    <button onClick={onClick} className="bg-pinkBackground text-white font-semibold py-2 px-6 rounded md:ml-8 mt-7 md:mt-0 hover:bg-pink-600 focus:outline-none focus:bg-bg-pink-600">
      {text}
    </button>
  )
}