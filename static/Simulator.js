

// Arrays to store the history of dropped images and their corresponding cells
let dropHistory = [];
let rowCount = 0; // Initialize rowCount variable
var rowMatrix = []; // Define rowMatrix to store row data

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Store the dragged element's ID from table 1
  event.dataTransfer.setData("text/plain", event.target.alt);
}

// Select the table element and also updating the number of rows in the table
const table2Cells = document.querySelector(".table2 tbody");

// Function to update the rowCount variable
function updateRowCount() {
  rowCount = table2Cells.querySelectorAll("tr").length;
}

// Initial call to updateRowCount to set the initial value
updateRowCount();

// Observer to watch for changes in the table - This set of code is for barGraph  send number of rows
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // If nodes are added or removed, update the rowCount variable
    if (mutation.type === "childList") {
      updateRowCount();
    }
  });
});

// Configure the observer to watch for changes in the table
const config = { childList: true, subtree: true };

// Start observing the table for changes
observer.observe(table2Cells, config);

// Define the dropLogo function outside of the if condition
function dropLogo(e) {
  e.preventDefault();

  const targetCell = e.currentTarget;
  const draggedImageAlt = e.dataTransfer.getData("text/plain");

  // Find the adjacent row element
  const adjacentRow = targetCell.closest("tr");

  // Find the first available empty cell in the adjacent row
  const nextEmptyCell = Array.from(adjacentRow.children).find(
    (cell) => cell.childElementCount === 0
  );

  // Ensure nextEmptyCell is not null before proceeding
  if (nextEmptyCell) {
    // If there is an empty cell in the adjacent row, drop the image
    // Check if the cell already contains an image, remove it
    if (nextEmptyCell.children.length > 0) {
      nextEmptyCell.removeChild(nextEmptyCell.children[0]);
    }

    const newImage = createImageElement(draggedImageAlt);

    // ********************************Single bit gate Applied here**********************************
    if (
      newImage.id === "Pauli-X" ||
      newImage.id === "Pauli-Y" ||
      newImage.id === "Pauli-Z" ||
      newImage.id === "Hadamard" ||
      newImage.id === "S" ||
      newImage.id === "T" ||
      newImage.id === "Barrier" ||
      newImage.id === "Rx" ||
      newImage.id === "Ry" ||
      newImage.id === "Ry" ||
      newImage.id === "cnots" ||
      newImage.id === "Measurement"
    ) {
      {
        // If the dropped image is a measurement gate, generate and print the row matrix
        if (newImage.id === "Measurement") {
          generateAndPrintRowMatrix(adjacentRow);
        }

        // Append the new image to the next empty cell
        nextEmptyCell.appendChild(newImage);
      }

      console.log(newImage.id, "gate inserted into circuit");
    }
    // ******************************** 2-Bit Gate Applied
    else if (
      (newImage.id === "CNOT" ||
        newImage.id === "CZ" ||
        newImage.id === "Swap") &&
      rowCount >= 2
    ) {
      // Check if table2 has at least 2 rows
      const droppedRowIndex = Array.from(
        adjacentRow.parentElement.children
      ).indexOf(adjacentRow);
      if (droppedRowIndex >= 1) {
        // Allow drop on rows at index 1 or higher
        if (adjacentRow.id !== "0") {
          // Apply gateWire class to the corresponding cell in the previous row
          const previousRow = adjacentRow.previousElementSibling;
          if (previousRow) {
            const correspondingCell = previousRow.querySelector(
              `td:nth-child(${
                Array.from(adjacentRow.children).indexOf(nextEmptyCell) + 1
              })`
            );
            if (
              correspondingCell &&
              correspondingCell.childElementCount === 0
            ) {
              const gateWireDiv = document.createElement("div");
              gateWireDiv.classList.add("gateWire");
              gateWireDiv.classList.add("vertical-line"); // Add CSS class for vertical line
              correspondingCell.appendChild(gateWireDiv);
            }
          }
        }

        // Insert the newImage into the nextEmptyCell
        nextEmptyCell.appendChild(newImage);

        console.log(newImage.id, "gate inserted into circuit");
        console.log("2 bit gate Updated soon .....!");
      }
    }

    // ********************************************* Multi-bit gate *******************.......!!!!!!!!!!!
    else if (newImage.id === "Toffoli" && rowCount >= 3) {
      // Check if table2 has at least 3 rows
      const droppedRowIndex = Array.from(
        adjacentRow.parentElement.children
      ).indexOf(adjacentRow);
      if (droppedRowIndex >= 2) {
        // Allow drop on rows at index 2 or higher
        if (adjacentRow.id !== "0") {
          // Apply gateWire class to the corresponding cell in the previous previous row (current row - 2)
          const previousPreviousRow =
            adjacentRow.parentElement.children[droppedRowIndex - 2];
          if (previousPreviousRow) {
            const correspondingCell = previousPreviousRow.querySelector(
              `td:nth-child(${
                Array.from(adjacentRow.children).indexOf(nextEmptyCell) + 1
              })`
            );
            if (
              correspondingCell &&
              correspondingCell.childElementCount === 0
            ) {
              const gateWireDiv = document.createElement("div");
              gateWireDiv.classList.add("gateWireE");
              gateWireDiv.classList.add("vertical-line"); // Add CSS class for vertical line
              correspondingCell.appendChild(gateWireDiv);
            }
          }
          const previousRow = adjacentRow.previousElementSibling;
          if (previousRow) {
            const correspondingCell = previousRow.querySelector(
              `td:nth-child(${
                Array.from(adjacentRow.children).indexOf(nextEmptyCell) + 1
              })`
            );
            if (
              correspondingCell &&
              correspondingCell.childElementCount === 0
            ) {
              const gateWireDiv = document.createElement("div");
              gateWireDiv.classList.add("gateWire");
              gateWireDiv.classList.add("vertical-line"); // Add CSS class for vertical line
              correspondingCell.appendChild(gateWireDiv);
            }
          }
        }

        // Insert the newImage into the nextEmptyCell
        nextEmptyCell.appendChild(newImage);

        console.log(newImage.id, "gate inserted into circuit");
        console.log("3 bit gate Updated soon .....!");
      }
    }

    // Clear redo history when a new drop occurs
    dropHistory = [];
  } else {
    console.alert("Error: No empty cell found in the adjacent row.");
  }
}

