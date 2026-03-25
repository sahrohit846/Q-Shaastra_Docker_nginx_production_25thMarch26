
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter-value');
   const speed = 200; // Animation speed, the higher the number, the slower it counts

   counters.forEach(counter => {
       const updateCounter = () => {
           const target = +counter.getAttribute('data-target'); // Get the target number
           const count = +counter.innerText; // Get the current number

           // Calculate the increment based on target and speed
           const increment = target / speed;

           if (count < target) {
               counter.innerText = Math.ceil(count + increment);
               setTimeout(updateCounter, 1); // Recursively update the counter
           } else {
               counter.innerText = target; // Set the counter to the target when complete
           }
       };

       // Trigger the counter update when it's visible in the viewport
       const observer = new IntersectionObserver(entries => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   updateCounter();
                   observer.disconnect(); // Stop observing after it's been counted
               }
           });
       });

       observer.observe(counter); // Observe each counter
   });
});
