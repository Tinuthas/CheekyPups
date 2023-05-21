import { GoogleMap, InfoWindow, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

interface MapProps {
  googleMapsApiKey: string,
  lat: number,
  lng: number,
  zoom: number,
}

interface Coodinates {
  lat: number,
  lng: number
}

export function Map({ googleMapsApiKey, lat, lng, zoom }: MapProps) {
  const center = useMemo(() => ({ lat, lng }), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  if (!isLoaded) return <div>Loading...</div>

  return (
    <>
     <div className="mt-5">
       <GoogleMap
         key={googleMapsApiKey}
         zoom={zoom}
         center={center}
         mapContainerClassName="map-container"
       >
        <MarkerF
          position={center}
        >
          <div className="pin">
            <Icon icon={locationIcon} className="pin-icon" />
            <p className="pin-text">{"Green Gate Business Centre, 1 Gould St, The Lough, Cork"}</p>
          </div>
       </MarkerF>
     </GoogleMap>
    </div>
   </>
  );
}