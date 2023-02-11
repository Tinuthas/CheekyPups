interface ButtonProps{
  text: string
}

export function Button({text} : ButtonProps) {
 
  return(
    <button className="bg-pinkBackground text-white font-semibold py-2 px-6 rounded-lg md:ml-8 hover:bg-pink-600 ">
      {text}
    </button>
  )
}