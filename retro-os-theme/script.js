document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scrollThumb = document.getElementById('scroll-thumb');

    // Each slide represents a fraction of the scrollbar (e.g. 5 slides = 20% width)
    const thumbWidthPercent = 100 / totalSlides;
    scrollThumb.style.width = `${thumbWidthPercent}%`;

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update the scroll thumb position based on active slide
        scrollThumb.style.left = `${currentSlide * thumbWidthPercent}%`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        }
    });

    // Initialize first slide as active
    updateSlides();

    // PRINTING LOGIC: Generate all 5 slides cleanly for a multi-page PDF output
    let printContainer = null;
    let originalWindow = null;

    window.addEventListener('beforeprint', () => {
        originalWindow = document.querySelector('.window');
        originalWindow.style.display = 'none'; // Hide the single dynamic window
        
        printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        document.querySelector('.desktop').appendChild(printContainer);

        // For each hidden slide, generate a fully framed "window" so they can be exported independently
        slides.forEach((slide, index) => {
            const windowClone = originalWindow.cloneNode(true);
            windowClone.style.display = 'flex';
            windowClone.classList.add('print-window');
            
            // Keep the scrollbar! We just manually update the thumb position so it acts as a 'progress bar' in the PDF
            const thumb = windowClone.querySelector('.scroll-thumb');
            if (thumb) {
                const thumbWidthPercent = 100 / slides.length;
                thumb.style.left = `${index * thumbWidthPercent}%`;
            }

            const container = windowClone.querySelector('.content-container');
            container.innerHTML = ''; // strip out the original hidden slides
            
            const slideClone = slide.cloneNode(true);
            slideClone.style.position = 'relative';
            slideClone.style.display = 'block';
            slideClone.style.animation = 'none'; // Remove fade-in animations for a static PDF
            slideClone.style.height = '100%';
            
            container.appendChild(slideClone);
            printContainer.appendChild(windowClone);
        });
    });

    window.addEventListener('afterprint', () => {
        if (printContainer) printContainer.remove();
        if (originalWindow) originalWindow.style.display = 'flex'; // Restore normal interactive view
    });
});
