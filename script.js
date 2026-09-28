// ============================================================
// Live date & time in the nav
// ============================================================
function updateDateTime() {
    const now = new Date();

    // Date: "Mon, 28 Sep 2026"
    const dateStr = now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day:   '2-digit',
        month: 'short',
        year:  'numeric'
    });

    // Time: "14:32:07"
    const timeStr = now.toLocaleTimeString('en-GB', {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');

    if (dateEl) dateEl.textContent = dateStr;
    if (timeEl) timeEl.textContent = timeStr;
}

// Run immediately, then every second
updateDateTime();
setInterval(updateDateTime, 1000);

// ============================================================
// Auto-update footer year
// ============================================================
(function updateYear() {
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ============================================================
// Detect visitor country
// ============================================================
async function detectCountry() {
    const locEl = document.getElementById('current-location');
    if (!locEl) return;

    try {
        // Fetch geolocation based on IP (no API key required)
        const res = await fetch('https://ipwho.is/');
        const data = await res.json();

        if (data && data.success && data.country) {
            // Show flag emoji + country name
            const flag = countryFlagEmoji(data.country_code);
            locEl.textContent = `${flag} ${data.country}`;
        } else {
            locEl.textContent = '';
        }
    } catch (err) {
        // Silent fail — no location shown if API fails
        locEl.textContent = '';
    }
}

// Convert ISO country code (e.g. "MY") to flag emoji 🇲🇾
function countryFlagEmoji(code) {
    if (!code) return '';
    return code
        .toUpperCase()
        .replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt(0))
        );
}

detectCountry();