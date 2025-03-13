import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { GridData, GridSize } from '../DataTypes';
import GridPreview from './GridPreview'; 

import "./css/SavedGridsViewer.css";
import "./css/Grid.css";

export interface SavedGridsViewerProps {
  showLoadScreen: boolean;
  gridSize: GridSize;
  setGridData: Dispatch<SetStateAction<GridData[][]>>;
  showToast:(message:string)=>void;
}

function SavedGridsViewer({ showLoadScreen, gridSize, setGridData,showToast }: SavedGridsViewerProps) {
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

  return (
    showLoadScreen && (
      <div className="Load-Area">
        <button style={{ margin: "10px" }} onClick={refreshGrids}>Refresh</button>
        {grids.length === 0 ? (
          <div>Nothing to load.</div>
        ) : (
          grids.map((gridData, index) => (
            <GridPreview
              key={index}
              gridData={gridData}
              onLoad={() => loadSavedGrid(index)}
              onDelete={() => handleDelete(index)}
            />
          ))
        )}
      </div>
    )
  );
}

export default SavedGridsViewer;
