import React, {useRef, useState} from 'react';

export const Paint: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);

    const startDrawing = (e: React.MouseEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            if (ctx) {
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            }
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            if (ctx) {
                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                ctx.stroke();
            }
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'painting.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="border-b p-1 text-xs bg-gray-100 flex gap-4">
                <button onClick={clearCanvas} className="hover:bg-gray-200 px-2 py-1">Clear</button>
                <button onClick={saveImage} className="hover:bg-gray-200 px-2 py-1">Save</button>
            </div>
            <div className="flex flex-1">
                <div className="w-20 border-r p-2 bg-gray-100">
                    <div className="mb-4">
                        <div className="text-xs mb-2">Colors:</div>
                        <div className="grid grid-cols-2 gap-1">
                            {colors.map(color => (
                                <div
                                    key={color}
                                    className={`w-6 h-6 border cursor-pointer ${currentColor === color ? 'border-2 border-black' : ''}`}
                                    style={{backgroundColor: color}}
                                    onClick={() => setCurrentColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs mb-2">Brush:</div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-xs text-center">{brushSize}px</div>
                    </div>
                </div>
                <div className="flex-1 p-2">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={350}
                        className="border bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseLeave={() => setIsDrawing(false)}
                    />
                </div>
            </div>
        </div>
    );
};