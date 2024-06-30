import { Dispatch, SetStateAction, useEffect } from "react";
import { GridSize, allowedSizes } from "../DataTypes";
import "./GridSizeDropDown.css";
import TimerToggle from "./TimerToggle";
interface GridSizeDropDownProps {
    gridSize: GridSize;
    setGridSize: Dispatch<SetStateAction<GridSize>>;
    gridSizeLock: boolean;
  }
function GridSizeDropDown({ gridSize, setGridSize, gridSizeLock }: GridSizeDropDownProps){
    function handleGridSizeChange(event: React.ChangeEvent<HTMLSelectElement>){
        const newSize = parseInt(event.target.value, 10) as GridSize;
        setGridSize(newSize);
      };
      useEffect(()=>{

      },[gridSizeLock]);
    return (
    <>
    {!gridSizeLock && (

        <>
        <TimerToggle/>
        <div className="dropdown-container">
        <label htmlFor="grid-size" className="dropdown-label">Select Grid Size: </label>
        <select id="grid-size" className="dropdown-select" value={gridSize} onChange={handleGridSizeChange}>
          {allowedSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        </div>
</>
      )}
    </>
    );
}
export default GridSizeDropDown;