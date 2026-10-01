// ============================================================
// Live date & time in the nav
// ============================================================
function updateDateTime() {
    const now = new Date();

    // Date: "Mon, 28 Sep 2026"
    const dateStr = now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Time: "14:32:07"
    const timeStr = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
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

// ============================================================
// Logo chain — scroll affordance + hint bubble
// ------------------------------------------------------------
// - Shows a "Scroll to the right for more" bubble once per
//   session (only if the chain actually overflows).
// - Hides the right-edge fade + arrow when scrolled to the end.
// - Auto-dismisses the bubble after 3.5s or on first scroll.
// ============================================================
(function initChainScrollHint() {
    const chain = document.querySelector('.logo-chain');
    const header = document.querySelector('.header-inner');
    const bubble = document.querySelector('.scroll-hint-bubble');

    // Bail out quietly if the elements aren't on this page
    if (!chain || !header || !bubble) return;

    const HINT_KEY = 'masa-chain-hint-shown';
    const HINT_DURATION = 3500;   // ms before auto-hide
    const HINT_DELAY = 700;       // ms before showing after load
    const SCROLL_DISMISS_THRESHOLD = 8; // px scrolled before dismissing

    let hideTimer = null;

    // ---- helpers ----------------------------------------------------

    function chainScrollable() {
        // 4px tolerance for subpixel rounding
        return chain.scrollWidth - chain.clientWidth > 4;
    }

    function atEnd() {
        const max = chain.scrollWidth - chain.clientWidth;
        return max <= 2 || chain.scrollLeft >= max - 2;
    }

    function hideHint() {
        bubble.classList.remove('show');
        header.classList.add('chain-hint-done');
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function updateFade() {
        header.classList.toggle('chain-at-end', atEnd());
    }

    function showHintIfNeeded() {
        if (!chainScrollable()) return;                        // nothing to scroll
        if (sessionStorage.getItem(HINT_KEY) === '1') return;  // already shown

        setTimeout(function () {
            // Double-check — user may have scrolled or resized during the delay
            if (!chainScrollable()) return;
            if (sessionStorage.getItem(HINT_KEY) === '1') return;

            bubble.classList.add('show');
            sessionStorage.setItem(HINT_KEY, '1');

            hideTimer = setTimeout(hideHint, HINT_DURATION);
        }, HINT_DELAY);
    }

    // ---- events -----------------------------------------------------

    chain.addEventListener('scroll', function () {
        updateFade();

        // Any meaningful scroll = user has figured it out, dismiss the hint
        if (chain.scrollLeft > SCROLL_DISMISS_THRESHOLD) hideHint();
    }, { passive: true });

    window.addEventListener('resize', function () {
        updateFade();
        showHintIfNeeded();
    });

    window.addEventListener('load', function () {
        updateFade();
        showHintIfNeeded();
    });

    // ---- initial run ------------------------------------------------

    updateFade();

    // In case 'load' already fired (script at bottom of body),
    // call showHintIfNeeded directly too.
    if (document.readyState === 'complete') {
        showHintIfNeeded();
    }
})();