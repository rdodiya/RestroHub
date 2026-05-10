import { useState } from 'react';
import QRHeader from './QRHeader';
import QRStyleSelector from './QRStyleSelector';
import QRPreview from './QRPreview';

const QRDisplay = () => {
  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [qrColor, setQrColor] = useState('#000000');

  return (
    <div className="space-y-5 sm:space-y-6">
      <QRHeader />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <QRStyleSelector
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          qrColor={qrColor}
          onColorChange={setQrColor}
        />
        <QRPreview
          qrColor={qrColor}
          selectedStyle={selectedStyle}
        />
      </div>
    </div>
  );
};

export default QRDisplay;