import React, { useCallback, useEffect, useRef, useState } from 'react';
import InputRange from 'react-input-range';
import '../App.css';


function Canvas({ socket, username, roomid }) {
    const canvasRef = useRef();
    const ctx = useRef(null);

    const [current, setCurrent] = useState({});
    const [color, setColor] = useState("#000000");
    const [penSize, setPenSize] = useState(2);

    const [drawing, setIsDrawing] = useState(false);


    useEffect(() => {
        //console.log(canvasRef.current)
        ctx.current = canvasRef.current.getContext('2d');
    }, []);
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return { x, y };
    }

    socket.on('drawing', onDrawingEvent)


    function onMouseUp(e) {
        if (!drawing) { return; }
        setIsDrawing(false);
        const { x, y } = getCursorPosition(canvasRef.current, e);

        drawLine(current.x, current.y, x, y, current.color, true);
    }
    function onMouseDown(e) {
        setIsDrawing(true);
        const { x, y } = getCursorPosition(canvasRef.current, e);

        setCurrent(
            {
                x: x,
                y: y,

            })
    }
    function onMouseMove(e) {
        if (!drawing) { return; }
        const { x, y } = getCursorPosition(canvasRef.current, e);
        const j = x, k = y;
        setCurrent(
            {
                x: x,
                y: y,

            })

        drawLine(current.x, current.y, j, k, color, true);

    }
    function onDrawingEvent(data) {

        if (!canvasRef.current) return;
        var w = canvasRef.current.width;
        var h = canvasRef.current.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    function drawLine(x0, y0, x1, y1, colour, emit) {
        ctx.current.beginPath();
        ctx.current.moveTo(x0, y0);
        ctx.current.lineTo(x1, y1);
        ctx.current.strokeStyle = colour;
        ctx.current.lineWidth = 2;
        ctx.current.stroke();
        ctx.current.closePath();

        if (!emit) { return; }
        var w = canvasRef.current.width;
        var h = canvasRef.current.height;

        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
            room: roomid
        });
    }
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }



    const download = async () => {
        const image = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(image)).blob();
        const blobURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = "image.png";
        link.click();
    }

    const clear = () => {
        ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
    }



    return (
        <div className="Board">
            <canvas
                style={{
                    border: "2px solid #000",
                    backgroundColor: "white",
                    borderRadius: "5px"
                }}
                width={(window.innerWidth) / 2}
                height={(window.innerHeight) * 0.9}
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={throttle(onMouseMove, 15)}
            />
            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
            }}>
                <input type="color" value={color} onChange={e => { setColor(e.target.value); }} />
                <button onClick={clear}>Clear</button>
                <button onClick={download}>Download</button>
            </div>
        </div>
    );
}

export default Canvas;