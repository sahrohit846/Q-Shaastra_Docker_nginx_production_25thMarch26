let extraData = document.getElementById("dataTable").childNodes[1];

setTimeout(() => {
  // Iterate over child nodes of extraData
  for (let i = 0; i < extraData.childNodes.length; i++) {
    const element = extraData.childNodes[i];
    console.log(element);
  }
}, 8000);
