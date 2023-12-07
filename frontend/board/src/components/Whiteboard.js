import React, { useState, useEffect, useRef  } from 'react';
import { fabric } from "fabric";
import { FaCaravan, FaPen } from "react-icons/fa";
import { FaArrowPointer } from "react-icons/fa6";
import { IoShapes } from "react-icons/io5";
import { FaEraser } from "react-icons/fa6";
import { MdTextFields } from "react-icons/md";
import PropertiesToolbar from './PropertiesToolbar';

const modes = {
  DRAWING: "drawing",
  SELECTION: "selection",
  ERASING:"erasing",
  SHAPE_ADD: "shape-adding",
  BUCKET_FILL: "bucket-fill",
  TEXT_ADD: "text-adding"
}

function Whiteboard() {

  const canvasRef = useRef(null);
  const [interactionMode, setInteractionMode] =  useState(modes.DRAWING);
  const [selection, setSelection] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#F0F0F0",
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });

    canvas.isDrawingMode = true;
 
    canvasRef.current = canvas;
   
    return () => {
       
      // Cleanup code (if needed) when the component is unmounted
    };
  }, []);

  useEffect(()=>{
    const canvas = canvasRef.current;
    console.log(interactionMode);

    if(interactionMode== modes.DRAWING){
      canvas.isDrawingMode = true;
    }
    else{
      canvas.isDrawingMode = false;
    }
    if(interactionMode== modes.SELECTION){
      canvas.selection = true;
      canvas.on('selection:created', function(event) {
        setSelectedObject(event.target);
        const selectedObject = event.target;
        console.log("object selected");
        // updateToolbarPosition(selectedObject);
        // document.getElementById('toolbar').style.display = 'block';
      });
      canvas.on('selection:cleared', function(event) {
        setSelectedObject(null);
      });
    }
    else{
      canvas.selection = false;
    }
    

  }, [interactionMode] )

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(interactionMode==modes.SHAPE_ADD){
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    }

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [interactionMode,selection]);
  
  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    console.log("mouse down");
    const pointer = canvas.getPointer(event.e);
  
    setSelection({
      startX: pointer.x,
      startY: pointer.y,
    });
  };

  const handleMouseMove = (event) => {
    
    if (selection==null ) return;
    
    const canvas = canvasRef.current;

    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - selection.startX;
    const height = pointer.y - selection.startY;
    console.log(width, height);
    if (!selection.rect) {
      const rect = new fabric.Rect({
        left: selection.startX,
        top: selection.startY,
        width,
        height,
        fill: 'transparent', // Set fill to transparent for an outline
        stroke: 'rgba(0,0,255,0.3)', // Outline color
        strokeWidth: 2, // Outline width 
        selectable: false, // The selection area should not be selectable
      });

      canvas.add(rect);
      selection.rect = rect;
    } else {
      selection.rect.set({ width, height });
      canvas.renderAll();
    }
  };

  const handleMouseUp = (event) => {
    if (selection!=null && selection.rect!=null) {
      const canvas = canvasRef.current;
      canvas.remove(selection.rect);
      const pointer = canvas.getPointer(event.e);
      const width = pointer.x - selection.startX;
      const height = pointer.y - selection.startY;
      const rect = new fabric.Rect({
        left: selection.startX,
        top: selection.startY,
        width,
        height,
        fill: 'transparent', // Set fill to transparent for an outline
        stroke: 'rgba(0,0,0,1)', // Outline color
        strokeWidth: 10, // Outline width 
        selectable: true, // The selection area should not be selectable
         
      });
      rect.on('scaling', (event) => {
        const newWidth = rect.width * rect.scaleX;
        const newHeight = rect.height * rect.scaleY;
 
        rect.set({ width:newWidth, height:newHeight, scaleX:1, scaleY:1 });
        console.log(rect.scaleX, rect.scaleY)
 
      });
      canvas.add(rect);
      setSelection(null);
      setInteractionMode(modes.SELECTION);
    }else{
      setSelection(null);
      console.log("mouse up");
    }
  };
 
   
  const handleToggleMode = (event) => {
 
    switch(event.currentTarget.id){
      case 'drawing':
        setInteractionMode(modes.DRAWING);
        break;

      case 'selection':
        setInteractionMode(modes.SELECTION);
        break;

      case 'shape-adding':
        setInteractionMode(modes.SHAPE_ADD);
        break;
      
      case 'text-adding':
        setInteractionMode(modes.TEXT_ADD);
        break;

      case 'erasing':
        setInteractionMode(modes.ERASING);
        break;

      default:
        setInteractionMode(modes.SELECTION);

    }

  };
  if(canvasRef){
    if(canvasRef.current){
      console.log("Canvas ref not null");
    }
  }
  return (
    <div>
      <canvas ref={canvasRef} />
      <div className='Toolbar'>
        <button id='drawing' className={`tool ${interactionMode==modes.DRAWING?"selected":""}`}  onClick={handleToggleMode}><FaPen className='icon'/></button>
        <button id='selection' className={`tool ${interactionMode==modes.SELECTION?"selected":""}`} onClick={handleToggleMode}><FaArrowPointer className='icon'/></button>
        <button id ='shape-adding' className={`tool ${interactionMode==modes.SHAPE_ADD?"selected":""}`} onClick={handleToggleMode}><IoShapes className='icon'/></button>
        <button id ='text-adding' className={`tool ${interactionMode==modes.TEXT_ADD?"selected":""}`} onClick={handleToggleMode}><MdTextFields className='icon'/></button>
        <button id ='erasing' className={`tool ${interactionMode==modes.ERASING?"selected":""}`} onClick={handleToggleMode}><FaEraser className='icon'/></button>
          
      </div>
      {
        canvasRef==null?"":canvasRef.current==null?"": canvasRef.current.getActiveObject()==null?"":<PropertiesToolbar canvas={canvasRef.current}></PropertiesToolbar>
      }
      
       
      
    </div>
  );
}
export default Whiteboard;