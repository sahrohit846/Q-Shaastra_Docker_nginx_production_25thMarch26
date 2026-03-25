// let mycontainer = document.getElementById("circuitData");
// console.log("Fetched element Sucessfully", mycontainer);
// function handleSubmit() {
//   const dataTable = document.getElementById("dataTable");
//   const matrix = [];
//   let matrixString = [""]; // Variable to store the string representation of the matrix

//   // Iterate over each row in dataTable
//   dataTable.querySelectorAll("tr").forEach((row, rowIndex) => {
//     const rowData = [];
//     let highestFilledIndex = -1; // Track the highest filled index in the current row
//     let maxFilledIndex = -1; // Track the maximum index of filled cells in the current row

//     // Check if the row contains .gateWire class
//     const hasGateWire = row.classList.contains("gateWire");

//     // Iterate over each cell in the row
//     row.querySelectorAll("td").forEach((cell, index) => {
//       // Check if the cell is filled
//       const isCellFilled = cell.children.length > 0;

//       if (isCellFilled) {
//         // Update the highestFilledIndex if the current index is greater than the current highestFilledIndex
//         highestFilledIndex = Math.max(highestFilledIndex, index);
//         // Update the maxFilledIndex with the current index
//         maxFilledIndex = index;

//         // Get the ID (text) of the image in the cell
//         const imageId = cell.firstElementChild.id;
//         rowData.push(imageId);
//       } else {
//         // If the row contains .gateWire class and the current index matches the next row's index, put 'X'
//         if (hasGateWire && rowIndex + 1 < dataTable.rows.length) {
//           const nextRow = dataTable.rows[rowIndex + 1];
//           const nextCell = nextRow.cells[index];
//           if (nextCell.children.length > 0) {
//             rowData.push("X");
//           } else {
//             // Fill with "I" if no "X" is present in the next row
//             rowData.push("I");
//           }
//         } else {
//           // If the cell is empty and its index is less than or equal to the highestFilledIndex, push "I"
//           if (index <= highestFilledIndex) {
//             rowData.push("I");
//           } else {
//             // If the cell is empty and its index is greater than the highestFilledIndex, fill it with "I"
//             rowData.push("I");
//           }
//         }
//       }
//     });

//     // Push the row data to the matrix if there's any content
//     if (rowData.length > 0) {
//       // Reduce the size of the row matrix up to the last filled cell
//       matrix.push(rowData.slice(0, maxFilledIndex + 1));
//     }

//     // Print the maxFilledIndex for each row
//     console.log(`Max filled index in row ${row.id}: ${maxFilledIndex + 1}`);
//   });

//   // If the matrix is empty after processing all rows or only contains empty rows, print a message to the console
//   if (
//     matrix.length === 0 ||
//     matrix.every((row) => row.every((cell) => cell === ""))
//   ) {
//     console.log("No circuit is designed yet");
//     return; // Exit the function early
//   }

//   // Generate the string representation of the matrix
//   matrixString = matrix.map((row) => "[ " + row.join("  , ") + " ]").join("\n");

//   // Print the generated matrix string to console for testing
//   console.log("Matrix:");


  
//   console.log(matrixString);



//   mycontainer.innerText = matrixString;

//   // Print the number of rows with content
//   console.log("Number of rows with content: " + matrix.length);
// }







// ************************************************************************


// // This version uses the gate names directly instead of IDs
// // Quantum gate matrices
// const gateMatrices = {
//   "Pauli-X": [[0, 1], [1, 0]],
//   "Pauli-Y": [[0, "-i"], ["i", 0]],
//   "Pauli-Z": [[1, 0], [0, -1]],
//   "Hadamard": [[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]],
//   "S": [[1, 0], [0, "i"]],
//   "T": [[1, 0], [0, "exp(iπ/4)"]],
//   "Rx": "Rx(theta)",  // Placeholder for rotation around X (add specifics for angles if required)
//   "Ry": "Ry(theta)",  // Placeholder for rotation around Y
//   "Barrier": "Barrier", // Not a numeric gate
//   "CNOT": "CNOT", // Placeholder for 2-bit gate, handle specially
//   "CZ": "CZ",  // Placeholder for 2-bit gate
//   "Swap": "SWAP",  // Placeholder for 2-bit gate
//   "Toffoli": "Toffoli", // Placeholder for 3-bit gate
//   "Measurement": "Measurement"  // Not a gate but a measurement step
// };

// function handleSubmit() {
//   const dataTable = document.getElementById("dataTable");
//   const matrix = [];

//   // Iterate over each row in dataTable
//   dataTable.querySelectorAll("tr").forEach((row, rowIndex) => {
//     const rowData = [];
//     let maxFilledIndex = -1;     // Track the maximum index of filled cells in the current row
//     const hasGateWire = row.classList.contains("gateWire"); // Check for .gateWire class

