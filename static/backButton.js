// Get the back button element
var backButton = document.getElementById("backButton");

// Add click event listener to the back button
backButton.addEventListener("click", function () {
  // Find the last filled cell in the circuit table
  var circuitTable = document.getElementById("circuitTable");
  var rows = circuitTable.getElementsByTagName("tr");
  var lastRowIndex = -1;
  for (var i = rows.length - 1; i >= 0; i--) {
    var cells = rows[i].getElementsByTagName("td");
    for (var j = cells.length - 1; j >= 0; j--) {
      if (cells[j].classList.contains("filled")) {
        lastRowIndex = i;
        break;
      }
    }
    if (lastRowIndex !== -1) {
      break;
    }
  }

  // If a filled cell is found, clear it to go back one step
  if (lastRowIndex !== -1) {
    var lastRow = rows[lastRowIndex];
    var cells = lastRow.getElementsByTagName("td");
    for (var j = cells.length - 1; j >= 0; j--) {
      if (cells[j].classList.contains("filled")) {
        cells[j].classList.remove("filled");
        // Optionally, you can also clear any content inside the cell if needed
        cells[j].innerHTML = "";
        break;
      }
    }
  }
});
