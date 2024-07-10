import { Dispatch, SetStateAction } from "react";
import { GridSize, allowedSizes } from "../DataTypes";
import "./css/GridSizeDropDown.css";
interface GridSizeDropDownProps {
    gridSize: GridSize;
    setGridSize: Dispatch<SetStateAction<GridSize>>;
  }
function GridSizeDropDown({ gridSize, setGridSize }: GridSizeDropDownProps){
    function handleGridSizeChange(event: React.ChangeEvent<HTMLSelectElement>){
        const newSize = parseInt(event.target.value, 10) as GridSize;
        setGridSize(newSize);
      };
    return (
    <>
        <div>
        <label htmlFor="grid-size"  className="toggle-label" >Select Grid Size: </label>
        <select id="grid-size" className="dropdown-select" value={gridSize} onChange={handleGridSizeChange}>
          {allowedSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        </div>
    </>
    );
}
export default GridSizeDropDown;