document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navLabel = document.getElementById('nav-label');
    let current = 0;

    const update = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[current].classList.add('active'), 10);
        // Minimal nav just shows a dash separator
        if (navLabel) navLabel.textContent = `${current + 1} — ${slides.length}`;
    };

    document.addEventListener('keydown', e => {
        if (['ArrowRight','Space',' ','ArrowDown'].includes(e.key) && current < slides.length - 1) { current++; update(); }
        else if (['ArrowLeft','ArrowUp'].includes(e.key) && current > 0) { current--; update(); }
    });

    update();

    let printContainer = null;
    const originalCanvas = document.querySelector('.canvas');
    window.addEventListener('beforeprint', () => {
        originalCanvas.style.display = 'none';
        printContainer = document.createElement('div');
        document.querySelector('.desktop').appendChild(printContainer);
        slides.forEach((slide, idx) => {
            const clone = document.createElement('div');
            clone.className = 'print-canvas';
            clone.style.cssText = 'break-after:page; page-break-after:always; width:100vw; height:100vh; display:flex; flex-direction:column; background:#fff;';
            clone.innerHTML = `
                <div style="padding:30px 60px; display:flex; justify-content:space-between; align-items:center; font-family:'Inter',sans-serif; font-size:0.65rem; font-weight:400; color:rgba(0,0,0,0.18);">
                    <span style="opacity:0.4;"></span><span>${idx + 1} — ${slides.length}</span>
                </div>
                <div style="flex-grow:1; position:relative;"><div style="position:absolute; inset:0; padding:60px 120px; display:flex; flex-direction:column; justify-content:center; color:#1D1D1F;">${slide.innerHTML}</div></div>`;
            printContainer.appendChild(clone);
        });
    });
    window.addEventListener('afterprint', () => { if (printContainer) printContainer.remove(); originalCanvas.style.display = 'flex'; });
});
