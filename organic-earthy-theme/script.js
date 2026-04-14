document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navDotsContainer = document.getElementById('nav-dots');
    let currentSlide = 0;

    // Inject dot navigators
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.addEventListener('click', () => { currentSlide = idx; updateSlides(); });
        navDotsContainer.appendChild(dot);
    });

    const updateSlides = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[currentSlide].classList.add('active'), 10);

        const dots = navDotsContainer.querySelectorAll('.nav-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    };

    document.addEventListener('keydown', (e) => {
        if (['ArrowRight', 'Space', ' ', 'ArrowDown'].includes(e.key)) {
            if (currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
        } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            if (currentSlide > 0) { currentSlide--; updateSlides(); }
        }
    });

    updateSlides();

    // PDF Export
    let printContainer = null;
    const originalCanvas = document.querySelector('.canvas');

    window.addEventListener('beforeprint', () => {
        originalCanvas.style.display = 'none';
        printContainer = document.createElement('div');
        document.querySelector('.desktop').appendChild(printContainer);

        slides.forEach((slide, idx) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            cloneCanvas.style.cssText = 'background:#FAF5EE; break-after:page; page-break-after:always; width:100vw; height:100vh; display:flex; flex-direction:column; border-radius:0;';

            cloneCanvas.innerHTML = `
                <div style="position:absolute; top:0; left:0; width:100%; padding:30px 60px; display:flex; justify-content:space-between; align-items:center; z-index:50;">
                    <img src="../logos/superteam-black.png" height="18" alt="Superteam">
                    <span style="font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#7A5C44;">${idx + 1} / ${slides.length}</span>
                </div>
                <div style="flex-grow:1; position:relative; margin-top:40px;">
                    <div style="position:absolute; inset:0; padding:60px 100px; display:flex; flex-direction:column; justify-content:center;">
                        ${slide.innerHTML}
                    </div>
                </div>
            `;
            printContainer.appendChild(cloneCanvas);
        });
    });

    window.addEventListener('afterprint', () => {
        if (printContainer) printContainer.remove();
        originalCanvas.style.display = 'flex';
    });
});
