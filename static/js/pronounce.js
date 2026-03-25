// document.addEventListener('DOMContentLoaded', function () {
//     // Loop over *all* summary paragraphs/cards
//     document.querySelectorAll('[id^="summary-text-"]').forEach(function (summaryEl) {
//         // Find ALL .icon (speaker) elements inside this summary
//         summaryEl.querySelectorAll('.keyword .icon').forEach(function (icon) {
//             icon.addEventListener('click', function (event) {
//                 // Prevent bubbling in case your card has other click events
//                 event.stopPropagation();
//                 // The word is in the parent span's data-word
//                 let word = icon.parentElement.dataset.word;
//                 if (!word) return;
//                 fetch(`/pronounce/${encodeURIComponent(word)}/`)
//                     .then(res => res.json())
//                     .then(data => {
//                         if (data.audio_url) {
//                             let audio = new Audio(data.audio_url);
//                             audio.play();
//                         } else {
//                             alert('Pronunciation unavailable.');
//                         }
//                     })
//                     .catch(err => console.error('Audio fetch error:', err));
//             });
//         });
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    // Use event delegation on the document
    document.addEventListener('click', function (event) {
        let icon = event.target.closest('.keyword .icon');
        if (!icon) return; // Clicked somewhere else

        event.stopPropagation();

        let word = icon.parentElement?.dataset?.word;
        if (!word) return;

        // Optional: give visual feedback
        icon.classList.add('loading');

        fetch(`/pronounce/${encodeURIComponent(word)}/`)
            .then(res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.audio_url) {
                    let audio = new Audio(data.audio_url);
                    audio.play();
                } else {
                    alert('Pronunciation unavailable.');
                }
            })
            .catch(err => {
                console.error('Audio fetch error:', err);
                alert('Error fetching pronunciation.');
            })
            .finally(() => {
                icon.classList.remove('loading');
            });
    });
});
