import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import jsQR from 'jsqr';
import './App.css';

const QRCodeGenerator = ({ loggedInUser, onQRCodeGenerated }) => {
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [qrValue, setQrValue] = useState('');

  const generateQRCode = () => {
    const qrData = `BSB:${bsb};Account:${accountNumber};Name:${name}`;
    const qrCodeId = `qr-${Date.now()}`; // 使用时间戳生成唯一标识符
    localStorage.setItem(qrCodeId, qrData); // 存储二维码数据
    setQrValue(qrCodeId); // 使用唯一标识符作为二维码值
    onQRCodeGenerated(qrCodeId); // 通知父组件生成了新二维码
    console.log(`Generated QR Code ID: ${qrCodeId}, Data: ${qrData}`); // 打印调试信息
  };

  return (
    <div className="qr-generator">
      <h2>Generate QR Code</h2>
      <input className="input-field" placeholder="BSB" value={bsb} onChange={(e) => setBsb(e.target.value)} />
      <input className="input-field" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
      <input className="input-field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button className="action-button" onClick={generateQRCode}>Generate</button>
      <div className="qr-code-display">
        {qrValue && <QRCode value={qrValue} size={256} />}
      </div>
    </div>
  );
};

const QRCodeDecoder = ({ usedQRCodes, onQRCodeUsed }) => {
  const [decodedText, setDecodedText] = useState('');
  const canvasRef = useRef(null);

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

  const decodeQR = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      console.log(`Decoded QR Code ID: ${code.data}`); // 打印解码信息
      const qrData = localStorage.getItem(code.data);
      if (qrData && !usedQRCodes.includes(code.data)) {
        setDecodedText(`Decoded QR Code: ${qrData}`);
        onQRCodeUsed(code.data); // 标记为已使用
      } else {
        setDecodedText('QR Code not found or already used');
      }
    } else {
      setDecodedText('QR Code not found');
    }
  };

  return (
    <div className="qr-decoder">
      <h2>Decode QR Code</h2>
      <input type="file" onChange={handleImageUpload} />
      <button className="action-button" onClick={decodeQR}>Decode</button>
      <canvas ref={canvasRef} className="qr-canvas"></canvas>
      <p className="decoded-info">{decodedText}</p >
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
      onLogin(username);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="action-button" type="submit">Login</button>
      </form>
    </div>
  );
};

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
      alert('Username already exists');
    } else {
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      onRegister(username);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="action-button" type="submit">Register</button>
      </form>
    </div>
  );
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [usedQRCodes, setUsedQRCodes] = useState([]);

  const handleQRCodeGenerated = (qrCodeId) => {
    // 在生成时不应该标记二维码为已使用
    console.log(`Generated QR Code ID: ${qrCodeId}`);
  };

  const handleQRCodeUsed = (qrCodeId) => {
    setUsedQRCodes([...usedQRCodes, qrCodeId]);
    console.log(`Used QR Code ID: ${qrCodeId}`);
  };

  return (
    <div className="App">
      {loggedInUser ? (
        <>
          <h1>Welcome, {loggedInUser}</h1>
          <QRCodeGenerator loggedInUser={loggedInUser} onQRCodeGenerated={handleQRCodeGenerated} />
          <QRCodeDecoder usedQRCodes={usedQRCodes} onQRCodeUsed={handleQRCodeUsed} />
        </>
      ) : (
        <>
          <Login onLogin={setLoggedInUser} />
          <Register onRegister={setLoggedInUser} />
        </>
      )}
    </div>
  );
};

export default App;