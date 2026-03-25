// let sourceCell1 = null;
// let sourceCell2 = null;
// let draggedClass = "";

// const gridSize = 50;
// const gridCols = 270;
// const gridGroup = document.getElementById("grid");
// const parallelLineGroup = document.getElementById("parallelLine");

// let gridRows = 4;
// const maxRows = 30;

// async function addRow() {
//   console.log("add  row called");
//   if (gridRows < maxRows) {
//     gridRows++;
//     await createRow(gridRows);
//   } else {
//     alert("Reached the row limit for this version.");
//   }
//   drawParallelLinesAtEnd();
// }

// function createRow(rowNumber) {
//   return new Promise((resolve) => {
//     for (let j = 0; j < gridCols; j++) {
//       const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

//       g.setAttribute("id", `${rowNumber - 1},${j}`);
//       g.setAttribute(
//         "transform",
//         `translate(${j * gridSize}, ${(rowNumber - 1) * gridSize})`
//       );
//       g.setAttribute("class", `droppable row${rowNumber}`);

//       g.setAttribute("ondragover", "allowDrop(event)");
//       g.setAttribute("ondrop", "drop(event)");

//       const rect = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "rect"
//       );
//       rect.setAttribute("width", gridSize);
//       rect.setAttribute("height", gridSize);
//       rect.setAttribute("fill", "transparent");
//       rect.setAttribute("stroke", "none");
//       rect.setAttribute("class", `row${rowNumber}`);

//       const horizontalLine = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line"
//       );
//       horizontalLine.setAttribute("x1", 0);
//       horizontalLine.setAttribute("y1", gridSize / 2);
//       horizontalLine.setAttribute("x2", gridSize);
//       horizontalLine.setAttribute("y2", gridSize / 2);
//       horizontalLine.setAttribute("stroke", "grey");
//       horizontalLine.setAttribute("stroke-width", "2");
//       horizontalLine.setAttribute("class", `row${rowNumber}`);

//       g.appendChild(rect);
//       g.appendChild(horizontalLine);

//       gridGroup.appendChild(g);
//     }

//     resolve();
//   });
// }

// async function createInitialGrid() {
//   gridGroup.innerHTML = "";
//   for (let i = 0; i < gridRows; i++) {
//     await createRow(i + 1);
//   }

//   drawParallelLinesAtEnd();
// }

// function drawParallelLinesAtEnd() {
//   parallelLineGroup.innerHTML = "";

//   const lineYPosition = gridRows * gridSize + 20;
//   const translateX = 70;

//   // Create horizontal line
//   const horizontalLine1 = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "line"
//   );
//   horizontalLine1.setAttribute("x1", translateX);
//   horizontalLine1.setAttribute("y1", lineYPosition);
//   horizontalLine1.setAttribute("x2", translateX + gridCols * gridSize);
//   horizontalLine1.setAttribute("y2", lineYPosition);
//   horizontalLine1.setAttribute("stroke", "grey");
//   horizontalLine1.setAttribute("stroke-width", "2");

//   //  second horizontal line
//   const horizontalLine2 = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "line"
//   );
//   horizontalLine2.setAttribute("x1", translateX);
//   horizontalLine2.setAttribute("y1", lineYPosition + 5);
//   horizontalLine2.setAttribute("x2", translateX + gridCols * gridSize);
//   horizontalLine2.setAttribute("y2", lineYPosition + 5);
//   horizontalLine2.setAttribute("stroke", "grey");
//   horizontalLine2.setAttribute("stroke-width", "2");

//   // parallelLineGroup
//   parallelLineGroup.appendChild(horizontalLine1);
//   parallelLineGroup.appendChild(horizontalLine2);
// }

// // horizontal line
// function drawMeasurementLinesAtEnd() {
//   parallelLineGroup.innerHTML = "";

