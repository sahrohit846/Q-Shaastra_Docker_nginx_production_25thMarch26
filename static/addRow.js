function addRow() {
  // Get the table elements
  var table1 = document.querySelector("#bits tbody");
  var table2 = document.querySelector("#dataTable tbody");

  // Check if maximum rows limit is reached
  var maxRows = 30;
  var currentRowCount = table1.querySelectorAll("tr").length;
  if (currentRowCount >= maxRows) {
    alert("Maximum rows limit reached!");
    return; // Exit the function if limit is reached
  }

  // Create a new row for table 1
  var newRow1 = document.createElement("tr");
  var td1 = document.createElement("td");
  td1.textContent = "q" + "[" + currentRowCount + "]";
  td1.style.width = "5rem"; // Adjust width as needed
  // td1.style.height = "3.5rem"; // Adjust height as needed
  // td1.style.paddingTop = "1.1rem"; // Adjust height as needed
  td1.className = " p-3 align-middle";
  newRow1.className = "d-flex align-items-center justify-content-center mb-0";
  newRow1.style = "height: 3.5rem;";
  newRow1.appendChild(td1);

  // Create new td elements for table 2 with the same width and height as existing td elements
  var newRow2 = document.createElement("tr");
  newRow2.className = "myTr";
  for (var i = 0; i < 20; i++) {
    var td2 = document.createElement("td");
    td2.className = "circuitBox wire"; // Add the 'wire' class to the td element
    td2.setAttribute("ondrop", "dropLogo(event)");
    td2.setAttribute("ondragover", "allowDrop(event)");

    // Generate a unique ID for each td element
    var tdId = "cell_" + currentRowCount + "_" + i;
    td2.setAttribute("id", tdId);

    newRow2.appendChild(td2);
  }

  // Append the new rows to their respective tables
  table1.appendChild(newRow1);
  table2.appendChild(newRow2);
}
