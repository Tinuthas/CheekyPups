interface ButtonProps{
  text: string,
  onClick: () => void
}

export function Button({text, onClick} : ButtonProps) {
 
  return(
    <button onClick={onClick} className="bg-pinkBackground drop-shadow text-white font-semibold py-2 px-6 rounded-lg md:ml-8 hover:bg-pink-600 focus:outline-none focus:bg-bg-pink-600">
      {text}
    </button>
  )
}