//   const lineYPosition = gridRows * gridSize + 20;
//   const translateX = 70;
//   const horizontalLine1 = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "line"
//   );
//   horizontalLine1.setAttribute("x1", translateX);
//   horizontalLine1.setAttribute("y1", lineYPosition);
//   horizontalLine1.setAttribute("x2", translateX + gridCols * gridSize);
//   horizontalLine1.setAttribute("y2", lineYPosition);
//   horizontalLine1.setAttribute("stroke", "grey");
//   horizontalLine1.setAttribute("stroke-width", "2");

//   const horizontalLine2 = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "line"
//   );
//   horizontalLine2.setAttribute("x1", translateX);
//   horizontalLine2.setAttribute("y1", lineYPosition + 5);
//   horizontalLine2.setAttribute("x2", translateX + gridCols * gridSize);
//   horizontalLine2.setAttribute("y2", lineYPosition + 5);
//   horizontalLine2.setAttribute("stroke", "grey");
//   horizontalLine2.setAttribute("stroke-width", "2");
//   const additionalRows = 50;
//   const newYPosition = lineYPosition + gridRows * additionalRows;
//   horizontalLine1.setAttribute("y1", newYPosition);
//   horizontalLine1.setAttribute("y2", newYPosition);
//   horizontalLine2.setAttribute("y1", newYPosition + 5);
//   horizontalLine2.setAttribute("y2", newYPosition + 5);
//   parallelLineGroup.appendChild(horizontalLine1);
//   parallelLineGroup.appendChild(horizontalLine2);
// }

// async function resetGrid() {
//   while (gridGroup.firstChild) {
//     gridGroup.removeChild(gridGroup.firstChild);
//   }

//   while (parallelLineGroup.firstChild) {
//     parallelLineGroup.removeChild(parallelLineGroup.firstChild);
//   }

//   const svgLines = document.getElementById("svgLines");
//   while (svgLines.firstChild) {
//     svgLines.removeChild(svgLines.firstChild);
//   }

//   await createInitialGrid();
//   console.log("Grid and lines have been reset and re-rendered successfully.");
// }

// document.getElementById("resetButton").addEventListener("click", resetGrid);

// function removeLastRow() {
//   if (gridRows > 1) {
//     const rows = gridGroup.querySelectorAll(`.row${gridRows}`);

//     rows.forEach((element) => {
//       element.remove();
//     });

//     gridRows--;
//     drawParallelLinesAtEnd();
//   } else {
//     alert("Can't remove the last row.");
//   }
// }

// async function removeRow() {
//   await removeLastRow();
// }

// createInitialGrid();

// // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*  Drag-Event  *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

// function drag(event) {
//   const svgElement = event.target.closest(".draggable").querySelector("svg");

//   // Check if the dragged SVG is of type 'Measurement'
//   if (svgElement.classList.contains("Measurement")) {
//     const gElement = svgElement.querySelector("g");
//     const data = gElement ? gElement.outerHTML : "";
//     event.dataTransfer.effectAllowed = "copy";
//     draggedClass = "Measurement";
//   } else {
//     // Handle other gates as before
//     const rect = svgElement.querySelector("rect")?.outerHTML || "";
//     const text = svgElement.querySelector("text")?.outerHTML || "";
//     const data = `<g>${rect}${text}</g>`;
//     event.dataTransfer.setData("text/plain", data);
//     event.dataTransfer.effectAllowed = "copy";
//     draggedClass = svgElement.classList[0];
//   }
// }

// function allowDrop(event) {
//   event.preventDefault();
// }

// function createSourceDot() {
//   const sourceDot = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "circle"
//   );
//   sourceDot.setAttribute("cx", gridSize / 2);
//   sourceDot.setAttribute("cy", gridSize / 2);
//   sourceDot.setAttribute("r", 8);
//   sourceDot.setAttribute("fill", "black");
//   return sourceDot;
// }
// function createCross() {
//   const crossGroup = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "g"
//   );
//   const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
//   const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");

