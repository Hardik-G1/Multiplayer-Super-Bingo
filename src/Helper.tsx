import { toast } from "react-toastify";
import { GridData, GridSize, SavedGridInfo } from "./DataTypes";

export function getRandomFillData(size: GridSize){
      // Create an array of numbers from 1 to n^2
      let numbers = Array.from({ length: size*size }, (_, i) => i + 1);
  
      // Shuffle the numbers array using Fisher-Yates algorithm
      for (let i = numbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }

      // Initialize an empty array to hold the matrix
      let matrix = [];

      // Fill the matrix with the shuffled numbers
      for (let i = 0; i < size; i++) {
          let row = [];
          for (let j = 0; j < size; j++) {
             let data={"number":"1","struck":false} as GridData;
              data.number=numbers[i * size + j].toString();
              row.push(data);
          }
          matrix.push(row);
      }
     return matrix as GridData[][];
  }
  export function getStraightLines(matrix :GridData[][]){
    let count = 0;

    // Check rows
    for (let row of matrix) {
      if (row.every(cell => cell.struck)) count++;
    }

    // Check columns
    for (let col = 0; col < matrix.length; col++) {
      let colFull = true;
      for (let row = 0; row < matrix.length; row++) {
        if (!matrix[row][col].struck) {
          colFull = false;
          break;
        }
      }
      if (colFull) count++;
    }

    // Check diagonals
    let diag1Full = true;
    let diag2Full = true;
    for (let i = 0; i < matrix.length; i++) {
      if (!matrix[i][i].struck) diag1Full = false;
      if (!matrix[i][matrix.length - 1 - i].struck) diag2Full = false;
    }
    if (diag1Full) count++;
    if (diag2Full) count++;

    return count;
  };


  export function saveGridDataInLocal(gridData:GridData[][],name:string,gridSize:GridSize){
    const key = gridSize.toString();
    const storedString = localStorage.getItem(key);
    
    // Retrieve the existing list from local storage, or initialize a new list if none exists
    const savedGridInfoList: SavedGridInfo[] = storedString ? JSON.parse(storedString) : [];
    
    // Add the new grid information to the list
    savedGridInfoList.push({ name, data: gridData });
    
    // Serialize the updated list and store it back in local storage
    const serializedList = JSON.stringify(savedGridInfoList);
    localStorage.setItem(key, serializedList);

  }

    export function showToast(message:string){
      toast(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        });
    } 