(function () {
    const cards = document.querySelectorAll("[data-tilt-card]");
    if (!cards.length || !window.matchMedia("(pointer: fine)").matches) return;

    cards.forEach((card) => {
        const shell = card.querySelector(".medium-tilt-shell");
        if (!shell) return;

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 16;
            const rotateX = (0.5 - y) * 16;
            shell.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("pointerleave", () => {
            shell.style.transform = "";
        });
    });
})();