//   line1.setAttribute("x1", (gridSize - 20) / 2);
//   line1.setAttribute("y1", (gridSize - 20) / 2);
//   line1.setAttribute("x2", (gridSize + 20) / 2);
//   line1.setAttribute("y2", (gridSize + 20) / 2);
//   line1.setAttribute("stroke", "black");
//   line1.setAttribute("stroke-width", "2");

//   line2.setAttribute("x1", (gridSize - 20) / 2);
//   line2.setAttribute("y1", (gridSize + 20) / 2);
//   line2.setAttribute("x2", (gridSize + 20) / 2);
//   line2.setAttribute("y2", (gridSize - 20) / 2);
//   line2.setAttribute("stroke", "black");
//   line2.setAttribute("stroke-width", "2");

//   crossGroup.appendChild(line1);
//   crossGroup.appendChild(line2);
//   return crossGroup;
// }
// function drawConnectingLine(sourceCells, targetGroup) {
//   const offSet = 70;
//   sourceCells.forEach((sourceCell) => {
//     const sourceX =
//       gridSize *
//         (Array.from(gridGroup.children).indexOf(sourceCell) % gridCols) +
//       gridSize / 2 +
//       offSet;
//     const sourceY =
//       gridSize *
//         Math.floor(
//           Array.from(gridGroup.children).indexOf(sourceCell) / gridCols
//         ) +
//       gridSize / 2;

//     const targetX =
//       gridSize *
//         (Array.from(gridGroup.children).indexOf(targetGroup) % gridCols) +
//       gridSize / 2 +
//       offSet;
//     const targetY =
//       gridSize *
//         Math.floor(
//           Array.from(gridGroup.children).indexOf(targetGroup) / gridCols
//         ) +
//       gridSize / 2;

//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", sourceX);
//     line.setAttribute("y1", sourceY);
//     line.setAttribute("x2", targetX);
//     line.setAttribute("y2", targetY);
//     line.setAttribute("class", "line");
//     line.setAttribute("stroke", "black");
//     line.setAttribute("stroke-width", "2");

//     document.getElementById("svgLines").appendChild(line);
//   });
// }

// /* Here the functionality of Drop event*/

// function drop(event) {
//   event.preventDefault();
//   const data = event.dataTransfer.getData("text/plain");
//   const targetGroup = event.target.closest("g");

//   if (!targetGroup) return;

//   console.log("Dropped SVG class:", draggedClass);

//   const newElement = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "g"
//   );
//   newElement.innerHTML = data;

//   const svgWidth = 40;
//   const svgHeight = 40;

//   const xOffset = (gridSize - svgWidth) / 2;
//   const yOffset = (gridSize - svgHeight) / 2;

//   newElement.setAttribute("transform", `translate(${xOffset}, ${yOffset})`);
//   targetGroup.appendChild(newElement);

//   const rect = newElement.querySelector("rect");

//   function appendToCircuitData(message) {
//     const circuitData = document.getElementById("circuitData");
//     circuitData.innerHTML += message + "<br>";
//   }

//   if (
//     draggedClass === "Pauli-X" ||
//     draggedClass === "Pauli-Y" ||
//     draggedClass === "Pauli-Z" ||
//     draggedClass === "H" ||
//     draggedClass === "S" ||
//     draggedClass === "T" ||
//     draggedClass === "RX" ||
//     draggedClass === "RY" ||
//     draggedClass === "RZ"
//   ) {
//     const message = `${draggedClass} (${targetGroup.id})`;
//     appendToCircuitData(message);

//     rect.setAttribute("fill", "rgb(255, 99, 71)");
//     targetGroup.appendChild(newElement);
//   } else if (draggedClass === "two-bit") {
//     const message = `${draggedClass} (drop cell ID: ${targetGroup.id}).`;
//     appendToCircuitData(message);

//     rect.setAttribute("fill", "rgb(60, 179, 113)");

