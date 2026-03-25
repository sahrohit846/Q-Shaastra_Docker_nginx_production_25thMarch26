document.addEventListener("DOMContentLoaded", function () {
  const dataTable = document.getElementById("dataTable");

  // Create a MutationObserver to observe changes in the dataTable
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Check if a node has been added
        const addedNodes = mutation.addedNodes;
        if (addedNodes && addedNodes.length > 0) {
          // Iterate over the added nodes
          addedNodes.forEach((node) => {
            // Check if the added node is a TR element
            if (node.tagName === "TR") {
              // Generate the row matrix if a measurement gate was dropped in this row
              generateRowMatrix(node);
            }
          });
        }
      }
    }
  });

  // Configure the MutationObserver to observe childList changes in the dataTable
  const config = { childList: true, subtree: true };
  observer.observe(dataTable, config);

  function generateRowMatrix(row) {
    const rowData = [];

    // Iterate over each cell in the row
    row.querySelectorAll("td").forEach((cell) => {
      // Check if the cell is filled
      const isCellFilled = cell.children.length > 0;

      // If the cell is filled, push its ID (text) to rowData, otherwise push null
      rowData.push(isCellFilled ? cell.firstElementChild.id : null);
    });

    // Print the generated row matrix to the console
    console.log("Row Matrix:");
    console.log(rowData);
  }
});
