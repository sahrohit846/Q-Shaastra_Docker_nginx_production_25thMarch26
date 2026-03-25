document.addEventListener("DOMContentLoaded", function () {
  const text = "Explore the latest breakthroughs in quantum computing and emerging technologies";
  let index = 0;
  function typeEffect() {
      if (index < text.length) {
          document.getElementById("typing-text").innerHTML += text.charAt(index);
          index++;
          setTimeout(typeEffect, 50); // Adjust speed of typing effect
      } else {
          document.getElementById("typing-text").style.borderRight = "none"; // Remove cursor after typing
      }
  }
  typeEffect();
});

function fetchNews() {
  let category = document.getElementById("category").value;
  let country = document.getElementById("country").value;
  window.location.href = `/news/?category=${category}&country=${country}`;
}
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("show");
}



if (performance.navigation.type === 2) {
      location.reload(true);
  }

  window.onload = function () {
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
  };

  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };



// News filtering
function fetchNews() {
const category = document.getElementById('category').value;
const country = document.getElementById('country').value;
window.location.href = `?category=${encodeURIComponent(category)}&country=${encodeURIComponent(country)}`;
}


// additing from quantum_news page 