//     if (sourceCell1 && targetGroup) {
//       const sourceDot = createSourceDot();
//       sourceCell1.appendChild(sourceDot);
//       drawConnectingLine([sourceCell1], targetGroup);
//       sourceCell1 = null;
//     } else {
//       sourceCell1 = targetGroup;
//     }
//   } else if (draggedClass === "toffoli") {
//     if (rect) {
//       rect.remove();
//     }

//     const sourceDots = [createSourceDot(), createSourceDot()];

//     if (!sourceCell1) {
//       sourceCell1 = targetGroup;
//       sourceCell1.appendChild(sourceDots[0]);

//       const text1 = sourceCell1.querySelector("text");
//       if (text1) {
//         text1.textContent = "";
//       }
//     } else if (!sourceCell2) {
//       sourceCell2 = targetGroup;
//       sourceCell2.appendChild(sourceDots[1]);

//       const text2 = sourceCell2.querySelector("text");
//       if (text2) {
//         text2.textContent = "";
//       }
//     } else {
//       //  add dots and draw connecting line
//       sourceCell1.appendChild(sourceDots[0]);
//       sourceCell2.appendChild(sourceDots[1]);
//       drawConnectingLine([sourceCell1, sourceCell2], targetGroup);

//       const text1 = sourceCell1.querySelector("text");
//       const text2 = sourceCell2.querySelector("text");
//       const targetText = targetGroup.querySelector("text");

//       if (text1) {
//         text1.textContent = "";
//       }
//       if (text2) {
//         text2.textContent = "";
//       }
//       if (targetText) {
//         targetText.textContent = "";
//       }

//       const logMessage = `Toffoli ((${sourceCell1.id}), (${sourceCell2.id}), (${targetGroup.id}))`;
//       appendToCircuitData(logMessage);

//       const radius = 10;
//       const centerX = targetGroup.getBBox().width / 2;
//       const centerY = targetGroup.getBBox().height / 2;

//       // Create the circle
//       const circle = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       circle.setAttribute("cx", centerX);
//       circle.setAttribute("cy", centerY);
//       circle.setAttribute("r", radius);
//       circle.setAttribute("fill", "white");
//       circle.setAttribute("stroke", "black");
//       circle.setAttribute("stroke-width", "2");
//       const plusText = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "text"
//       );
//       plusText.setAttribute("x", centerX);
//       plusText.setAttribute("y", centerY + 5);
//       plusText.setAttribute("text-anchor", "middle");
//       plusText.setAttribute("font-weight", "bold");
//       plusText.setAttribute("font-size", "20");
//       plusText.textContent = "+";
//       targetGroup.appendChild(circle);
//       targetGroup.appendChild(plusText);
//       sourceCell1 = null;
//       sourceCell2 = null;
//     }
//   } else if (draggedClass === "fredkin") {
//     rect.setAttribute("fill", "rgb(100, 149, 237)");

//     if (!sourceCell1) {
//       sourceCell1 = targetGroup;
//     } else if (!sourceCell2) {
//       sourceCell2 = targetGroup;
//     } else {
//       const sourceDots = [createSourceDot(), createSourceDot()];
//       sourceCell1.appendChild(sourceDots[0]);
//       sourceCell2.appendChild(sourceDots[1]);
//       drawConnectingLine([sourceCell1, sourceCell2], targetGroup);

//       const text1 = sourceCell1.querySelector("text");
//       const text2 = sourceCell2.querySelector("text");

//       if (text1) {
//         text1.textContent = " ";
//       }

//       if (text2) {
//         text2.textContent = " ";
//       }

//       console.log(
//         `fredkin( ${sourceCell1.id},  ${sourceCell2.id}, ${targetGroup.id})`
//       );
//       const logMessage = `Fredkin((${sourceCell1.id}), (${sourceCell2.id}), (${targetGroup.id}))`;
//       appendToCircuitData(logMessage);
//       sourceCell1 = null;
//       sourceCell2 = null;
//     }
//   } else if (draggedClass === "swap") {
//     if (rect) {
//       rect.remove();
//     }

