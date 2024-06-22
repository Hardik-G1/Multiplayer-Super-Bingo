import React from 'react';
import { GridData } from '../DataTypes';

interface GridPreviewProps {
  gridData: { name: string; data: GridData[][] };
  onLoad: () => void;
  onDelete: () => void;
}

const GridPreview: React.FC<GridPreviewProps> = ({ gridData, onLoad, onDelete }) => {
  return (
    <div className="grid-preview">
      <div className="grid-name">{gridData.name}</div>
      <div className="grid">
        {gridData.data.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="sagrid-cell">
                {cell.number}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button style={{ margin: "10px" }} onClick={onLoad}>Load</button>
      <button style={{ margin: "10px" }} onClick={onDelete}>Delete</button>
    </div>
  );
};

export default GridPreview;
