
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { GridData, GridSize } from '../DataTypes';
import { showToast } from '../Helper';

export interface SavedGridsViewerProps {
  showLoadScreen: boolean;
  gridSize: GridSize;
  setGridData: Dispatch<SetStateAction<GridData[][]>>;
}

export default function SavedCards({ showLoadScreen, gridSize, setGridData}: SavedGridsViewerProps) {
  const [grids, setGrids] = useState<Array<{ name: string; data: GridData[][] }>>([]);
  useEffect(() => {
    refreshGrids();
  }, [gridSize]);
  const refreshGrids = () => {
    const storedGrids = localStorage.getItem(gridSize.toString());
    if (storedGrids) {
      setGrids(JSON.parse(storedGrids));
    } else {
      setGrids([]);
    }
  };
  const handleDelete = (index: number) => {
    const updatedGrids = grids.filter((_, i) => i !== index);
    localStorage.setItem(gridSize.toString(), JSON.stringify(updatedGrids));
    setGrids(updatedGrids);
    showToast("Successfully Deleted Saved Grid.");
  };
  
  const loadSavedGrid = (index: number) => {
    setGridData(grids[index].data);
    showToast("Successfully Loaded Saved Grid.");
  };
  const renderSavedCard = (card: { name: string; data: GridData[][] }, index: number) => {
    return (
      <div className="saved-card" key={index}>
        <h3>{card.name}</h3>
        <div className="saved-card-grid">
          {card.data.map((row, rowIdx) => (
            <div key={rowIdx} className="saved-number">
              {row.map((cell, cellIdx) => (
                <div key={cellIdx} className="saved-cell">
                  {cell.number}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="saved-card-actions">
          <button onClick={()=> loadSavedGrid(index)} className="btn white-btn">Load</button>
          <button onClick={()=> handleDelete(index)} className="btn white-btn">Delete</button>
        </div>
      </div>
    )
  }

  return (
    showLoadScreen && (
    <div className="game-column saved-cards-column">
      <div className="saved-cards-header">
        <button onClick={refreshGrids} className="btn white-btn">Refresh</button>
      </div>
      {grids.length === 0 ? (
        <div className="saved-cards-list">Nothing to load.</div>
      ) : (
        <div className="saved-cards-list">{grids.map((gridData, index) => renderSavedCard(gridData, index))}</div>
      )}
    </div>
  ));
}






