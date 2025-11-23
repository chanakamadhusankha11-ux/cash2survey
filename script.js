// --- Global Elements ---
const statusText = document.getElementById('status-text');
const surveyButton = document.getElementById('survey-button');
const progressBar = document.getElementById('progress-bar');
const fakeCursor = document.getElementById('fake-cursor');

// --- Configuration ---
const TOTAL_DURATION_SECONDS = 60; // Total simulation time
let partnerSitesOpened = false; // Flag to ensure sites open only once

window.onload = function() {
    checkUser();
};

// --- 1. User Verification ---
async function checkUser() {
    // This function remains the same as before
    try {
        const response = await fetch(`http://ip-api.com/json?fields=status,message,countryCode,proxy&rand=${Math.random()}`);
        const data = await response.json();
        if (data.status !== 'success') {
            showPopupAndBlock('Verification Failed', 'Could not verify your connection.');
            return;
        }
        const allowedCountries = ['US', 'LK'];
        if (data.proxy) {
            showPopupAndBlock('VPN/Proxy Detected', 'Access from a VPN or Proxy is not allowed.');
            return;
        }
        if (!allowedCountries.includes(data.countryCode)) {
            showPopupAndBlock('Country Not Supported', 'Service only available in the USA and Sri Lanka.');
            return;
        }
        startAutomation();
    } catch (error) {
        showPopupAndBlock('Network Error', 'A network error occurred.');
    }
}

function showPopupAndBlock(title, message) {
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-message').textContent = message;
    document.getElementById('block-popup').style.display = 'flex';
}

// --- 2. Main Automation Controller ---
function startAutomation() {
    fakeCursor.style.display = 'block';
    
    let progress = 0;
    const interval = 1000;

    const scrollIntervalId = setInterval(autoScroll, 4000);
    const mouseIntervalId = setInterval(moveMouse, 800);

    const progressIntervalId = setInterval(() => {
        progress += 100 / TOTAL_DURATION_SECONDS;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        updateStatus(progress);

        // *** NEW LOGIC: Open partner sites BEFORE the end ***
        // Open at ~85% of progress (around 51 seconds mark)
        if (progress >= 85 && !partnerSitesOpened) {
            openPartnerSitesViaHiddenClick();
            partnerSitesOpened = true; // Set flag to prevent re-opening
        }

        // End of automation (at 100%, i.e., 60 seconds)
        if (progress >= 100) {
            clearInterval(progressIntervalId);
            clearInterval(scrollIntervalId);
            clearInterval(mouseIntervalId);
            
            fakeCursor.style.display = 'none';
            statusText.textContent = 'Status: Access Granted!';
            surveyButton.disabled = false;

            // The final automatic click! This happens ~9 seconds AFTER opening partner sites.
            setTimeout(() => surveyButton.click(), 500);
        }
    }, interval);
}

// --- 3. Automation Helper Functions ---

function updateStatus(progress) {
    // Simplified status messages as requested
    if (progress < 80) {
        statusText.textContent = 'Status: Processing your request...';
    } else {
        statusText.textContent = 'Status: Finalizing... Please wait.';
    }
}

// *** NEW FUNCTION to click hidden links ***
function openPartnerSitesViaHiddenClick() {
    console.log("Opening partner sites via hidden links...");
    const sites = [
        'https://www.cnn.com', 'https://www.nytimes.com', 'https://www.espn.com',
        'https://www.amazon.com', 'https://www.walmart.com', 'https://www.wikipedia.org'
    ];
    const shuffled = sites.sort(() => 0.5 - Math.random());
    
    // Get the hidden link elements
    const link1 = document.getElementById('partner-link-1');
    const link2 = document.getElementById('partner-link-2');

    // Set their href attributes
    link1.href = shuffled[0];
    link2.href = shuffled[1];

    // Programmatically click them
    link1.click();
    // A small delay between clicks can sometimes help
    setTimeout(() => {
        link2.click();
    }, 200);
}

// --- Unchanged Helper Functions ---
function autoScroll() { /* ... same as before ... */
    const randomY = Math.random() * document.body.scrollHeight;
    window.scrollTo({ top: randomY, behavior: 'smooth' });
}
function moveMouse() { /* ... same as before ... */
    if (Math.random() > 0.5) {
        const elements = document.querySelectorAll('.target-element');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const rect = randomElement.getBoundingClientRect();
        const x = rect.left + window.scrollX + (Math.random() * rect.width);
        const y = rect.top + window.scrollY + (Math.random() * rect.height);
        fakeCursor.style.left = x + 'px'; fakeCursor.style.top = y + 'px';
    } else {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        fakeCursor.style.left = x + 'px'; fakeCursor.style.top = y + 'px';
    }
}

// --- 4. Final Button Click Event (Simplified) ---
surveyButton.addEventListener('click', function() {
    console.log("Final survey button clicked!");

    // NOTE: Partner sites are no longer opened here.
    
    // Determine final redirect URL
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
        window.open('https://singingfiles.com/show.php?l=0&u=2464536&id=73210', '_blank');
    } else {
        window.open('https://singingfiles.com/show.php?l=0&u=2464536&id=73209', '_blank');
    }

    // Update the message on the original page
    document.querySelector('.cta-section').innerHTML = '<h2>Thank you! Your survey is opening in a new tab.</h2>';
});