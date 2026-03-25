function removeRow() {
  // Getting the table od circuti design area table1 and table2
  var table1 = document.querySelector(".table1 tbody");
  var table2 = document.querySelector(".table2 tbody");

  // Count rows in table 1
  var rows1 = table1.querySelectorAll("tr");

  // Checking  only one row left (table 1)
  if (rows1.length === 1) {
    alert("At least one row must be available in Table 1.");
    return;
  }

  // Remove the last row from table 1
  if (rows1.length > 1) {
    table1.removeChild(rows1[rows1.length - 1]);
  }

  // Count the number of rows in table 2
  var rows2 = table2.querySelectorAll("tr");

  // Check if there is only one row left in table 2
  if (rows2.length === 1) {
    alert("At least one row must be available in Table 2.");
    return;
  }

  // Remove the last row from table 2
  if (rows2.length > 0) {
    table2.removeChild(rows2[rows2.length - 1]);
  }
}
