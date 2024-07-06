import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRCodeDecoder = () => {
  const [decodedText, setDecodedText] = useState('');
  const canvasRef = useRef(null);

  // 上传图片并绘制到canvas上
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 解码二维码
  const decodeQR = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      setDecodedText(`Decoded QR Code: ${code.data}`);
    } else {
      setDecodedText('QR Code not found');
    }
  };

  return (
    <div>
      <h1>Decode QR Code</h1>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={decodeQR}>Decode QR</button>
      <canvas ref={canvasRef} width="400" height="400" style={{ border: '1px solid black' }}></canvas>
      <p>{decodedText}</p >
    </div>
  );
};

export default QRCodeDecoder;