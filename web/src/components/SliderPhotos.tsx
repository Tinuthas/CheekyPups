import 'react-slideshow-image/dist/styles.css'
import React from 'react';
import { Slide } from 'react-slideshow-image';

interface SliderPhotosProps {
  images : { url: any }[]
}
const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}

export function SliderPhotos({images} : SliderPhotosProps) {

  return (
    <>
      <Slide slidesToScroll={2} slidesToShow={2} indicators={true}>
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