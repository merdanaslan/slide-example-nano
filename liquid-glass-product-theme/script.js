document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const ctrlLabel = document.getElementById('ctrl-label');
    const ctrlNext = document.getElementById('ctrl-next');
    let current = 0;

    const update = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[current].classList.add('active'), 10);
        if (ctrlLabel) ctrlLabel.textContent = `${current + 1} of ${slides.length}`;
    };

    // Next button in the floating control
    if (ctrlNext) ctrlNext.addEventListener('click', () => { if (current < slides.length - 1) { current++; update(); } });
    // Previous via click on left button (first .ctrl-btn)
    document.querySelectorAll('.ctrl-btn')[0]?.addEventListener('click', () => { if (current > 0) { current--; update(); } });

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
            clone.style.cssText = 'break-after:page; page-break-after:always; width:100vw; height:100vh; display:flex; flex-direction:column; background:#F2F2F7; border-radius:0;';
            clone.innerHTML = `
                <div style="padding:24px 50px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.7); font-family:'Inter',sans-serif; font-size:0.7rem; font-weight:600; color:#007AFF; letter-spacing:0.15em;">
                    <span>SUPERTEAM GERMANY</span><span>${idx + 1} of ${slides.length}</span>
                </div>
                <div style="flex-grow:1; position:relative;"><div style="position:absolute; inset:0; padding:50px 80px; display:flex; flex-direction:column; justify-content:center; color:#1D1D1F;">${slide.innerHTML}</div></div>`;
            printContainer.appendChild(clone);
        });
    });
    window.addEventListener('afterprint', () => { if (printContainer) printContainer.remove(); originalCanvas.style.display = 'flex'; });
});
