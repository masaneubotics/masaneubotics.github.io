document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.querySelector('[data-year]');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
});
