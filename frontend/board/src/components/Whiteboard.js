import React, { useState, useEffect, useRef  } from 'react';
import { fabric } from "fabric";
import { FaPen } from "react-icons/fa";
import { FaArrowPointer } from "react-icons/fa6";


const modes = {
  DRAWING: "drawing",
  SELECTION: "selection",
  ERASING:"erasing",
  SHAPE_ADD: "shape-adding",
  BUCKET_FILL: "bucket-fill"
}

function Whiteboard() {

  const canvasRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [interactionMode, setInteractionMode] =  useState(modes.DRAWING);
  

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#F0F0F0",
      width: window.innerWidth,
      height: window.innerHeight,
      selection: isDrawingMode ? false : true,
    });

    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'red',
    });

    canvas.add(rect);

    canvas.isDrawingMode = isDrawingMode;

    
   

    canvasRef.current = canvas;
    // const button = document.getElementById('toggleButton');

    // button.addEventListener('click', handleToggleMode);
 
    return () => {
       
      // Cleanup code (if needed) when the component is unmounted
    };
  }, []);
   
  const handleAddRectangle = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const newRect = new fabric.Rect({
        width: 200,
        height: 200,
        fill: 'blue',
        left: 200,
        top: 200,
      });

      canvas.add(newRect);
    }
  };
   
  const handleToggleMode = () => {
    const canvas = canvasRef.current;
    setIsDrawingMode((prevMode) => !prevMode);
     
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.selection = !canvas.selection; 
    if(canvas.isDrawingMode){
      setInteractionMode(modes.DRAWING);
    }
    else{
      setInteractionMode(modes.SELECTION);
    }
    
  };
  return (
    <div>
      <canvas ref={canvasRef} />
      <div className='Toolbar'>
        <button className={`tool ${interactionMode==modes.DRAWING?"selected":""}`}  onClick={handleToggleMode}><FaPen className='icon'/></button>
        <button className={`tool ${interactionMode==modes.SELECTION?"selected":""}`} onClick={handleToggleMode}><FaArrowPointer className='icon'/></button>
          
          
      </div>
     
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      
    </div>
  );
}
export default Whiteboard;