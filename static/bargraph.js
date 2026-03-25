document.addEventListener("DOMContentLoaded", function () {
  var chart; // Declare a variable to store the chart instance

  // Function to fetch the number of <tr> elements in the table
  function countRows() {
    return document.querySelectorAll("#bits tbody tr").length;
  }

  // Function to generate binary values based on the number of rows
  function generateBinaryValues(rowCount) {
    var binaryValues = [];
    for (var i = 0; i < Math.pow(2, rowCount); i++) {
      binaryValues.push(i.toString(2).padStart(rowCount, "0"));
    }
    return binaryValues;
  }

  // Function to generate background colors array based on y-values
  function generateBackgroundColors(yValues) {
    var backgroundColors = [];
    yValues.forEach(function (value) {
      if (value > 80) {
        backgroundColors.push("rgb(179, 224, 249)");
      } else if (value > 60) {
        backgroundColors.push("rgb(239, 141, 141)");
      } else if (value > 40) {
        backgroundColors.push("rgb(229, 172, 104)");
      } else if (value > 20) {
        backgroundColors.push("rgb(156, 237, 165)");
      } else {
        backgroundColors.push("#995e5e");
      }
    });
    return backgroundColors;
  }

  // Function to update the chart with new data
  function updateChart() {
    var rowCount = countRows();
    var xValues = generateBinaryValues(rowCount);
    var yValues = [100, 80, 60, 40, 20, 0];
    var backgroundColors = generateBackgroundColors(yValues);

    if (chart) {
      // Clear the previous chart data
      chart.destroy();
    }

    // Create the new chart
    chart = new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: backgroundColors,
            data: yValues,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "HPC_Quantum Simulation Probablity",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                max: 100,
                min: 0,
                stepSize: 20,
                callback: function (value) {
                  return value; // return the value itself
                },
              },
            },
          ],
        },
        onHover: function (event, chartElement) {
          event.stopPropagation();
        },
      },
    });
  }

  // Initial chart setup
  updateChart();

  // Observer to watch for changes in the table
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      // If nodes are added or removed, update the chart
      if (mutation.type === "childList") {
        updateChart();
      }
    });
  });

  // Configure the observer to watch for changes in the table
  var config = { childList: true, subtree: true };

  // Start observing the table for changes
  observer.observe(document.getElementById("bits"), config);

  // Add passive event listeners
  document.getElementById("bits").addEventListener(
    "touchstart",
    function (event) {
      // Your touchstart event handler logic here
    },
    { passive: true }
  );

  document.getElementById("bits").addEventListener(
    "touchmove",
    function (event) {
      // Your touchmove event handler logic here
    },
    { passive: true }
  );
});
