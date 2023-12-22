import {useEffect, useState} from "react";
import { GoCircle } from "react-icons/go";
import { MdOutlineRectangle } from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";
import { PiRectangle } from "react-icons/pi";
import { RxBox } from "react-icons/rx";
import { fabric } from "fabric";
const shapes = {
    CIRC: "circle",
    RECT:"rect",
    TRIG: "triangle",
    ELPS:"ellipse"
}

const PropertiesToolbar = ({sendCanvasUpdate ,canvas})=>{
 
    const [selectedShape, setSelectedShape] = useState();
    const [toolbarPosition, setToolbarPosition] = useState({left:0, top:0});
    const [strokeThickness, setStrokeThickness] = useState(1);
    const [strokeColor, setStrokeColor] = useState();
    const [selectingShape, setSelectingShape] = useState(false);
    
    useEffect(()=>{
        updateToolbarPosition();
        const obj = canvas.getActiveObject();
        if(obj.type=="rect" && obj.rx != 0 ){
            setSelectedShape(shapes.ELPS);
        }
        else
            setSelectedShape(obj.type);

        setStrokeThickness(obj.strokeWidth);
        setStrokeColor(obj.stroke);
        //console.log("selected shape " + selectedShape, "active "+obj.type);
        sendCanvasUpdate(obj, "modify");
        
        canvas.on('mouse:up', ()=>{
            updateToolbarPosition();
        });
    },[]);

    useEffect(()=>{
        //console.log(selectedShape)
        const obj = canvas.getActiveObject();
        //console.log(obj.type);
        if(selectedShape == shapes.RECT ){
            //console.log("you are here");
            const recta = new fabric.Rect({...obj,
                radius:0,
                rx:0,
                ry:0
              });
              canvas.add(recta);
              canvas.setActiveObject(recta);
              canvas.remove(obj);   
        }
        else if(selectedShape==shapes.CIRC){
            const circle = new fabric.Circle({...obj,
                left: obj.left,
                top: obj.top,
                radius: Math.min(obj.width, obj.height) / 2,
              });
              canvas.add(circle);
              canvas.setActiveObject(circle);
              canvas.remove(obj);
              
        }
        else if(selectedShape==shapes.TRIG){
            const tria = new fabric.Triangle({...obj,
                left: obj.left,
                top: obj.top,
                
              });
              canvas.add(tria);
              canvas.setActiveObject(tria);
              canvas.remove(obj);
        }
        else if(selectedShape==shapes.ELPS){
            const rect = new fabric.Rect({...obj,
                left: obj.left,
                top: obj.top,
                rx : Math.min(obj.width,obj.height)/10,
                ry: Math.min(obj.width,obj.height)/10
              });
              canvas.add(rect);
              canvas.setActiveObject(rect);
              canvas.remove(obj);
        }
        const obj1 = canvas.getActiveObject();
        obj1.on('scaling', (event) => {
            const newWidth = obj1.width * obj1.scaleX;
            const newHeight = obj1.height * obj1.scaleY;
            
            obj1.set({ 'width':newWidth, 'height':newHeight, 'scaleX':1, 'scaleY':1 });
            if(selectedShape==shapes.ELPS){
                obj1.set({rx:Math.min(newWidth,newHeight)/10, ry:Math.min(newWidth,newHeight)/10});  
            }
            
          });
        canvas.renderAll();
        console.log("id = "+ obj1.id);
        sendCanvasUpdate(obj1, "modify");
    }, [selectedShape])
    useEffect(()=>{
        const object = canvas.getActiveObject() ;
        object.set({'strokeWidth':strokeThickness ,'stroke' : strokeColor});
         canvas.renderAll();
         sendCanvasUpdate(object, "modify");
        
    }, [strokeThickness, strokeColor]);
    
    function updateToolbarPosition() {
        const objectInFocus = canvas.getActiveObject();
        if(objectInFocus==null) return;
        const boundingRect = objectInFocus.getBoundingRect();
       
        const left = Math.max( boundingRect.left, 176 ) ;
        const top = Math.max( boundingRect.top- 100, 20) ;
        setToolbarPosition({left:left, top:top});
    }

    const shapeTool = <button className="tool" onClick={()=>{
        setSelectingShape(prev=>!prev);
    }}>
        {
            selectedShape==shapes.RECT?
            <PiRectangle className="icon"/>:(
                selectedShape==shapes.CIRC?
                <GoCircle  className="icon"/>:(
                    selectedShape==shapes.TRIG?
                    <IoTriangleOutline  className="icon"/>:
                    <RxBox  className="icon"/>
                )
            )
        }
    </button>

    const strokeWidthTool =    
            (selectedShape=="rect" ||selectedShape=="circle" ||selectedShape=="triangle" ||selectedShape=="path" ||selectedShape=='ellipse')?
            <Slider min={1} max={20} value={strokeThickness} onChange={onThicknessChange}></Slider>:""        
         
    
    const colorPickerTool = <input
        type="color"
        value={strokeColor}
        onChange={(e) => {
        setStrokeColor(e.target.value);
    }}
  />; 

    function onThicknessChange(val){
        setStrokeThickness(val);
    }
    return(
        <> 
        <div className='Toolbar' style={{left:`${toolbarPosition.left}px`, top:`${toolbarPosition.top}px`}}>
            {
                (selectedShape=="rect" ||selectedShape=="circle" ||selectedShape=="triangle" || selectedShape=="ellipse")?shapeTool:""
            }
            {strokeWidthTool}
            {colorPickerTool}
            
        </div>
        {selectingShape?<ShapeSelector toolbarPosition={toolbarPosition} selectedShape = {selectedShape} setSelectedShape={setSelectedShape}/>:""}
        </>
    );
}

function Slider({ min, max, value, onChange }) {
    const handleChange = (event) => {
      const newValue = parseInt(event.target.value);
      onChange(newValue);
    };
  
    return (
      <div className="slider">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
        <span className="value">{value}</span>
      </div>
    );
}

const ShapeSelector = ({toolbarPosition, selectedShape , setSelectedShape})=>{
    return(
        <div className="Shape-selector" style={{left:`${ toolbarPosition.left-90}px`  ,top:`${ toolbarPosition.top+50}px`}}>
            <button className={`tool ${selectedShape==shapes.RECT?"selected":""}`} onClick={()=>{setSelectedShape(shapes.RECT)}}>
                <PiRectangle className="icon"/> 
            </button>    
            <button className={`tool ${selectedShape==shapes.CIRC?"selected":""}`} onClick={()=>{setSelectedShape(shapes.CIRC)}}>
                <GoCircle  className="icon"/> 
            </button>
            <button className={`tool ${selectedShape==shapes.TRIG?"selected":""}`} onClick={()=>{setSelectedShape(shapes.TRIG)}}>
                <IoTriangleOutline  className="icon"/> 
            </button>
            <button className={`tool ${selectedShape==shapes.ELPS?"selected":""}`} onClick={()=>{setSelectedShape(shapes.ELPS)}}>
                <RxBox  className="icon"/>
            </button>
        </div>
    );
}

export default PropertiesToolbar;