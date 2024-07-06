import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [qrValue, setQrValue] = useState('');

  // 更新表单字段的处理函数
  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // 生成二维码值的处理函数
  const generateQRCode = () => {
    const qrData = `BSB:${bsb};Account:${accountNumber};Name:${name}`;
    setQrValue(qrData);
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <div>
        <label>BSB:</label>
        <input type="text" value={bsb} onChange={handleChange(setBsb)} />
      </div>
      <div>
        <label>Account Number:</label>
        <input type="text" value={accountNumber} onChange={handleChange(setAccountNumber)} />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={handleChange(setName)} />
      </div>
      <button onClick={generateQRCode}>Generate QR Code</button>

      {qrValue && (
        <div>
          <h2>Generated QR Code:</h2>
          <QRCode value={qrValue} size={256} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;