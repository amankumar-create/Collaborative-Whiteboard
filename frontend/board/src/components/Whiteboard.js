import React, { useState, useEffect, useRef  } from 'react';
import { fabric } from "fabric";
import { BsPenFill } from "react-icons/bs";

const modes = {
  DRAWING: "drawing",
  SELECTION: "selection"
}

function Whiteboard() {

  const canvasRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  

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

    const handleToggleMode = () => {
      console.log("isDrawingMode");
      setIsDrawingMode((prevMode) => !prevMode);
      canvas.isDrawingMode = !canvas.isDrawingMode;
      canvas.selection = !canvas.selection; 
    };

     canvasRef.current = canvas;
    const button = document.getElementById('toggleButton');

    button.addEventListener('click', handleToggleMode);
 
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
   
  return (
    <div>
      <canvas ref={canvasRef} />
      <div className='Toolbar'>
        <button className='tool' ><BsPenFill className='icon'/></button>
          
          
      </div>
      <button style={{ top:"500px", left:"500px",  position:"fixed"}} id = "toggleButton">
        {isDrawingMode?"true":"false"}
      </button>
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      
    </div>
  );
}
export default Whiteboard;