//     targetGroup.querySelectorAll("svg").forEach((svg) => svg.remove());

//     const draggedText = targetGroup.querySelector("text");
//     if (draggedText) {
//       draggedText.textContent = "";
//     }

//     const cross = createCross();
//     targetGroup.appendChild(cross);

//     if (sourceCell1) {
//       const crossSource = createCross();
//       sourceCell1.appendChild(crossSource);
//       drawConnectingLine([sourceCell1], targetGroup);

//       console.log(`swap(${sourceCell1.id}, ${targetGroup.id})`);
//       const logMessage = `Swap((${sourceCell1.id}), (${targetGroup.id}))`;
//       appendToCircuitData(logMessage);
//       sourceCell1 = null;
//     } else {
//       sourceCell1 = targetGroup;
//     }
//   } else if (draggedClass === "cnot") {
//     if (rect) {
//       rect.remove();
//     }

//     if (sourceCell1 && targetGroup) {
//       const sourceDot = createSourceDot();
//       sourceCell1.appendChild(sourceDot);
//       drawConnectingLine([sourceCell1], targetGroup);

//       const sourceTextElement = sourceCell1.querySelector("text");
//       if (sourceTextElement) {
//         sourceTextElement.textContent = "";
//         sourceCell1.appendChild(sourceDot);
//       }

//       const targetTextElement = targetGroup.querySelector("text");
//       if (targetTextElement) {
//         targetTextElement.textContent = "";
//       }

//       // creating a circle
//       const circle = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       const radius = 10;
//       const centerX = targetGroup.getBBox().width / 2;
//       const centerY = targetGroup.getBBox().height / 2;

//       circle.setAttribute("cx", centerX);
//       circle.setAttribute("cy", centerY);
//       circle.setAttribute("r", radius);
//       circle.setAttribute("fill", "white");
//       circle.setAttribute("stroke", "black");
//       circle.setAttribute("stroke-width", "2");
//       const plusText = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "text"
//       );
//       plusText.setAttribute("x", centerX);
//       plusText.setAttribute("y", centerY + 5);
//       plusText.setAttribute("text-anchor", "middle");
//       plusText.setAttribute("font-weight", "bold");
//       plusText.setAttribute("font-size", "20");
//       plusText.textContent = "+";

//       targetGroup.appendChild(circle);
//       targetGroup.appendChild(plusText);

//       console.log(`cnot(${sourceCell1.id}, ${targetGroup.id})`);
//       const logMessage = `Cnot((${sourceCell1.id}), (${targetGroup.id}))`;
//       appendToCircuitData(logMessage);

//       sourceCell1 = null;
//     } else {
//       sourceCell1 = targetGroup;
//       const sourceDot = createSourceDot();
//       sourceCell1.appendChild(sourceDot);

//       const sourceTextElement = sourceCell1.querySelector("text");
//       if (sourceTextElement) {
//         sourceTextElement.textContent = "";
//       }
//     }
//   } else if (draggedClass === "Measurement") {
//     // Get the SVG element for the measurement gate by its ID
//     const draggedSVG = document.getElementById("MEASUREMENT");

//     // Clone the measurement SVG so it can be reused without altering the original
//     const clonedSVG = draggedSVG.cloneNode(true);

//     // Dynamically identify the target group based on the drop location
//     if (!targetGroup) {
//       // Log an error if no valid target group is identified and exit the function
//       console.error(
//         "Target group is not defined. Measurement gate cannot be placed."
//       );
//       return;
//     }

//     // Get the rectangular area of the target group (assumes the group contains a rect element)
//     const targetRect = targetGroup.querySelector("rect");
//     if (targetRect) {
//       // Change the fill color and opacity of the target rect to indicate it has been updated
//       targetRect.setAttribute("fill", "#d8f0f0");
//       targetRect.setAttribute("fill-opacity", "1");

