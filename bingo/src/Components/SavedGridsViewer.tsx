import  { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { GridData, GridSize } from '../DataTypes';

import "./SavedGridsViewer.css";
import "./Grid.css";
export interface SavedGridsViewerProps {
    showLoadScreen: boolean;
    gridSize: GridSize;
    setGridData:Dispatch<SetStateAction<GridData[][]>>;
}

function SavedGridsViewer({ showLoadScreen, gridSize,setGridData }: SavedGridsViewerProps) {
    const [grids, setGrids] = useState<Array<{ name: string; data: GridData[][] }>>([]);

    useEffect(() => {
        Refresh()
    }, [gridSize]);
    function Refresh(){
        const storedGrids = localStorage.getItem(gridSize.toString());
        if (storedGrids) {
            setGrids(JSON.parse(storedGrids));
        }
    }
    function handleDelete(index:number){
        const a=[...grids.slice(0, index), ...grids.slice(index + 1)];
        console.log(a);
        const serializedList = JSON.stringify(a); 
        localStorage.setItem(gridSize.toString(), serializedList);
        setGrids([]);
    }
    function loadSavedGrid(index:number){
        setGridData(grids[index].data);
    }
    return (
        showLoadScreen && (<>
            <div className="Load-Area">
            <button style={{margin:"10px"}} onClick={Refresh}>Refresh</button>
                {grids.map((gridData, index) => (
                    <div key={index} className="grid-preview">
                        <div className="grid-name">{gridData.name}</div>
                        <div className="grid">
                            {gridData.data.map((row, rowIndex) => (
                                <div key={rowIndex} className="grid-row">
                                    {row.map((cell, cellIndex) => (
                                        <div key={cellIndex} className={`sagrid-cell`}>
                                            {cell.number}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <button style={{margin:"10px"}} onClick={()=>loadSavedGrid(index)}>Load</button>
                        <button style={{margin:"10px"}} onClick={()=>handleDelete(index)}>Delete</button>
                    </div>
                ))}
            </div>
            </>
        )
    );
}

export default SavedGridsViewer;
