// Function to clear data in all cells of the table
function resetTable() {
  // Get all cells in the table
  var cells = document.querySelectorAll("#dataTable td");

  // Iterate through each cell and set its content to an empty string
  cells.forEach(function (cell) {
    cell.textContent = "";
  });
}

// Add event listener to the reset button
document.getElementById("resetButton").addEventListener("click", function () {
  resetTable();
});
