import 'react-slideshow-image/dist/styles.css'
import React, { useState } from 'react';
import { Slide } from 'react-slideshow-image';

interface SliderPhotosProps {
  images : { url: any }[],
  mainHeight: string,
  secondHeight: string
}

export function SliderPhotos({images, mainHeight, secondHeight} : SliderPhotosProps) {

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: screenSize.width >= 1000 ? mainHeight : secondHeight 
  }
  
  return (
    <>
      <Slide slidesToScroll={screenSize.width >= 1000 ? 2 : 1} slidesToShow={screenSize.width >= 1000 ? 2 : 1} indicators={true}>
        {images.map((slideImage, index)=> (
            <div key={index}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
                {/*<span style={spanStyle}>{slideImage.caption}</span>*/}
              </div>
            </div>
        ))} 
      </Slide>
    </>
  )
}

function getCurrentDimension(){
  return {
      width: window.innerWidth,
      height: window.innerHeight
  }
}