import React, { useState, useEffect, useRef  } from 'react';
import { fabric } from "fabric";

function Whiteboard() {

  const canvas = useRef(null);

//   useEffect(() => {
//     canvas.current =  new fabric.Canvas(canvas.current, {
        
//         backgroundColor: 'pink' ,
//         selection: false,
//         renderOnAddRemove: true,
//       });
//       canvas.current.setDimensions({
//         width:window.innerWidth,
//         height: window.innerHeight
//       })

//     canvas.current.on("mouse:over", () => {
//       console.log('hello')
//     });
    
//     // destroy fabric on unmount
//     return () => {
//       canvas.current.dispose();
//       canvas.current = null;
//     };
//   }, []);

  

  return (

    <div >
      <canvas  />
    </div>

  );
}
export default Whiteboard;