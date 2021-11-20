import { useEffect, useRef, useCallback, useState } from 'react';
import Toolbar from './Toolbar';


function Canvas() {
  // @desc ref object that holds the reference to our canvas element. ref objects can store references to elements AND to preserve any kind of info we need between rerenders
  const canvasRef = useRef(null); 
  const contextRef = useRef(null);

  const [ isDrawing, setIsDrawing ] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(5);

  const selectedColor = useRef("#000000");
  const selectedLineWidth = useRef(5);
  const direction = useRef(true);

  // @desc initializes canvas api when component is mounted
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${document.body.clientWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // @desc context to allow us to draw on canvas which is needed in startDrawing, finish, and draw
    const context = canvas.getContext('2d');

    context.scale(2,2);
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    contextRef.current = context;
  }, [])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = selectedColor.current;
    contextRef.current.lineWidth = selectedLineWidth.current;
    setCurrentColor(selectedColor.current);
    dynamicLineWidth(selectedLineWidth.current);


    setIsDrawing(true);
  }

  const dynamicLineWidth = useCallback(() =>{
    if(!contextRef || !contextRef.current) return;

    if(contextRef.current.lineWidth > 90 || contextRef.current.lineWidth <10){
      direction.current = !direction.current;
  }    
    direction.current ? contextRef.current.lineWidth++ : contextRef.current.lineWidth--;
    setCurrentWidth(contextRef.current.lineWidth);
  },[]);



  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke()
  };

  const handleColor =(e) =>{
    setCurrentColor(e.currentTarget.value);
    selectedColor.current = e.currentTarget.value;
  };

  const handleWidth = (e) => {
    setCurrentWidth(e.currentTarget.value);
    selectedLineWidth.current = e.currentTarget.value;
  };

  return(
    <>
      <Toolbar handleColor={handleColor} handleWidth={handleWidth}/>
      <canvas 
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        style={{border:'1px solid black'}}
      />
    </>
  )
}

export default Canvas;