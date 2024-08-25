// Fetch the data from data.json
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    displayData(data);
  })
  .catch((error) => console.error("Error loading data:", error));

function displayData(data) {
  const dashboard = document.querySelector(".dashboard");

  // Clear existing content
  dashboard.innerHTML = "<h1>IPL 2024 Player Statistics</h1>";

  // Create sort selector
  const selector = createSortSelector();
  dashboard.appendChild(selector);

  // Create table
  const table = createDataTable(data);
  dashboard.appendChild(table);

  // Add event listener for sort changes
  selector.addEventListener("change", (event) => {
    sortTable(event.target.value, data);
  });
}

function createSortSelector() {
  const selector = document.createElement("select");
  selector.id = "sortSelector";

  const options = [
    "Player",
    "Runs",
    "Strike Rate",
    "Centuries",
    "Fifties",
    "Fours",
    "Balls Faced",
  ];
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.toLowerCase().replace(" ", "");
    optionElement.textContent = `Sort by ${option}`;
    selector.appendChild(optionElement);
  });

  return selector;
}

function createDataTable(data) {
  const table = document.createElement("table");
  table.id = "dataTable";

  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  [
    "Player",
    "Runs",
    "Strike Rate",
    "Centuries",
    "Fifties",
    "Fours",
    "Balls Faced",
  ].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach((player) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = player.name;
    row.insertCell().textContent = player.runs;
    row.insertCell().textContent = player.strikeRate;
    row.insertCell().textContent = player.Centuries;
    row.insertCell().textContent = player.Fifties;
    row.insertCell().textContent = player.Fours;
    row.insertCell().textContent = player.ballFaced;
  });

  return table;
}

function sortTable(sortBy, data) {
  // Sort the data array based on the selected column
  data.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "player":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        return aValue.localeCompare(bValue);
      case "runs":
        aValue = a.runs;
        bValue = b.runs;
        return bValue - aValue;
      case "strikerate":
        aValue = a.strikeRate;
        bValue = b.strikeRate;
        return bValue - aValue;
      case "centuries":
        aValue = a.Centuries;
        bValue = b.Centuries;
        return bValue - aValue;
      case "fifties":
        aValue = a.Fifties;
        bValue = b.Fifties;
        return bValue - aValue;
      case "fours":
        aValue = a.Fours;
        bValue = b.Fours;
        return bValue - aValue;
      case "ballsfaced":
        aValue = a.ballFaced;
        bValue = b.ballFaced;
        return bValue - aValue;
      default:
        return 0;
    }
  });

  // Refresh the table with the sorted data
  const dashboard = document.querySelector(".dashboard");
  const existingTable = document.getElementById("dataTable");
  if (existingTable) {
    dashboard.removeChild(existingTable);
  }

  // Recreate the table with the sorted data
  const newTable = createDataTable(data);
  dashboard.appendChild(newTable);
}