//       // Calculate the center X coordinate and the bottom Y coordinate of the rect
//       const rectCenterX =
//         targetRect.x.baseVal.value + targetRect.width.baseVal.value / 2;
//       const rectBottomY =
//         targetRect.y.baseVal.value + targetRect.height.baseVal.value;

//       // Set the size and position of the cloned measurement SVG to match the target rect
//       clonedSVG.setAttribute("width", targetRect.width.baseVal.value);
//       clonedSVG.setAttribute("height", targetRect.height.baseVal.value);
//       clonedSVG.setAttribute(
//         "transform",
//         `translate(${targetRect.x.baseVal.value}, ${targetRect.y.baseVal.value})`
//       );

//       // Append the cloned SVG to the target group
//       targetGroup.appendChild(clonedSVG);

//       // Calculate the bottom Y-coordinate for grid lines, slightly below the grid
//       const gridBottomY = gridRows * gridSize + 20;

//       // Create the first vertical line extending from the rect bottom to the grid bottom
//       const verticalLine1 = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line"
//       );
//       verticalLine1.setAttribute("x1", rectCenterX - 2); // Slightly offset from the rect center
//       verticalLine1.setAttribute("y1", rectBottomY);
//       verticalLine1.setAttribute("x2", rectCenterX - 2);
//       verticalLine1.setAttribute("y2", gridBottomY);
//       verticalLine1.setAttribute("stroke", "grey"); // Line color
//       verticalLine1.setAttribute("stroke-width", "2"); // Line thickness

//       // Create the second vertical line on the opposite side of the center
//       const verticalLine2 = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line"
//       );
//       verticalLine2.setAttribute("x1", rectCenterX + 2); // Slightly offset from the rect center
//       verticalLine2.setAttribute("y1", rectBottomY);
//       verticalLine2.setAttribute("x2", rectCenterX + 2);
//       verticalLine2.setAttribute("y2", gridBottomY);
//       verticalLine2.setAttribute("stroke", "grey");
//       verticalLine2.setAttribute("stroke-width", "2");

//       // Function to create a downward arrow at a specified position
//       function createArrow(x, y) {
//         const arrow = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "polygon"
//         );
//         arrow.setAttribute(
//           "points",
//           `${x - 4},${y - 8} ${x + 4},${y - 8} ${x},${y}`
//         ); // Arrow points
//         arrow.setAttribute("fill", "grey"); // Arrow color
//         return arrow;
//       }

//       // Create and position the first downward arrow at the bottom of the first vertical line
//       const arrow1 = createArrow(rectCenterX - 2, gridBottomY);

//       // Create and position the second downward arrow at the bottom of the second vertical line
//       const arrow2 = createArrow(rectCenterX + 2, gridBottomY);

//       // Append the vertical lines and arrows to the target group
//       targetGroup.appendChild(verticalLine1);
//       targetGroup.appendChild(verticalLine2);
//       targetGroup.appendChild(arrow1);
//       targetGroup.appendChild(arrow2);

//       // Create a log message indicating the placement of the measurement gate
//       const message = `${draggedClass} (${targetGroup.id})`;

//       // Append the log message to the circuit data for tracking
//       appendToCircuitData(message);

//       // Log the connection between the source and target groups
//       console.log(`Measurement(${sourceCell1?.id}, ${targetGroup.id})`);
//     }

//     // Clear the source cell after the operation
//     sourceCell1 = null;
//   } else {
//     // If the dragged element is not a measurement gate, update the source cell
//     sourceCell1 = targetGroup;

//     // Create a visual representation (dot) for the source cell
//     const sourceDot = createSourceDot();
//     sourceCell1.appendChild(sourceDot);

//     // Clear the text content of the source cell (if any)
//     const sourceTextElement = sourceCell1.querySelector("text");
//     if (sourceTextElement) {
//       sourceTextElement.textContent = "";
//     }
//   }
// }
