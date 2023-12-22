import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FaCaravan, FaPen, FaUnderline } from "react-icons/fa";
import { FaArrowPointer } from "react-icons/fa6";
import { IoShapes } from "react-icons/io5";
import { FaEraser } from "react-icons/fa6";
import { MdTextFields } from "react-icons/md";
import { FaHandPaper } from "react-icons/fa";
import PropertiesToolbar from "./PropertiesToolbar";

const modes = {
  DRAWING: "drawing",
  SELECTION: "selection",
  ERASING: "erasing",
  SHAPE_ADD: "shape-adding",
  BUCKET_FILL: "bucket-fill",
  TEXT_ADD: "text-adding",
  PANNING: "panning",
};

function Whiteboard({ socket }) {
  const canvasRef = useRef(null);
  const [interactionMode, setInteractionMode] = useState(modes.DRAWING);
  const [selection, setSelection] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const isPanning = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#F0F0F0",
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });

    canvas.isDrawingMode = true;

    //-------------------------------------------- for panning---------------------------------------------------------------------------------
    canvas.on("mouse:wheel", (event) => {
      const delta = event.e.deltaY;
      const zoom = canvas.getZoom();
      const zoomFactor = 1.1;

      if (delta > 0) {
        // Zoom out
        canvas.setZoom(zoom / zoomFactor);
      } else {
        // Zoom in
        canvas.setZoom(zoom * zoomFactor);
      }

      event.e.preventDefault();
      event.e.stopPropagation();
    });
    //---------------------------------------------------------------------------------------------------------------------------------------

    // canvas.on('path:created',function(e) {  


    // });

    canvas.on('object:added', function (e) {
      if (e.target.id === undefined) {
        e.target.set('id', randomHash());
        sendCanvasUpdate(e.target, "add");
      }
    });

    canvas.on('object:modified', function(e){
      
        
        sendCanvasUpdate(e.target, "modify");
     
    });

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // socket.on("canvas-data", (data) => {
    //   handleCanvasData(canvas, data);
    // });


    //------------------------------------------------------------------------------------------------------------------------------------------------
    socket.on("canvas-update", (data) => {
      handleCanvasUpdateReceived(canvas, data);
    })

    //------------------------------------------------------------------------------------------------------------------------------------------------
    canvasRef.current = canvas;

    return () => {
      // Cleanup code (if needed) when the component is unmounted
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (interactionMode == modes.DRAWING) {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
    if (interactionMode == modes.SELECTION) {
      canvas.selection = true;
      if (selectedObject != null) {
        CenterOriginObject();
      }
      canvas.on("selection:created", function (event) {
        const obj = canvas.getActiveObject();
        setSelectedObject(obj);
        CenterOriginObject();
      });
      canvas.on("selection:cleared", function (event) {
        setSelectedObject(null);
      });
    } else {
      canvas.selection = false;
    }
  }, [interactionMode]);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [interactionMode, selection]);

  // const handleCanvasData = (canvas, data) => {
  //   // Apply received canvas data to the local canvas
  //   // This may include adding objects, modifying properties, etc.
  //   canvas.loadFromJSON(data, () => {
  //     canvas.renderAll();
  //   });
  // };

  const handleCanvasUpdateReceived = (canvas, data) => {
    const eventType = data.eventType
    var parsedObject = JSON.parse(data.objectData);
    const id = parsedObject.id;
    console.log(parsedObject);
    var objectsArray = [parsedObject];
    const obj = fabric.Canvas.prototype.getObjectById(id);
    console.log(eventType);
    if(obj!=null){
      console.log(obj)
      canvas.remove(obj);
    }
    // Deserialize the Fabric.js object
    fabric.util.enlivenObjects(objectsArray, function(objects) {
         
        canvas.add(objects[0]);
        canvas.renderAll();
    });
  }

  const randomHash = () => {
    var id = "id" + Math.random().toString(16).slice(2);
    return id;
  }

  const sendCanvasData = () => {
    // Send the current canvas data to the server
    console.log("sending canvas data");
    const canvasData = JSON.stringify(canvasRef.current.toDatalessJSON());
    socket.emit("canvas-data", canvasData);
  };

  const sendCanvasUpdate = (obj, eventType) => {
    if (obj == null) return;
    const objectData = JSON.stringify(obj.toJSON(['id']));
    //console.log(objectData);
    socket.emit('canvas-update', {eventType:eventType , objectData:objectData});
  }

  fabric.Canvas.prototype.getObjectById = function (id) {
    var objs = canvasRef.current.getObjects();
    console.log(objs.length);
    for (var i = 0, len = objs.length; i < len; i++) {
      console.log(objs[i].id);
      if (objs[i].id == id) {
        return objs[i];
      }
    }

    return null;
  };
  const CenterOriginObject = () => {
    const canvas = canvasRef.current;
    const obj = canvas.getActiveObject();
    const center = obj.getCenterPoint();
    obj.originX = "center";
    obj.originY = "center";
    obj.left = center.x;
    obj.top = center.y;
    console.log("origin centerd");
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    console.log("mouse down");
    if (
      interactionMode == modes.SHAPE_ADD ||
      interactionMode == modes.TEXT_ADD
    ) {
      const pointer = canvas.getPointer(event.e);

      setSelection({
        startX: pointer.x,
        startY: pointer.y,
      });
    }
    if (interactionMode == modes.PANNING) {
      isPanning.current = true;
      lastX.current = event.e.clientX;
      lastY.current = event.e.clientY;
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (
      interactionMode == modes.SHAPE_ADD ||
      interactionMode == modes.TEXT_ADD
    ) {
      if (selection == null) return;

      const pointer = canvas.getPointer(event.e);
      const width = pointer.x - selection.startX;
      const height = pointer.y - selection.startY;

      if (!selection.rect) {
        const rect = new fabric.Rect({
          left: selection.startX,
          top: selection.startY,
          width,
          height,
          fill: "transparent", // Set fill to transparent for an outline
          stroke: "rgba(0,0,255,0.3)", // Outline color
          strokeWidth: 2, // Outline width
          selectable: false, // The selection area should not be selectable
        });

        canvas.add(rect);
        selection.rect = rect;
      } else {
        selection.rect.set({ width, height });
        canvas.renderAll();
      }
    } else if (interactionMode == modes.PANNING) {
      if (isPanning.current) {
        const deltaX = event.e.clientX - lastX.current;
        const deltaY = event.e.clientY - lastY.current;

        canvas.relativePan(new fabric.Point(deltaX, deltaY));
        lastX.current = event.e.clientX;
        lastY.current = event.e.clientY;
      }
    }
  };

  const handleMouseUp = (event) => {
    if (
      interactionMode == modes.SHAPE_ADD ||
      interactionMode == modes.TEXT_ADD
    ) {
      if (selection != null && selection.rect != null) {
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
          fill: "transparent", // Set fill to transparent for an outline
          stroke: "rgba(0,0,0,1)", // Outline color
          strokeWidth: 10, // Outline width
          selectable: true, // The selection area should not be selectable
        });

        //rect.set('id', randomHash());

        const x = (pointer.x + selection.startX) / 2;
        const y = (pointer.y + selection.startY) / 2;

        rect.on("scaling", (event) => {
          //console.log("being scaled");
          const newWidth = rect.width * rect.scaleX;
          const newHeight = rect.height * rect.scaleY;

          rect.set({
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1,
          });
        });

        const text = new fabric.IText("Click to edit...", {
          left: selection.startX,
          top: selection.startY,
          width,
          height,
          fill: "transparent", // Set fill to transparent for an outline

          selectable: true, // The selection area should not be selectable
          fontFamily: "Arial",
          fill: "#000000",
          editable: true,
        });
        //text.set('id', randomHash());

        if (interactionMode == modes.SHAPE_ADD) {
          canvas.add(rect);
          canvas.setActiveObject(rect);
          setSelectedObject(rect);
        } else {
          canvas.add(text);
          canvas.setActiveObject(text);
          text.enterEditing();
          text.selectionStart = text.text.length; // Place cursor at the end of the text
          text.selectionStyle = {
            cursorColor: "#000000", // Set cursor color to black
            cursorOpacity: 1, // Ensure cursor is visible
            cursorDelay: 1, // Set cursor blink interval in milliseconds
          };
        }
        setSelection(null);
        setInteractionMode(modes.SELECTION);
      } else {
        setSelection(null);
        //console.log("mouse up");
      }
    } else if (interactionMode == modes.PANNING) {
      isPanning.current = false;
    }

    // sendCanvasData();
  };

  const handleToggleMode = (event) => {
    switch (event.currentTarget.id) {
      case "drawing":
        setInteractionMode(modes.DRAWING);
        break;

      case "selection":
        setInteractionMode(modes.SELECTION);
        break;

      case "shape-adding":
        setInteractionMode(modes.SHAPE_ADD);
        break;

      case "text-adding":
        setInteractionMode(modes.TEXT_ADD);
        break;

      case "erasing":
        setInteractionMode(modes.ERASING);
        break;

      case "panning":
        setInteractionMode(modes.PANNING);
        break;

      default:
        setInteractionMode(modes.SELECTION);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <div className="Toolbar">
        <button
          id="drawing"
          className={`tool ${interactionMode == modes.DRAWING ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <FaPen className="icon" />
        </button>
        <button
          id="selection"
          className={`tool ${interactionMode == modes.SELECTION ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <FaArrowPointer className="icon" />
        </button>
        <button
          id="shape-adding"
          className={`tool ${interactionMode == modes.SHAPE_ADD ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <IoShapes className="icon" />
        </button>
        <button
          id="text-adding"
          className={`tool ${interactionMode == modes.TEXT_ADD ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <MdTextFields className="icon" />
        </button>
        <button
          id="erasing"
          className={`tool ${interactionMode == modes.ERASING ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <FaEraser className="icon" />
        </button>
        <button
          id="panning"
          className={`tool ${interactionMode == modes.PANNING ? "selected" : ""
            }`}
          onClick={handleToggleMode}
        >
          <FaHandPaper className="icon" />
        </button>
      </div>
      {selectedObject == null ? (
        ""
      ) : (
        <PropertiesToolbar sendCanvasUpdate = {sendCanvasUpdate} canvas={canvasRef.current}></PropertiesToolbar>
      )}
    </div>
  );
}
export default Whiteboard;