// Function to create a new image element
function createImageElement(altText) {
  // Extract the filename from the altText (assuming it's a URL)
  const filename = altText.split("/").pop().split(".")[0];

  // Create the new image element
  const newImage = document.createElement("img");
  newImage.src = altText;
  newImage.alt = filename;
  newImage.id = filename; // Set the id attribute to the filename

  // Set the width and height of the new image to 1cm x 1cm
  newImage.style.width = "1cm";
  newImage.style.height = "1cm";
  newImage.style.zIndex = "1";
  newImage.style.opacity = "1";

  // Exclude setting background color if newImage.id is "Barrier"
  if (newImage.id !== "Barrier") {
    newImage.style.backgroundColor = "#f9e0b3";
  }

  // Attach click event listener to show pop-up menu
  newImage.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent propagation to parent elements

    // Create the pop-up menu
    const popupMenu = createPopupMenu(newImage, newImage.parentNode);

    // Position the pop-up menu relative to the clicked image
    const rect = newImage.getBoundingClientRect();
    popupMenu.style.position = "absolute";
    popupMenu.style.top = rect.bottom + "px";
    popupMenu.style.left = rect.left + "px";

    // Append the pop-up menu to the body
    document.body.appendChild(popupMenu);

    // Close the pop-up menu when clicking outside of it
    document.addEventListener("click", function closeMenu(event) {
      if (!popupMenu.contains(event.target)) {
        document.removeEventListener("click", closeMenu);
        popupMenu.remove();
      }
    });
  });

  return newImage;
}

//***************************** */ Function to create the pop-up menu (DELete Option)
function createPopupMenu(image, cell) {
  // Create the pop-up menu container
  const popupMenu = document.createElement("div");
  popupMenu.classList.add("popup-menu");

  // Create the remove option with the SVG icon
  const removeOption = document.createElement("div");
  removeOption.classList.add("popup-option");
  removeOption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg>`; // SVG icon for the dustbin

  // Add event listener to remove the image and corresponding gateWire div
  removeOption.addEventListener("click", function () {
    // Remove the image from the cell
    cell.removeChild(image);


    
    // Remove the corresponding gateWire div if it exists @ 2-bit gate wire operation
    if (
      image.id === "CNOT" ||
      image.id === "CZ" ||
      image.id === "Swap" ||
      image.id === "Toffoli"
    ) {
      const rowIndex = cell.parentElement.rowIndex;
      const cellIndex = cell.cellIndex;
      const table = cell.closest("table");
      const prevRow = table.rows[rowIndex - 1];
      if (prevRow) {
        const prevCell = prevRow.cells[cellIndex];
        if (prevCell && prevCell.firstElementChild) {
          //******** */
          prevCell.firstElementChild.remove();
        }
      }
    } 

    //JS to remove the divWireE applied @ 3 bit gate  Remove the corresponding gateWire div if it exists

    if (image.id === "Toffoli") {
      const rowIndex = cell.parentElement.rowIndex;

      const cellIndex = cell.cellIndex;

      const table = cell.closest("table");

      const prevRow = table.rows[rowIndex - 2];
      if (prevRow) {
        const prevCell = prevRow.cells[cellIndex]; // Getting the cell in the previous row at the same index

        if (prevCell && prevCell.firstElementChild) {
          // Check if the cell exists and contains a child element
          console.log("#bit wire operation", prevCell);
          prevCell.firstElementChild.remove(); // Remove the first child element (assuming it's the gateWireE div)
          console.log("# bit wire deleted successfully");
        }
      }
    }

    // Remove the image from the drop history
    const index = dropHistory.findIndex((item) => item.image === image);
    if (index !== -1) {
      dropHistory.splice(index, 1);
    }

    // Hide the pop-up menu
    popupMenu.style.display = "none";
  });

  // Add options to the pop-up menu
  popupMenu.appendChild(removeOption);

  // Add event listener to hide the pop-up menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!popupMenu.contains(event.target)) {
      popupMenu.style.display = "none";
    }
  });

  return popupMenu;
}   