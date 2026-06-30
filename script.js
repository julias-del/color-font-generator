// Global environment variables provided by context. 
// Note: The execution environment dynamically provisions authentication keys at runtime.
const apiKey = ""; 

// 5-Color slot system states
let colors = [
    { hex: "#6366F1", locked: false },
    { hex: "#10B981", locked: false },
    { hex: "#F59E0B", locked: false },
    { hex: "#EF4444", locked: false },
    { hex: "#8B5CF6", locked: false }
];

// Typography settings & defaults
let headingFont = "Inter";
let bodyFont = "Roboto";
let lockFonts = false;

// Active layout representation
let currentLayout = 1; // 1 = SaaS Hero, 2 = Dashboard Campaign
let currentExportTab = "css";

// Curated pairs for standard randomization fallback
const curatedFontPairs = [
    { heading: "Inter", body: "Roboto" },
    { heading: "Playfair Display", body: "Source Sans 3" },
    { heading: "Montserrat", body: "Lora" },
    { heading: "Syne", body: "Inter" },
    { heading: "Merriweather", body: "Open Sans" },
    { heading: "Oswald", body: "Fira Sans" },
    { heading: "Space Grotesk", body: "Space Mono" },
    { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans" },
    { heading: "Cinzel", body: "Lato" },
    { heading: "Cabin", body: "PT Serif" }
];

// List of popular Google fonts to display inside select dropdown controllers
const fontOptions = [
    "Inter", "Roboto", "Source Sans 3", "Playfair Display", "Montserrat", "Lora", "Syne", 
    "Merriweather", "Open Sans", "Oswald", "Fira Sans", "Space Grotesk", "Space Mono", 
    "Plus Jakarta Sans", "Cinzel", "Lato", "Cabin", "PT Serif", "DM Sans", "Poppins"
];

// APP INITIALIZATION
window.onload = function() {
    populateFontSelects();
    injectFonts(headingFont, bodyFont);
    randomizePalette(true); // Generate clean initial visual values on run
    updateGlobalWorkspaceStyles();
    setupEventListeners();
};

// Populates UI select boxes
function populateFontSelects() {
    const hSelect = document.getElementById('headingFontSelector');
    const bSelect = document.getElementById('bodyFontSelector');
    
    fontOptions.forEach(font => {
        const optH = document.createElement('option');
        optH.value = font;
        optH.innerText = font;
        if (font === headingFont) optH.selected = true;
        hSelect.appendChild(optH);

        const optB = document.createElement('option');
        optB.value = font;
        optB.innerText = font;
        if (font === bodyFont) optB.selected = true;
        bSelect.appendChild(optB);
    });
}

// Dynamically append google font element links to make them render live
function injectFonts(heading, body) {
    const linkId = 'google-fonts-link';
    let link = document.getElementById(linkId);
    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    const hUrl = heading.replace(/ /g, '+');
    const bUrl = body.replace(/ /g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${hUrl}:wght@400;700;800;900&family=${bUrl}:wght@300;400;500;600&display=swap`;
}

// EVENT LISTENERS REGISTER
function setupEventListeners() {
    // Spacebar trigger handler
    document.addEventListener('keydown', function(e) {
        // Do not trigger if user is filling forms or prompt inputs
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
            return;
        }
        if (e.code === 'Space') {
            e.preventDefault();
            randomizePalette(false);
        }
    });

    // Head & Body Manual Selector Handlers
    document.getElementById('headingFontSelector').addEventListener('change', function(e) {
        headingFont = e.target.value;
        injectFonts(headingFont, bodyFont);
        updateGlobalWorkspaceStyles();
        showToast(`Heading font changed to ${headingFont}`);
    });

    document.getElementById('bodyFontSelector').addEventListener('change', function(e) {
        bodyFont = e.target.value;
        injectFonts(headingFont, bodyFont);
        updateGlobalWorkspaceStyles();
        showToast(`Body font changed to ${bodyFont}`);
    });

    // Lock Fonts Toggle
    document.getElementById('lockFontsToggle').addEventListener('change', function(e) {
        lockFonts = e.target.checked;
    });

    // Seed controls apply
    document.getElementById('btnApplySeed').addEventListener('click', () => applySeedColor('desktop'));
    document.getElementById('btnApplySeedMobile').addEventListener('click', () => applySeedColor('mobile'));

    // Color picker updates automatically
    document.getElementById('seedColorPicker').addEventListener('input', function(e) {
        document.getElementById('seedColorInput').value = e.target.value.toUpperCase();
        document.getElementById('seedColorIndicator').style.backgroundColor = e.target.value;
    });
    document.getElementById('seedColorPickerMobile').addEventListener('input', function(e) {
        document.getElementById('seedColorInputMobile').value = e.target.value.toUpperCase();
        document.getElementById('seedColorIndicatorMobile').style.backgroundColor = e.target.value;
    });

    // Modal visibility and layout switches
    document.getElementById('btnShowPreview').addEventListener('click', () => togglePreviewModal(true));
    document.getElementById('btnToggleMobilePreview').addEventListener('click', () => togglePreviewModal());
    document.getElementById('btnClosePreview').addEventListener('click', () => togglePreviewModal(false));
    document.getElementById('btnTogglePreviewLayout').addEventListener('click', rotatePreviewLayout);

    document.getElementById('btnExport').addEventListener('click', openExportModal);
    document.getElementById('btnCloseExport').addEventListener('click', closeExportModal);
    document.getElementById('btnCopyToClipboard').addEventListener('click', copyExportCodeBlock);

    // Sidebars and drawers
    document.getElementById('btnOpenAiAssistant').addEventListener('click', toggleAiDrawer);
    document.getElementById('btnOpenMobileAi').addEventListener('click', toggleMobileSheet);
    document.getElementById('btnCloseMobileSheet').addEventListener('click', toggleMobileSheet);
    document.getElementById('btnSwipeClose').addEventListener('click', toggleMobileSheet);

    // AI Action Button Trigger Setup wrapped in arrow scopes to isolate click Event objects
    document.getElementById('btnGenerateAI').addEventListener('click', () => triggerAiBrandGeneration(false));
    document.getElementById('btnGenerateAIMobile').addEventListener('click', () => triggerAiBrandGeneration(true));

    // Randomize Mobile Button setup
    document.getElementById('btnRandomizeMobile').addEventListener('click', () => randomizePalette(false));

    // Quick Copy Code Snippet Action
    document.getElementById('btnQuickCopy').addEventListener('click', () => {
        const text = document.getElementById('quickCodeSnippet').innerText;
        copyTextToClipboard(text);
        showToast("Copied quick tokens!");
    });
}

// GENERATION ENGINE - CORE MATHEMATICAL ROUTINES
function randomizePalette(forceAll = false) {
    // Pick standard random fonts if they are not locked
    if (!lockFonts && !forceAll) {
        const randomPair = curatedFontPairs[Math.floor(Math.random() * curatedFontPairs.length)];
        headingFont = randomPair.heading;
        bodyFont = randomPair.body;
        injectFonts(headingFont, bodyFont);
        document.getElementById('headingFontSelector').value = headingFont;
        document.getElementById('bodyFontSelector').value = bodyFont;
    }

    // Generate 5 random HEX strings using HSL distribution for optimal harmony balance
    colors.forEach((col, idx) => {
        if (!col.locked || forceAll) {
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(30 + Math.random() * 55); // avoid dead greys
            const l = Math.floor(20 + Math.random() * 60); // balanced contrast
            col.hex = hslToHex(h, s, l);
        }
    });

    document.getElementById('activeHarmonyPill').innerText = "Randomized Flow";
    updateGlobalWorkspaceStyles();
}

// SEED COLOR THEORY ENGINE CALCULATOR
function applySeedColor(viewport) {
    let inputId = viewport === 'desktop' ? 'seedColorInput' : 'seedColorInputMobile';
    let harmonyId = viewport === 'desktop' ? 'harmonyMode' : 'harmonyModeMobile';
    let pickerId = viewport === 'desktop' ? 'seedColorIndicator' : 'seedColorIndicatorMobile';

    let rawHex = document.getElementById(inputId).value.trim();
    if(!isValidHex(rawHex)) {
        showToast("Invalid Hex code format! Please use #FFF or #FFFFFF format.");
        return;
    }

    // Standardize format
    if(!rawHex.startsWith('#')) rawHex = '#' + rawHex;
    rawHex = rawHex.toUpperCase();
    
    // Sync input selectors
    document.getElementById(inputId).value = rawHex;
    document.getElementById('seedColorInput').value = rawHex;
    document.getElementById('seedColorInputMobile').value = rawHex;
    document.getElementById('seedColorIndicator').style.backgroundColor = rawHex;
    document.getElementById('seedColorIndicatorMobile').style.backgroundColor = rawHex;

    let harmony = document.getElementById(harmonyId).value;
    let hslSeed = hexToHsl(rawHex);

    // Anchor current color into Slot 1
    colors[0].hex = rawHex;
    colors[0].locked = true; // Lock anchor automatically as requested in design docs

    // Recalculate remaining 4 channels based on mathematical color offsets
    if (harmony === 'complementary') {
        colors[1].hex = hslToHex((hslSeed.h + 180) % 360, hslSeed.s, Math.max(15, hslSeed.l - 20));
        colors[2].hex = hslToHex((hslSeed.h + 180) % 360, Math.min(100, hslSeed.s + 15), Math.min(90, hslSeed.l + 10));
        colors[3].hex = hslToHex(hslSeed.h, hslSeed.s, Math.max(10, hslSeed.l - 25));
        colors[4].hex = hslToHex(hslSeed.h, Math.max(10, hslSeed.s - 25), Math.min(95, hslSeed.l + 30));
    } 
    else if (harmony === 'triadic') {
        colors[1].hex = hslToHex((hslSeed.h + 120) % 360, hslSeed.s, hslSeed.l);
        colors[2].hex = hslToHex((hslSeed.h + 240) % 360, hslSeed.s, hslSeed.l);
        colors[3].hex = hslToHex((hslSeed.h + 120) % 360, Math.max(10, hslSeed.s - 20), Math.min(90, hslSeed.l + 15));
        colors[4].hex = hslToHex((hslSeed.h + 240) % 360, Math.max(10, hslSeed.s - 20), Math.max(15, hslSeed.l - 15));
    } 
    else if (harmony === 'analogous') {
        colors[1].hex = hslToHex((hslSeed.h + 30) % 360, hslSeed.s, hslSeed.l);
        colors[2].hex = hslToHex((hslSeed.h + 60) % 360, hslSeed.s, hslSeed.l);
        colors[3].hex = hslToHex((hslSeed.h - 30 + 360) % 360, hslSeed.s, hslSeed.l);
        colors[4].hex = hslToHex((hslSeed.h - 60 + 360) % 360, hslSeed.s, hslSeed.l);
    } 
    else if (harmony === 'monochromatic') {
        colors[1].hex = hslToHex(hslSeed.h, hslSeed.s, Math.min(95, Math.max(5, hslSeed.l + 25)));
        colors[2].hex = hslToHex(hslSeed.h, hslSeed.s, Math.min(95, Math.max(5, hslSeed.l + 12)));
        colors[3].hex = hslToHex(hslSeed.h, Math.max(10, hslSeed.s - 25), Math.min(95, Math.max(5, hslSeed.l - 15)));
        colors[4].hex = hslToHex(hslSeed.h, Math.max(10, hslSeed.s - 45), Math.min(95, Math.max(5, hslSeed.l - 30)));
    }

    document.getElementById('activeHarmonyPill').innerText = harmony;
    updateGlobalWorkspaceStyles();
    showToast(`Calculated custom ${harmony} harmony anchored to ${rawHex}`);
}

// COLOR SPACE HELPERS (HEX / HSL CONVERTERS)
function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
}

// WCAG relative luminance contrast decider to auto-calculate readable black/white texts
function getLuminance(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
    let a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastColor(hex) {
    let lum = getLuminance(hex);
    return lum > 0.179 ? '#0f172a' : '#ffffff'; // returns dark slate or clean white
}

function isValidHex(hex) {
    return /^#?([0-9A-F]{3}){1,2}$/i.test(hex);
}

// DYNAMIC STATE RENDERING
function updateGlobalWorkspaceStyles() {
    // Apply visual configuration variables directly into our DOM blocks
    colors.forEach((col, idx) => {
        const columnEl = document.getElementById(`col-${idx}`);
        const hexLabel = document.getElementById(`hex-${idx}`);
        const lockBtn = document.getElementById(`lock-btn-${idx}`);
        const editorEl = document.getElementById(`editor-${idx}`);
        const hexInput = document.getElementById(`hexinput-${idx}`);
        const inlineIndicator = document.getElementById(`inlineIndicator-${idx}`);
        const inlinePicker = document.getElementById(`inlinePicker-${idx}`);

        // Update column backgrounds and colors
        columnEl.style.backgroundColor = col.hex;
        const textColor = getContrastColor(col.hex);
        columnEl.style.color = textColor;

        // Labels styling matching relative contrasts
        hexLabel.innerText = col.hex;
        hexInput.value = col.hex;
        inlineIndicator.style.backgroundColor = col.hex;
        inlinePicker.value = col.hex;

        // Adjust lock icon status
        if (col.locked) {
            lockBtn.innerHTML = '<i class="fa-solid fa-lock text-amber-400"></i>';
            lockBtn.title = "Unlock Color Slot";
        } else {
            lockBtn.innerHTML = `<i class="fa-solid fa-lock-open text-xs opacity-80" style="color: ${textColor}"></i>`;
            lockBtn.title = "Lock Color Slot";
        }

        // Adjust inline sliders based on current colors
        const hsl = hexToHsl(col.hex);
        document.getElementById(`slider-h-${idx}`).value = hsl.h;
        document.getElementById(`slider-s-${idx}`).value = hsl.s;
        document.getElementById(`slider-l-${idx}`).value = hsl.l;
        document.getElementById(`label-h-${idx}`).innerText = `${hsl.h}°`;
        document.getElementById(`label-s-${idx}`).innerText = `${hsl.s}%`;
        document.getElementById(`label-l-${idx}`).innerText = `${hsl.l}%`;
    });

    // Update floating visual landing page components
    document.getElementById('previewHeading').style.fontFamily = `'${headingFont}', sans-serif`;
    document.getElementById('previewBody').style.fontFamily = `'${bodyFont}', sans-serif`;
    document.getElementById('previewHeading').style.color = colors[0].hex; // primary text
    document.getElementById('previewBody').style.color = colors[1].hex;

    // SaaS Layout buttons
    const btnPrimary = document.getElementById('previewButtonPrimary');
    btnPrimary.style.backgroundColor = colors[2].hex;
    btnPrimary.style.color = getContrastColor(colors[2].hex);

    const btnSec = document.getElementById('previewButtonSecondary');
    btnSec.style.borderColor = colors[3].hex;
    btnSec.style.color = colors[3].hex;

    const badge = document.getElementById('mockupBadge');
    badge.style.borderColor = colors[4].hex;
    badge.style.color = colors[4].hex;

    const logoCirc = document.getElementById('mockupLogoCircle');
    logoCirc.style.backgroundColor = colors[1].hex;

    // Dashboard items alignment
    document.getElementById('previewDashTitle').style.fontFamily = `'${headingFont}', sans-serif`;
    document.getElementById('previewVibeBody').style.fontFamily = `'${bodyFont}', sans-serif`;
    document.getElementById('previewMetric1').style.color = colors[0].hex;
    document.getElementById('previewMetric2').style.color = colors[1].hex;
    document.getElementById('previewMetric3').style.color = colors[2].hex;

    for(let i=0; i<5; i++) {
        document.getElementById(`colorDot${i}`).style.backgroundColor = colors[i].hex;
    }

    // Populate Export Quick Code snippet
    const quickSnippet = {
        theme: {
            heading: headingFont,
            body: bodyFont,
            palette: colors.map(c => c.hex)
        }
    };
    document.getElementById('quickCodeSnippet').innerText = JSON.stringify(quickSnippet, null, 2);
}

// SWAP / ORDER STACKS
function swapSlots(index, offset) {
    let targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= colors.length) return;

    // Simple direct array swap action
    let temp = colors[index];
    colors[index] = colors[targetIndex];
    colors[targetIndex] = temp;

    updateGlobalWorkspaceStyles();
    showToast(`Swapped Color Slot ${index + 1} with Slot ${targetIndex + 1}`);
}

// LOCK/UNLOCK HANDLERS
function toggleLock(idx) {
    colors[idx].locked = !colors[idx].locked;
    updateGlobalWorkspaceStyles();
    showToast(colors[idx].locked ? `Locked Color Slot ${idx + 1}` : `Unlocked Color Slot ${idx + 1}`);
}

// INLINE SLIDERS INTERACTION
function toggleEditor(idx) {
    const editor = document.getElementById(`editor-${idx}`);
    editor.classList.toggle('hidden');
}

function manualHexChange(idx, val) {
    if (isValidHex(val)) {
        if(!val.startsWith('#')) val = '#' + val;
        colors[idx].hex = val.toUpperCase();
        updateGlobalWorkspaceStyles();
        showToast(`Set Slot ${idx + 1} to ${val.toUpperCase()}`);
    } else {
        showToast("Invalid Hex code!");
    }
}

function inlinePickerChange(idx, val) {
    colors[idx].hex = val.toUpperCase();
    updateGlobalWorkspaceStyles();
}

// Synchronize on slider updates
function updateSliders(idx) {
    const h = document.getElementById(`slider-h-${idx}`).value;
    const s = document.getElementById(`slider-s-${idx}`).value;
    const l = document.getElementById(`slider-l-${idx}`).value;

    colors[idx].hex = hslToHex(h, s, l);
    updateGlobalWorkspaceStyles();
}

// REAL TIME INTERACTIVE MOCKUP TOGGLE
function togglePreviewModal(forceState) {
    const modal = document.getElementById('visualPreviewModal');
    if (forceState !== undefined) {
        if (forceState) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
        return;
    }
    modal.classList.toggle('hidden');
}

// Swaps dashboard formats
function rotatePreviewLayout() {
    if (currentLayout === 1) {
        document.getElementById('mockupLayout1').classList.add('hidden');
        document.getElementById('mockupLayout2').classList.remove('hidden');
        currentLayout = 2;
        showToast("Switched to Executive Dashboard mockup layout.");
    } else {
        document.getElementById('mockupLayout2').classList.add('hidden');
        document.getElementById('mockupLayout1').classList.remove('hidden');
        currentLayout = 1;
        showToast("Switched to SaaS Landing Page mockup layout.");
    }
}

// EXPORT MODAL & TABS MANAGEMENT
function openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
    renderExportTab();
}

// Close export overlay modal
function closeExportModal() {
    document.getElementById('exportModal').classList.add('hidden');
}

function switchExportTab(tab) {
    document.getElementById(`tabBtn-${currentExportTab}`).classList.add('text-gray-400', 'border-transparent');
    document.getElementById(`tabBtn-${currentExportTab}`).classList.remove('text-indigo-400', 'border-indigo-500');
    
    currentExportTab = tab;
    
    document.getElementById(`tabBtn-${currentExportTab}`).classList.remove('text-gray-400', 'border-transparent');
    document.getElementById(`tabBtn-${currentExportTab}`).classList.add('text-indigo-400', 'border-indigo-500');
    renderExportTab();
}

function renderExportTab() {
    let code = "";
    if (currentExportTab === 'css') {
        code = `:root {\n` +
               `  /* Design Colors */\n` +
               `  --color-primary: ${colors[0].hex};\n` +
               `  --color-secondary: ${colors[1].hex};\n` +
               `  --color-accent: ${colors[2].hex};\n` +
               `  --color-danger: ${colors[3].hex};\n` +
               `  --color-brand: ${colors[4].hex};\n\n` +
               `  /* Typography Variables */\n` +
               `  --font-heading: '${headingFont}', sans-serif;\n` +
               `  --font-body: '${bodyFont}', sans-serif;\n` +
               `}`;
    } 
    else if (currentExportTab === 'tailwind') {
        code = `module.exports = {\n` +
               `  theme: {\n` +
               `    extend: {\n` +
               `      colors: {\n` +
               `        palette: {\n` +
               `          primary: '${colors[0].hex}',\n` +
               `          secondary: '${colors[1].hex}',\n` +
               `          accent: '${colors[2].hex}',\n` +
               `          danger: '${colors[3].hex}',\n` +
               `          brand: '${colors[4].hex}',\n` +
               `        }\n` +
               `      },\n` +
               `      fontFamily: {\n` +
               `        heading: ['${headingFont}', 'sans-serif'],\n` +
               `        body: ['${bodyFont}', 'sans-serif'],\n` +
               `      }\n` +
               `    }\n` +
               `  }\n` +
               `}`;
    } 
    else if (currentExportTab === 'json') {
        const schema = {
            colors: {
                primary: colors[0].hex,
                secondary: colors[1].hex,
                accent: colors[2].hex,
                danger: colors[3].hex,
                brand: colors[4].hex
            },
            fonts: {
                heading: headingFont,
                body: bodyFont
            }
        };
        code = JSON.stringify(schema, null, 2);
    }
    document.getElementById('exportCodeBlock').innerText = code;
}

function copyExportCodeBlock() {
    const blockText = document.getElementById('exportCodeBlock').innerText;
    copyTextToClipboard(blockText);
    showToast("Copied code snippet to clipboard!");
    closeExportModal();
}

// SIDEBAR TOGGLE ON MOBILE/DESKTOP
function toggleAiDrawer() {
    const sidebar = document.getElementById('sidebarPanel');
    const toggleText = document.getElementById('sidebarToggleText');
    sidebar.classList.toggle('hidden');
    if (sidebar.classList.contains('hidden')) {
        toggleText.innerText = "Open Sidebar";
    } else {
        toggleText.innerText = "Close Sidebar";
    }
}

function toggleMobileSheet() {
    const sheet = document.getElementById('aiMobileSheet');
    if (sheet.classList.contains('translate-y-full')) {
        sheet.classList.remove('translate-y-full');
    } else {
        sheet.classList.add('translate-y-full');
    }
}

// Robust, clean markdown JSON parser utility. Converted to safely compile strings avoiding triple backticks
function cleanAndParseJson(text) {
    if (!text) return null;
    let cleaned = text.trim();
    
    // Construct string dynamically to avoid markdown/EOF parsing conflicts
    const delimiter = '`' + '`' + '`';
    if (cleaned.startsWith(delimiter)) {
        const regexStart = new RegExp('^' + delimiter + '(?:json)?\\n');
        const regexEnd = new RegExp('\\n' + delimiter + '$');
        cleaned = cleaned.replace(regexStart, "").replace(regexEnd, "").trim();
    }
    
    // Strip any wrapping bracket differences
    const firstBracket = cleaned.indexOf("{");
    const lastBracket = cleaned.lastIndexOf("}");
    if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
    return JSON.parse(cleaned);
}

// GEMINI API BRAND BUILDER INTEGRATION - IMPLEMENTED WITH RETRY EXPONENTIAL BACKOFF AND ISOLATED ARGUMENT PROFILES
async function triggerAiBrandGeneration(isMobile = false) {
    // Guard against MouseEvent conversions
    const mobileMode = (isMobile === true);
    const promptInputId = mobileMode ? 'aiMobilePromptInput' : 'aiPromptInput';
    const userPrompt = document.getElementById(promptInputId).value.trim();

    if (!userPrompt) {
        showToast("Please enter a brand description!");
        return;
    }

    // Get dynamic layout elements
    const btnDesktopText = document.getElementById('aiBtnText');
    const btnDesktopIcon = document.getElementById('aiBtnIcon');
    const btnMobile = document.getElementById('btnGenerateAIMobile');
    const originalText = btnDesktopText.innerText;

    // Trigger UI pending loading styles
    btnDesktopText.innerText = "Consulting Gemini...";
    btnDesktopIcon.className = "fa-solid fa-spinner fa-spin";
    if(btnMobile) {
        btnMobile.disabled = true;
        btnMobile.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Analyzing Vibe...';
    }

    // Structured dynamic system instructions to prompt JSON matching exactly our desired output schema
    const systemInstructions = 
        "You are an expert design system product manager. " +
        "Generate a cohesive 5-color palette, a beautiful Google Heading font, and a readable Google Body font. " +
        "Return valid JSON matching this schema exactly:\n" +
        "{\n" +
        "  \"colors\": [\"#HEX1\", \"#HEX2\", \"#HEX3\", \"#HEX4\", \"#HEX5\"],\n" +
        "  \"headingFont\": \"Valid popular Google Font\",\n" +
        "  \"bodyFont\": \"Valid popular highly readable Google Font\",\n" +
        "  \"brandVibe\": \"1 sentence explaining the brand direction\",\n" +
        "  \"tagline\": \"Catchy 3-word brand slogan matching the vibe\"\n" +
        "}\n" +
        "Make sure fonts are available on Google Fonts (e.g. Space Grotesk, Inter, Plus Jakarta Sans, Syne, Playfair Display).";

    try {
        const responseData = await callGeminiWithRetry(userPrompt, systemInstructions);
        
        if (responseData && responseData.colors && responseData.colors.length === 5) {
            // Update palette values
            colors.forEach((col, idx) => {
                if (!col.locked) {
                    col.hex = responseData.colors[idx].toUpperCase();
                }
            });

            // Assign typography pairings
            if (responseData.headingFont) headingFont = responseData.headingFont;
            if (responseData.bodyFont) bodyFont = responseData.bodyFont;

            injectFonts(headingFont, bodyFont);

            // Sync Select Dropdowns
            addFontToSelectorIfMissing(headingFont, 'headingFontSelector');
            addFontToSelectorIfMissing(bodyFont, 'bodyFontSelector');
            document.getElementById('headingFontSelector').value = headingFont;
            document.getElementById('bodyFontSelector').value = bodyFont;

            // Display AI feedback response card
            const feedbackBox = document.getElementById('aiFeedbackBox');
            feedbackBox.classList.remove('hidden');
            document.getElementById('aiBrandVibe').innerText = responseData.brandVibe || "Created dynamic design tokens matching your aesthetic description.";
            document.getElementById('aiTagline').innerText = responseData.tagline ? `"${responseData.tagline}"` : "";

            updateGlobalWorkspaceStyles();
            showToast("Gemini built your brand architecture!");
            
            if (mobileMode) {
                toggleMobileSheet();
            }
        } else {
            throw new Error("Invalid response schema generated by AI model");
        }

    } catch (err) {
        console.error(err);
        showToast("Connection to Gemini failed. Applying calculated classic harmony fallback.");
        randomizePalette(false);
    } finally {
        // Restore button states
        btnDesktopText.innerText = originalText;
        btnDesktopIcon.className = "fa-solid fa-sparkles";
        if(btnMobile) {
            btnMobile.disabled = false;
            btnMobile.innerHTML = '<i class="fa-solid fa-sparkles mr-2"></i>Build Theme';
        }
    }
}

// Add font options on the fly if model picks exotic valid google fonts outside the default 20
function addFontToSelectorIfMissing(fontName, selectorId) {
    const selector = document.getElementById(selectorId);
    let exists = false;
    for(let i=0; i<selector.options.length; i++) {
        if (selector.options[i].value === fontName) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        const opt = document.createElement('option');
        opt.value = fontName;
        opt.innerText = fontName;
        selector.appendChild(opt);
    }
}

// EXPONENTIAL BACKOFF RETRY IMPLEMENTATION AS REQUIRED BY GEMINI API SPECIFICATION
async function callGeminiWithRetry(query, systemInstruction, retries = 5, delay = 1000) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: query }]
        }],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    colors: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "An array of exactly 5 vibrant, highly cohesive HEX color codes that fit the theme."
                    },
                    headingFont: {
                        type: "STRING",
                        description: "A valid, popular Google Font name suitable for headings."
                    },
                    bodyFont: {
                        type: "STRING",
                        description: "A valid, popular, highly readable Google Font name suitable for body copy."
                    },
                    brandVibe: {
                        type: "STRING",
                        description: "A 1-sentence description explaining the brand direction."
                    },
                    tagline: {
                        type: "STRING",
                        description: "A catchy 3-word brand tagline matching the vibe."
                    }
                },
                required: ["colors", "headingFont", "bodyFont", "brandVibe", "tagline"]
            }
        }
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const json = await response.json();
                const textResponse = json.candidates?.[0]?.content?.parts?.[0]?.text;
                return cleanAndParseJson(textResponse);
            }
        } catch (e) {
            // Silent catch for backoff retries
        }
        // Exponential backoff delay calculation
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
    throw new Error("Failed to authenticate or generate palette with Gemini API after 5 retries.");
}

// UTILITIES - CLIPBOARD & TOAST NOTIFICATION HANDLERS
function copyIndividualColor(idx) {
    const val = colors[idx].hex;
    copyTextToClipboard(val);
    showToast(`Copied ${val} to clipboard!`);
}

function copyTextToClipboard(text) {
    // Robust iframe-safe copy implementation using legacy fallback as requested
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Could not copy text: ', err);
    }
    document.body.removeChild(textArea);
}

// Display beautiful in-app toast notices
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = "flex items-center space-x-2 bg-slate-900 border border-indigo-500/20 px-4 py-3 rounded-lg shadow-xl text-xs text-slate-200 min-w-[200px] transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i><span>${message}</span>`;
    
    container.appendChild(toast);

    // Animate In
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Auto Close after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}