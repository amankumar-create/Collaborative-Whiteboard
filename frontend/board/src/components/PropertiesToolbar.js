import {useEffect, useState} from "react";
import { GoCircle } from "react-icons/go";
import { MdOutlineRectangle } from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";
import { PiRectangleLight } from "react-icons/pi";

const shapes = {
    CIRC: "circle",
    RECT:"rect",
    TRIG: "triangle"
}

const PropertiesToolbar = ({canvas})=>{
 
    const [selectedShape, setSelectedShape] = useState();
    const [toolbarPosition, setToolbarPosition] = useState({left:"0px", top:"0px"});

    useEffect(()=>{
        setSelectedShape(canvas.getActiveObject().type);
        updateToolbarPosition();
        canvas.on('mouse:up', ()=>{
            updateToolbarPosition();
        });
    },[]);

    function updateToolbarPosition() {
        const objectInFocus = canvas.getActiveObject();
        if(objectInFocus==null) return;
        const boundingRect = objectInFocus.getBoundingRect();
       
        const left = boundingRect.left + 'px';
        const top = boundingRect.top- 100 + 'px';
        setToolbarPosition({left:left, top:top});
    }

    const shapeTool = <button className="tool">
        {
            selectedShape==shapes.RECT?
            <MdOutlineRectangle className="icon"/>:(
                selectedShape==shapes.CIRC?
                <GoCircle  className="icon"/>:(
                    selectedShape==shapes.TRIG?
                    <IoTriangleOutline  className="icon"/>:
                    <PiRectangleLight  className="icon"/>
                )
            )
        }
    </button>

    return(
        <div className='Toolbar' style={{left:toolbarPosition.left, top:toolbarPosition.top}}>
            {
                (selectedShape=="rect" ||selectedShape=="circle" ||selectedShape=="triangle")?shapeTool:""
            }

        </div>
    );
}

export default PropertiesToolbar;