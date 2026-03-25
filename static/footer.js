document.addEventListener("DOMContentLoaded", function () {
  // Get the current page URL
  var currentPage = window.location.pathname;

  // Get the footer element
  var footer = document.querySelector("footer");

  // Function to check if the current page is about or contact
  function isAboutOrContactPage(url) {
    return url.includes("/about") || url.includes("/contact");
  }

  // Function to add or remove fixed-bottom class based on the current page
  function toggleFixedBottomClass() {
    if (isAboutOrContactPage(currentPage)) {
      footer.classList.add("fixed-bottom");
    } else {
      footer.classList.remove("fixed-bottom");
    }
  }

  // Initial call to set the class based on the current page
  toggleFixedBottomClass();

  // Listen for hash changes to update the class if necessary
  window.addEventListener("hashchange", function () {
    currentPage = window.location.pathname;
    toggleFixedBottomClass();
  });
});
