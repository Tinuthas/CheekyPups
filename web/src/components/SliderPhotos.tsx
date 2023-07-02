import 'react-slideshow-image/dist/styles.css'
import React, { useState } from 'react';
import { Slide } from 'react-slideshow-image';

interface SliderPhotosProps {
  images : { url: any }[]
}

export function SliderPhotos({images} : SliderPhotosProps) {

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: screenSize.width >= 1000 ? '580px' : '370px' 
  }
  

  console.log(screenSize)
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