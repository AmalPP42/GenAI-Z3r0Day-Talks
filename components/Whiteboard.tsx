
import React, { useRef, useEffect, useState } from 'react';

interface WhiteboardProps {
  readOnly?: boolean;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ readOnly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clear = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className={`relative w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${readOnly ? 'cursor-default' : 'cursor-crosshair'}`}>
      {!readOnly && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 p-2 bg-zinc-900/90 border border-zinc-700 rounded-lg shadow-xl backdrop-blur-sm">
          <button 
            onClick={clear}
            className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 rounded-md transition-all"
            title="Clear Whiteboard"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <div className="w-full h-px bg-zinc-700 my-1"></div>
          {['#10b981', '#3b82f6', '#f43f5e', '#fafafa'].map(c => (
            <button 
              key={c}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-md border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      <canvas 
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block"
      />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-700 flex items-center gap-4 text-xs font-bold text-zinc-400">
        <span className="uppercase tracking-widest text-[10px]">
          {readOnly ? 'Host Presentation Canvas (View Only)' : 'Researcher Whiteboard Canvas'}
        </span>
        {!readOnly && (
          <div className="flex items-center gap-2 border-l border-zinc-700 pl-4">
            <span>Brush:</span>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-emerald-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