//     // Iterate over each cell in the row
//     row.querySelectorAll("td").forEach((cell, index) => {
//       const isCellFilled = cell.children.length > 0;

//       if (isCellFilled) {
//         maxFilledIndex = index;

//         // Assuming the image ID is the gate name like "Pauli-Y", "Hadamard", etc.
//         const gateName = cell.firstElementChild.id;  // Get the image ID as the gate name

//         // Check if the gate has a numeric matrix representation
//         if (gateMatrices[gateName]) {
//           rowData.push(gateMatrices[gateName]);  // Store the numeric matrix or placeholder
//         } else {
//           rowData.push(gateName);  // If no numeric matrix, store the gate name
//         }
//       } else {
//         // Check for gateWire and next row logic
//         if (hasGateWire && rowIndex + 1 < dataTable.rows.length) {
//           const nextCell = dataTable.rows[rowIndex + 1].cells[index];
//           rowData.push(nextCell.children.length > 0 ? "X" : "I");
//         } else {
//           rowData.push("I");
//         }
//       }
//     });

//     // Add the row data to the matrix if it's not empty
//     if (rowData.length > 0) {
//       matrix.push(rowData.slice(0, maxFilledIndex + 1));
//     }

//     console.log(`Max filled index in row ${row.id}: ${maxFilledIndex + 1}`);
//   });

//   // If no valid circuit data is found, exit
//   if (matrix.length === 0 || matrix.every((row) => row.every((cell) => cell === ""))) {
//     console.log("No circuit is designed yet");
//     return;
//   }

//   // Print the final matrix array containing gate names or numeric representations
//   console.log("Matrix (Gate Data):");
//   console.log(matrix);

//   // Optionally format the matrix for display purposes
//   const matrixString = matrix.map((row) => 
//     "[ " + row.map((cell) => Array.isArray(cell) ? JSON.stringify(cell) : cell).join(" , ") + " ]"
//   ).join("\n");

//   // Display the string in the container
//   mycontainer.innerText = matrixString;

//   // Log the number of rows with data
//   console.log("Number of rows with content: " + matrix.length);
// }



// ***********************************************

// Mapping of gate names to corresponding numbers
const gateToNumber = {
  "Pauli-X": 1,
  "Pauli-Y": 2,
  "Pauli-Z": 3,
  "Hadamard": 4,
  "S": 5,
  "T": 6,
  "Rx": 7,
  "Ry": 8,
  
  "CNOT": 9,
  "CZ": 10,
  "Swap": 11,
  "Toffoli": 12,
  "Measurement": 13,
  "Barrier": 0
};

let mycontainer = document.getElementById("circuitData");
console.log("Fetched element successfully", mycontainer);

function handleSubmit() {
  const dataTable = document.getElementById("dataTable");
  const numRows = dataTable.rows.length;
  const numCols = dataTable.rows[0].cells.length;
  const matrix = Array.from({ length: numCols }, () => Array(numRows).fill(-1)); // Initialize matrix with -1

  // Iterate over each column (index-based)
  for (let colIndex = 0; colIndex < numCols; colIndex++) {
    // Iterate over each row for the current column
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const cell = dataTable.rows[rowIndex].cells[colIndex];
      const isCellFilled = cell.children.length > 0;

      if (isCellFilled) {
        // Get the gate name and map it to a number
        const gateName = cell.firstElementChild.id;
        const gateNumber = gateToNumber[gateName] || -1; // Use -1 if gate is not in the mapping
        matrix[colIndex][rowIndex] = gateNumber; // Update the matrix with gate number
      }
    }
  }

  // Remove columns and rows that only have -1 (i.e., empty space)
  const filteredMatrix = matrix.map(column => {
    // Filter out trailing -1 values in each column (right-side trimming)
    let lastNonNegativeIndex = column.length - 1;
    while (lastNonNegativeIndex >= 0 && column[lastNonNegativeIndex] === -1) {
      lastNonNegativeIndex--;
    }
    return column.slice(0, lastNonNegativeIndex + 1);
  }).filter(column => column.length > 0); // Filter out empty columns

  // Transpose the matrix (rows become columns and columns become rows)
  const transposedMatrix = filteredMatrix[0].map((_, colIndex) => filteredMatrix.map(row => row[colIndex] || -1));

  // If no valid circuit data is found, exit
  if (transposedMatrix.length === 0) {
    console.log("No circuit is designed yet");
    return;
  }

  // Print the transposed matrix array containing numeric values
  console.log("Transposed Matrix (Numeric Gate Data - Column Wise):");
  console.log(transposedMatrix);

  // Format the transposed matrix for display purposes
  const matrixString = transposedMatrix.map((row) => "[ " + row.join(" , ") + " ]").join("\n");

  // Display the transposed matrix string in the container
  mycontainer.innerText = matrixString;

  // Log the number of columns with content
  console.log("Number of columns with content after transpose: " + transposedMatrix.length);
}
