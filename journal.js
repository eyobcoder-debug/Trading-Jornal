// Function to load options from localStorage for each select element    
function loadOptionsFromLocalStorage() {    
    // Map of select element IDs to localStorage keys    
    const selectConfig = {    
        'account': 'accountOptions',    
        'symbol': 'symbolOptions',    
        'model': 'modelOptions',    
        'news-impact': 'newsImpactOptions',    
        'narrative': 'narrativeOptions',    
        'bias': 'biasOptions',    
        'market-conditions': 'marketConditionsOptions',    
        'trade-type': 'tradeTypeOptions',    
        'session': 'sessionOptions',    
        'entry-timeframe': 'entryTimeframeOptions',    
        'confluences': 'confluencesOptions',    
        'entry-signals': 'entrySignalsOptions',    
        'order-type': 'orderTypeOptions',    
        'position': 'positionOptions',    
        'sl-management': 'slManagementOptions',    
        'tp-management': 'tpManagementOptions',    
        'mistakes': 'mistakesOptions',    
        'psychology': 'psychologyOptions'    
    };    
    
    // Default options as fallback    
    const defaultOptions = {    
        'account': ["Main Account", "Demo Account", "Secondary Account", "Prop Account"],    
        'symbol': ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "XAU/USD", "XAG/USD", "BTC/USD", "ETH/USD"],    
        'model': ["Trend Following", "Range Trading", "Breakout", "Reversal", "Scalping", "News Trading", "Swing Trading"],    
        'news-impact': ["High", "Medium", "Low", "None"],    
        'narrative': ["Bullish", "Bearish", "Neutral", "Mixed"],    
        'bias': ["Long", "Short", "Neutral"],    
        'market-conditions': ["Trending", "Ranging", "Volatile", "Calm", "Breakout", "Reversal"],    
        'trade-type': ["Swing Trade", "Day Trade", "Scalp", "Position Trade"],    
        'session': ["Asian", "London", "New York", "London-New York Overlap", "24H (Crypto)"],    
        'entry-timeframe': ["1M", "5M", "15M", "30M", "1H", "4H", "D", "W"],    
        'confluences': ["Support/Resistance", "Trendline", "Fibonacci", "Moving Averages", "Multiple Timeframes", "Order Flow", "Market Structure", "Supply/Demand"],    
        'entry-signals': ["Pin Bar", "Engulfing Pattern", "EMA Crossover", "MACD Crossover", "RSI Divergence", "Breakout", "Pullback"],    
        'order-type': ["Market", "Limit", "Stop", "Stop Limit"],    
        'position': ["Buy", "Sell"],    
        'sl-management': ["Fixed", "Trailing", "Manual Adjustment", "Breakeven", "None"],    
        'tp-management': ["Full Take Profit", "Partial Take Profit", "Trailing Take Profit", "Manual Close"],    
        'mistakes': ["Early Entry", "Late Entry", "Early Exit", "Late Exit", "Overtrading", "Revenge Trading", "Ignored SL", "Ignored TP", "Emotional Trading"],    
        'psychology': ["Confident", "Calm", "Nervous", "Impatient", "Fearful", "Greedy", "Disciplined", "Indecisive"]    
    };    
    
    // Function to populate a select element    
    function populateSelect(selectId, localStorageKey, defaultOptionsArray, isMultiple = false) {    
        const selectElement = document.getElementById(selectId);    
        if (!selectElement) return;    
            
        // Clear existing options except the first placeholder    
        while (selectElement.options.length > 1) {    
            selectElement.remove(1);    
        }    
            
        // Get options from localStorage or use defaults    
        const storedOptions = JSON.parse(localStorage.getItem(localStorageKey));    
        const optionsArray = storedOptions || defaultOptionsArray;    
            
        // Add each option to the select element    
        optionsArray.forEach(option => {    
            const optionElement = document.createElement('option');    
            optionElement.value = option;    
            optionElement.textContent = option;    
            selectElement.appendChild(optionElement);    
        });    
    }    
    
    // Populate all select elements    
    Object.entries(selectConfig).forEach(([selectId, localStorageKey]) => {    
        const isMultiple = [    
            'news-impact', 'market-conditions', 'confluences', 'entry-signals',     
            'sl-management', 'tp-management', 'mistakes', 'psychology'    
        ].includes(selectId);    
            
        populateSelect(selectId, localStorageKey, defaultOptions[selectId], isMultiple);    
    });    
}    
    
// Function to handle multiple select display (optional visual enhancement)    
function enhanceMultipleSelects() {    
    const multipleSelects = document.querySelectorAll('select[multiple]');    
        
    multipleSelects.forEach(select => {    
        // Create a display area for selected values    
        const displayDiv = document.createElement('div');    
        displayDiv.className = 'selected-values-display';    
        select.parentNode.insertBefore(displayDiv, select.nextSibling);    
            
        // Function to update the display    
        const updateDisplay = () => {    
            displayDiv.innerHTML = '';    
            const selectedOptions = Array.from(select.selectedOptions);    
                
            selectedOptions.forEach(option => {    
                const tag = document.createElement('span');    
                tag.className = 'selected-tag';    
                tag.innerHTML = `    
                    ${option.textContent}    
                    <span class="remove-tag" data-value="${option.value}">×</span>    
                `;    
                displayDiv.appendChild(tag);    
            });    
                
            // Add click event to remove tags    
            displayDiv.querySelectorAll('.remove-tag').forEach(removeBtn => {    
                removeBtn.addEventListener('click', (e) => {    
                    e.stopPropagation();    
                    const valueToRemove = removeBtn.getAttribute('data-value');    
                    const optionToRemove = Array.from(select.options)    
                        .find(opt => opt.value === valueToRemove);    
                    if (optionToRemove) {    
                        optionToRemove.selected = false;    
                        updateDisplay();    
                    }    
                });    
            });    
        };    
            
        // Update display when selection changes    
        select.addEventListener('change', updateDisplay);    
    });    
}    
    
const journalTable = document.querySelector('.table-container');    
            
// Horizontal scroll buttons    
const scrollLeftBtn = document.getElementById('scrollLeftBtn');    
const scrollRightBtn = document.getElementById('scrollRightBtn');    
    
// Show/hide horizontal buttons    
journalTable.addEventListener('scroll', function() {    
    if (journalTable.scrollLeft > 0) {    
        scrollLeftBtn.style.display = 'flex';    
        scrollRightBtn.style.display = 'flex';    
    } else {    
        scrollLeftBtn.style.display = 'flex';    
        scrollRightBtn.style.display = 'flex';    
    }    
});    
    
// Horizontal scroll functionality    
scrollLeftBtn.addEventListener('click', function() {    
    journalTable.scrollBy({    
        left: -200,    
        behavior: 'smooth'    
    });    
});    
    
scrollRightBtn.addEventListener('click', function() {    
    journalTable.scrollBy({    
        left: 200,    
        behavior: 'smooth'    
    });    
});             
    
/* ---------------------------    
   INDEXEDDB SETUP - Image Storage    
   --------------------------- */    
const DB_NAME = 'TradingJournalDB';    
const DB_VERSION = 1;    
const STORE_NAME = 'screenshots';    
    
let db = null;    
    
// Initialize IndexedDB    
async function initDB() {    
    return new Promise((resolve, reject) => {    
        const request = indexedDB.open(DB_NAME, DB_VERSION);    
        
        request.onerror = () => reject(request.error);    
        request.onsuccess = () => {    
            db = request.result;    
            console.log('IndexedDB initialized successfully');    
            resolve(db);    
        };    
        
        request.onupgradeneeded = (event) => {    
            const db = event.target.result;    
            if (!db.objectStoreNames.contains(STORE_NAME)) {    
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });    
                store.createIndex('tradeId', 'tradeId', { unique: false });    
                console.log('Object store created');    
            }    
        };    
    });    
}    
    
// Store screenshot in IndexedDB    
async function storeScreenshot(tradeId, file) {    
    if (!db) await initDB();    
        
    return new Promise((resolve, reject) => {    
        const transaction = db.transaction([STORE_NAME], 'readwrite');    
        const store = transaction.objectStore(STORE_NAME);    
        
        const screenshotId = `${tradeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;    
        const screenshot = {    
            id: screenshotId,    
            tradeId: tradeId,    
            filename: file.name,    
            type: file.type,    
            size: file.size,    
            lastModified: file.lastModified,    
            blob: file,    
            uploadedAt: new Date().toISOString()    
        };    
        
        const request = store.add(screenshot);    
        
        request.onsuccess = () => {    
            console.log(`Screenshot stored with ID: ${screenshotId}`);    
            resolve(screenshotId);    
        };    
        request.onerror = () => reject(request.error);    
    });    
}    
    
// Get all screenshot IDs for a trade    
async function getScreenshotIdsForTrade(tradeId) {    
    if (!db) await initDB();    
        
    return new Promise((resolve, reject) => {    
        const transaction = db.transaction([STORE_NAME], 'readonly');    
        const store = transaction.objectStore(STORE_NAME);    
        const index = store.index('tradeId');    
        
        const request = index.getAll(tradeId);    
        request.onsuccess = () => {    
            const screenshots = request.result;    
            resolve(screenshots.map(s => s.id));    
        };    
        request.onerror = () => reject(request.error);    
    });    
}    
    
// Get screenshot blob by ID    
async function getScreenshotById(screenshotId) {    
    if (!db) await initDB();    
        
    return new Promise((resolve, reject) => {    
        const transaction = db.transaction([STORE_NAME], 'readonly');    
        const store = transaction.objectStore(STORE_NAME);    
        
        const request = store.get(screenshotId);    
        request.onsuccess = () => {    
            if (request.result) {    
                resolve(request.result.blob);    
            } else {    
                resolve(null);    
            }    
        };    
        request.onerror = () => reject(request.error);    
    });    
}    
    
// Delete screenshot by ID    
async function deleteScreenshotById(screenshotId) {    
    if (!db) await initDB();    
        
    return new Promise((resolve, reject) => {    
        const transaction = db.transaction([STORE_NAME], 'readwrite');    
        const store = transaction.objectStore(STORE_NAME);    
        
        const request = store.delete(screenshotId);    
        request.onsuccess = () => resolve(true);    
        request.onerror = () => reject(request.error);    
    });    
}    
    
// Delete all screenshots for a trade    
async function deleteScreenshotsForTrade(tradeId) {    
    const screenshotIds = await getScreenshotIdsForTrade(tradeId);    
    for (const id of screenshotIds) {    
        await deleteScreenshotById(id);    
    }    
    console.log(`Deleted ${screenshotIds.length} screenshots for trade ${tradeId}`);    
}    
    
// Generate thumbnail URL from blob    
function generateThumbnailUrl(blob) {    
    return URL.createObjectURL(blob);    
}    
    
// Revoke thumbnail URLs to prevent memory leaks    
function revokeThumbnailUrls(urls) {    
    urls.forEach(url => URL.revokeObjectURL(url));    
}    
    
/* ---------------------------    
   Trading Journal (with IndexedDB image storage)    
   --------------------------- */    
    
// Load existing trades (if any)    
let trades = JSON.parse(localStorage.getItem('tradingJournalTrades')) || [    
    // Sample seed data (without screenshot blobs)    
    {    
        id: "TR001",    
        account: "Main Account",    
        date: "2023-10-15",    
        symbol: "EUR/USD",    
        model: "Trend Following",    
        newsImpact: "Low",    
        narrative: "Bullish",    
        bias: "Long",    
        marketConditions: "Trending",    
        tradeType: "Swing Trade",    
        session: "London",    
        entryTimeframe: "1H",    
        confluences: "Support/Resistance",    
        entrySignals: "Pin Bar",    
        orderType: "Market",    
        position: "Buy",    
        slPips: 25,    
        risk: 1.5,    
        slManagement: "Fixed",    
        actualRR: 2.5,    
        maxRR: 3.2,    
        tpManagement: "Partial Take Profit",    
        netPnl: 375,    
        mistakes: "None",    
        lessonsLearned: "Patiently waited for confirmation before entry. Good risk management.",    
        psychology: "Confident",    
        screenshotIds: [] // Now storing IDs instead of base64    
    }    
];    
    
function sortTradesByDateAndReassignIds(order = "asc") {    
    // 1. Sort trades by date    
    trades.sort((a, b) => {    
        const dateA = new Date(a.date);    
        const dateB = new Date(b.date);    
        return order === "asc" ? dateA - dateB : dateB - dateA;    
    });    
    
    // 2. Reassign IDs based on new order    
    trades.forEach((trade, index) => {    
        trade.id = `TR${String(index + 1).padStart(3, "0")}`;    
    });    
    
    // 3. Save back to localStorage    
    localStorage.setItem("tradingJournalTrades", JSON.stringify(trades));    
}    
    
// Import JSON file    
document.getElementById('fileInput').addEventListener('change', function (event) {    
    const file = event.target.files[0];    
    if (!file) return;    
    
    const reader = new FileReader();    
    
    reader.onload = function (e) {    
        try {    
            const parsedData = JSON.parse(e.target.result);    
    
            if (!Array.isArray(parsedData)) {    
                alert('JSON file must contain an array');    
                return;    
            }    
    
            // Push one by one into trades    
            parsedData.forEach(trade => {    
                trades.push(trade);    
            });    
    
            // Save back to localStorage (important)    
            localStorage.setItem('tradingJournalTrades', JSON.stringify(trades));    
            console.log('Trades imported successfully:', trades);    
        } catch (error) {    
            alert('Invalid JSON file');    
            console.error(error);    
        }    
    };    
    
    reader.readAsText(file);    
    sortTradesByDateAndReassignIds("desc"); // newest → oldest    
    renderJournalTable();    
});    
    
sortTradesByDateAndReassignIds("desc"); // newest → oldest    
    
// File input and label    
const fileInput = document.getElementById('image-upload');    
const fileLabel = document.getElementById('file-label');    
    
// Show chosen file names in label for user feedback    
fileInput.addEventListener("change", function () {    
    const names = Array.from(fileInput.files).map(f => f.name).join(", ");    
    fileLabel.textContent = names || "No file chosen";    
});    
    
/* ---------------------------    
   Image Viewer: full-screen overlay gallery    
   --------------------------- */    
async function viewImages(tradeId, startIndex = 0) {    
    const screenshotIds = await getScreenshotIdsForTrade(tradeId);    
    if (!screenshotIds || screenshotIds.length === 0) {    
        alert("No images available");    
        return;    
    }    
    
    // Container overlay    
    const overlay = document.createElement('div');    
    overlay.style.cssText = `    
        position: fixed;    
        inset: 0;    
        background: rgba(0,0,0,0.9);    
        display: flex;    
        align-items: center;    
        justify-content: center;    
        z-index: 3000;    
        padding: 20px;    
    `;    
    
    let current = startIndex;    
    const objectUrls = []; // Store URLs for cleanup    
    
    // Function to load and display image    
    async function loadImage(index) {    
        const screenshotId = screenshotIds[index];    
        const blob = await getScreenshotById(screenshotId);    
        if (!blob) return;    
        
        const objectUrl = URL.createObjectURL(blob);    
        objectUrls.push(objectUrl); // Track for cleanup    
        img.src = objectUrl;    
        caption.textContent = `${index + 1} / ${screenshotIds.length}`;    
    }    
    
    // Image element    
    const img = document.createElement('img');    
    img.style.cssText = `    
        max-width: 95%;    
        max-height: 85%;    
        border-radius: 8px;    
        box-shadow: 0 8px 40px rgba(0,0,0,0.6);    
    `;    
    overlay.appendChild(img);    
    
    // Load initial image    
    await loadImage(current);    
    
    // Caption / index    
    const caption = document.createElement('div');    
    caption.style.cssText = `    
        position: absolute;    
        bottom: 28px;    
        color: #fff;    
        font-weight: 600;    
        background: rgba(0,0,0,0.4);    
        padding: 6px 10px;    
        border-radius: 12px;    
    `;    
    overlay.appendChild(caption);    
    
    // Left/right navigation    
    async function prev() {    
        current = (current - 1 + screenshotIds.length) % screenshotIds.length;    
        await loadImage(current);    
    }    
    async function next() {    
        current = (current + 1) % screenshotIds.length;    
        await loadImage(current);    
    }    
    
    const left = document.createElement('button');    
    left.innerHTML = '&#10094;';    
    left.style.cssText = `    
        position:absolute; left:16px; font-size:32px; background:none; color:#fff; border:none; cursor:pointer;    
    `;    
    left.addEventListener('click', (e) => { e.stopPropagation(); prev(); });    
    overlay.appendChild(left);    
    
    const right = document.createElement('button');    
    right.innerHTML = '&#10095;';    
    right.style.cssText = `    
        position:absolute; right:16px; font-size:32px; background:none; color:#fff; border:none; cursor:pointer;    
    `;    
    right.addEventListener('click', (e) => { e.stopPropagation(); next(); });    
    overlay.appendChild(right);    
    
    // Close on overlay click or Escape    
    function closeViewer() {    
        // Clean up object URLs to prevent memory leaks    
        objectUrls.forEach(url => URL.revokeObjectURL(url));    
        overlay.remove();    
        document.removeEventListener('keydown', onKey);    
    }    
    
    overlay.addEventListener('click', closeViewer);    
    const onKey = (e) => {    
        if (e.key === 'Escape') closeViewer();    
        else if (e.key === 'ArrowLeft') prev();    
        else if (e.key === 'ArrowRight') next();    
    };    
    document.addEventListener('keydown', onKey);    
    
    // Support swipe on touch devices    
    let startX = null;    
    overlay.addEventListener('touchstart', (ev) => { startX = ev.touches[0].clientX; });    
    overlay.addEventListener('touchend', async (ev) => {    
        if (startX === null) return;    
        const endX = ev.changedTouches[0].clientX;    
        const diff = endX - startX;    
        if (Math.abs(diff) > 40) {    
            if (diff > 0) await prev(); else await next();    
        }    
        startX = null;    
    });    
    
    // Prevent clicks on image from closing viewer    
    img.addEventListener('click', (e) => e.stopPropagation());    
    
    document.body.appendChild(overlay);    
}    
    
/* ---------------------------    
   Render Journal Table with Thumbnails    
   --------------------------- */    
async function renderJournalTable(filteredTrades = trades) {    
    const tableBody = document.getElementById('journal-table-body');    
    tableBody.innerHTML = '';    
    
    if (filteredTrades.length === 0) {    
        tableBody.innerHTML = `    
            <tr>    
                <td colspan="28" style="text-align: center; padding: 40px;">    
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #475569; margin-bottom: 15px;"></i>    
                    <h3 style="color: #94a3b8;">No trades found</h3>    
                    <p style="color: #64748b;">Click "Add Trade" to start your trading journal</p>    
                </td>    
            </tr>    
        `;    
        return;    
    }    
        
    // Initialize IndexedDB if needed    
    if (!db) await initDB();    
        
    for (const trade of filteredTrades) {    
        let pnlClass, pnlStatus;    
        if (trade.netPnl > 0) { pnlClass = 'profit'; pnlStatus = 'Profit'; }    
        else if (trade.netPnl < 0) { pnlClass = 'loss'; pnlStatus = 'Loss'; }    
        else { pnlClass = 'break-even'; pnlStatus = 'Break Even'; }    
    
        const lessonsTruncated = trade.lessonsLearned && trade.lessonsLearned.length > 50    
            ? trade.lessonsLearned.substring(0, 50) + '...'    
            : (trade.lessonsLearned || '');    
    
        const row = document.createElement('tr');    
    
        // Build screenshot cell    
        const screenshotIds = Array.isArray(trade.screenshotIds) ? trade.screenshotIds : (trade.screenshot ? [trade.screenshot] : []);    
        let screenshotCellHtml;    
        
        if (screenshotIds.length === 0) {    
            screenshotCellHtml = `<div class="image-upload" style="cursor: default;">    
                                    <i class="fas fa-image"></i>    
                                    <span>No</span>    
                                 </div>`;    
        } else {    
            // Get first 4 thumbnails for display    
            const thumbUrls = [];    
            for (let i = 0; i < Math.min(screenshotIds.length, 4); i++) {    
                try {    
                    const blob = await getScreenshotById(screenshotIds[i]);    
                    if (blob) {    
                        const url = generateThumbnailUrl(blob);    
                        thumbUrls.push(url);    
                    }    
                } catch (error) {    
                    console.error('Error loading thumbnail:', error);    
                }    
            }    
            
            const thumbs = thumbUrls.map((url, i) =>    
                `<img class="thumb" data-index="${i}" src="${url}" style="width:48px;height:32px;object-fit:cover;border-radius:4px;margin-right:6px;cursor:pointer;border:1px solid #334155;">`    
            ).join('');    
            
            const moreBadge = screenshotIds.length > 4 ? `<span style="margin-left:6px;color:#94a3b8;font-size:0.85rem">+${screenshotIds.length-4}</span>` : '';    
            screenshotCellHtml = `<div class="thumb-container" style="display:flex;align-items:center;">${thumbs}${moreBadge}</div>`;    
            
            // Store trade ID for click handlers    
            row.dataset.tradeId = trade.id;    
        }    
    
        row.innerHTML = `    
            <td>${trade.id}</td>    
            <td>${trade.account}</td>    
            <td>${trade.date}</td>    
            <td>${trade.symbol}</td>    
            <td>${trade.model}</td>    
            <td>${trade.newsImpact}</td>    
            <td>${trade.narrative}</td>    
            <td>${trade.bias}</td>    
            <td>${trade.marketConditions}</td>    
            <td>${trade.tradeType}</td>    
            <td>${trade.session}</td>    
            <td>${trade.entryTimeframe}</td>    
            <td>${trade.confluences}</td>    
            <td>${trade.entrySignals}</td>    
            <td>${trade.orderType}</td>    
            <td>${trade.position}</td>    
            <td>${trade.slPips}</td>    
            <td>${trade.risk}%</td>    
            <td>${trade.slManagement}</td>    
            <td>${trade.actualRR}</td>    
            <td>${trade.maxRR}</td>    
            <td>${trade.tpManagement}</td>    
            <td class="${pnlClass}">${trade.netPnl > 0 ? '+' : ''}$${trade.netPnl}</td>    
            <td><span class="status-badge status-${pnlStatus.toLowerCase().replace(' ', '-')}">${pnlStatus}</span></td>    
            <td>${screenshotCellHtml}</td>    
            <td>${trade.mistakes}</td>    
            <td title="${trade.lessonsLearned}">${lessonsTruncated}</td>    
            <td>${trade.psychology}</td>    
            <td class="action-cell"></td>    
        `;    
    
        // Delete button    
        const deleteBtn = document.createElement('button');    
        deleteBtn.textContent = 'Delete';    
        deleteBtn.classList.add('delete-btn');    
        deleteBtn.addEventListener('click', async (e) => {    
            e.stopPropagation();    
            if (!confirm("Are you sure you want to delete this trade and all its screenshots?")) return;    
            
            // Delete screenshots from IndexedDB    
            await deleteScreenshotsForTrade(trade.id);    
            
            // Delete trade from array    
            deleteTradeById(trade.id);    
            renderJournalTable();    
            updateStatsSummary();    
        });    
        row.querySelector('.action-cell').appendChild(deleteBtn);    
    
        tableBody.appendChild(row);    
    
        // Attach thumbnail click handlers    
        const thumbContainer = row.querySelector('.thumb-container');    
        if (thumbContainer && screenshotIds.length > 0) {    
            thumbContainer.querySelectorAll('img.thumb').forEach((imgEl, index) => {    
                imgEl.addEventListener('click', (ev) => {    
                    ev.stopPropagation();    
                    viewImages(trade.id, index);    
                });    
                imgEl.addEventListener('touchstart', (ev) => {    
                    ev.stopPropagation();    
                    viewImages(trade.id, index);    
                });    
            });    
    
            thumbContainer.addEventListener('click', (ev) => {    
                if (!ev.target.classList.contains('thumb')) {    
                    ev.stopPropagation();    
                    viewImages(trade.id, 0);    
                }    
            });    
        }    
    }    
        
    // Clean up any old thumbnails periodically (optional)    
    setTimeout(() => {    
        document.querySelectorAll('.thumb').forEach(img => {    
            if (img.src && img.src.startsWith('blob:')) {    
                URL.revokeObjectURL(img.src);    
            }    
        });    
    }, 1000);    
}    
    
/* ---------------------------    
   Delete helper    
   --------------------------- */    
function deleteTradeById(tradeId) {    
    trades = trades.filter(t => t.id !== tradeId);    
    localStorage.setItem('tradingJournalTrades', JSON.stringify(trades));    
}    
    
/* ---------------------------    
   Stats    
   --------------------------- */    
function updateStatsSummary() {    
    const totalTrades = trades.length;    
    const profitTrades = trades.filter(t => t.netPnl > 0).length;    
    const winRate = totalTrades > 0 ? Math.round((profitTrades / totalTrades) * 100) : 0;    
    const totalPnl = trades.reduce((sum, trade) => sum + (parseFloat(trade.netPnl) || 0), 0);    
    const avgRR = trades.length > 0 ? (trades.reduce((sum, trade) => sum + (parseFloat(trade.actualRR) || 0), 0) / trades.length).toFixed(2) : 0;    
    
    document.getElementById('total-trades').textContent = totalTrades;    
    document.getElementById('win-rate').textContent = `${winRate}%`;    
    document.getElementById('total-pnl').textContent = `$${totalPnl}`;    
    document.getElementById('avg-rr').textContent = avgRR;    
}    
    
/* ---------------------------    
   Modal open / edit    
   --------------------------- */    
async function openModal(mode, tradeId = null) {    
    const modal = document.getElementById('trade-modal');    
    const modalTitle = document.getElementById('modal-title');    
    const form = document.getElementById('trade-form');    
    
    if (mode === 'add') {    
        modalTitle.textContent = 'Add New Trade';    
        form.reset();    
        document.getElementById('trade-id').value = generateTradeId();    
        const today = new Date().toISOString().split('T')[0];    
        document.getElementById('entry-exit-date').value = today;    
        document.getElementById('sl-pips').value = 20;    
        document.getElementById('risk').value = 1.0;    
        document.getElementById('actual-rr').value = 1.5;    
        document.getElementById('max-rr').value = 2.0;    
        document.getElementById('net-pnl').value = 0;    
        document.getElementById('mistakes').value = 'None';    
        document.getElementById('lessons-learned').value = '';    
        fileLabel.textContent = 'No file chosen';    
    } else if (mode === 'edit' && tradeId) {    
        modalTitle.textContent = 'Edit Trade';    
        const trade = trades.find(t => t.id === tradeId);    
        if (trade) {    
            // Standard single-value fields    
            const fields = [    
                'trade-id', 'account', 'entry-exit-date', 'symbol', 'model',    
                'narrative', 'bias', 'trade-type', 'session', 'entry-timeframe',    
                'order-type', 'position', 'sl-pips', 'risk',    
                'actual-rr', 'max-rr', 'net-pnl', 'lessons-learned'    
            ];    
            fields.forEach(id => {    
                const el = document.getElementById(id);    
                const prop = id.replace(/-([a-z])/g, g => g[1].toUpperCase());    
                if (el && trade[prop] !== undefined) el.value = trade[prop];    
            });    
    
            // Multi-select helper    
            const setMultiSelect = (elementId, data) => {    
                const selectElement = document.getElementById(elementId);    
                if (!selectElement) return;    
                const dataArray = Array.isArray(data) ? data : String(data || '').split(',').map(s => s.trim()).filter(Boolean);    
                for (let option of selectElement.options) {    
                    option.selected = dataArray.includes(option.value);    
                }    
            };    
    
            setMultiSelect('confluences', trade.confluences);    
            setMultiSelect('entry-signals', trade.entrySignals);    
            setMultiSelect('news-impact', trade.newsImpact);    
            setMultiSelect('sl-management', trade.slManagement);    
            setMultiSelect('market-conditions', trade.marketConditions);    
            setMultiSelect('mistakes', trade.mistakes);    
            setMultiSelect('tp-management', trade.tpManagement);    
            setMultiSelect('psychology', trade.psychology);    
    
            // Show existing image count    
            const screenshotIds = Array.isArray(trade.screenshotIds) ? trade.screenshotIds : [];    
            fileLabel.textContent = screenshotIds.length ? `Has ${screenshotIds.length} image(s)` : 'No file chosen';    
        }    
    }    
    modal.style.display = 'flex';    
}    
    
/* ---------------------------    
   Save trade (handles image storage in IndexedDB)    
   --------------------------- */    
async function saveTrade() {    
    const tradeId = document.getElementById('trade-id').value;    
    const existingIndex = trades.findIndex(t => t.id === tradeId);    
    
    function getMultipleSelectedValues(selectId) {    
        const selectElement = document.getElementById(selectId);    
        const selectedValues = [];    
        for (let i = 0; i < selectElement.options.length; i++) {    
            if (selectElement.options[i].selected) selectedValues.push(selectElement.options[i].value);    
        }    
        return selectedValues;    
    }    
    
    // Initialize IndexedDB if needed    
    if (!db) await initDB();    
    
    // Store new images in IndexedDB    
    const imageFiles = document.getElementById('image-upload').files;    
    const newScreenshotIds = [];    
    if (imageFiles.length > 0) {    
        for (const file of imageFiles) {    
            try {    
                const screenshotId = await storeScreenshot(tradeId, file);    
                newScreenshotIds.push(screenshotId);    
            } catch (error) {    
                console.error('Error storing screenshot:', error);    
                alert('Error storing one or more images. Please try again.');    
                return;    
            }    
        }    
    }    
    
    // Build trade object    
    const tradeData = {    
        id: tradeId,    
        account: document.getElementById('account').value,    
        date: document.getElementById('entry-exit-date').value,    
        symbol: document.getElementById('symbol').value,    
        model: document.getElementById('model').value,    
        newsImpact: getMultipleSelectedValues('news-impact'),    
        narrative: document.getElementById('narrative').value,    
        bias: document.getElementById('bias').value,    
        marketConditions: getMultipleSelectedValues('market-conditions'),    
        tradeType: document.getElementById('trade-type').value,    
        session: document.getElementById('session').value,    
        entryTimeframe: document.getElementById('entry-timeframe').value,    
        confluences: getMultipleSelectedValues('confluences'),    
        entrySignals: getMultipleSelectedValues('entry-signals'),    
        orderType: document.getElementById('order-type').value,    
        position: document.getElementById('position').value,    
        slPips: parseFloat(document.getElementById('sl-pips').value) || 0,    
        risk: parseFloat(document.getElementById('risk').value) || 0,    
        slManagement: getMultipleSelectedValues('sl-management'),    
        actualRR: parseFloat(document.getElementById('actual-rr').value) || 0,    
        maxRR: parseFloat(document.getElementById('max-rr').value) || 0,    
        tpManagement: getMultipleSelectedValues('tp-management'),    
        netPnl: parseFloat(document.getElementById('net-pnl').value) || 0,    
        mistakes: getMultipleSelectedValues('mistakes'),    
        lessonsLearned: document.getElementById('lessons-learned').value,    
        psychology: getMultipleSelectedValues('psychology'),    
        screenshotIds: []    
    };    
    
    // Handle screenshot IDs    
    if (existingIndex >= 0) {    
        const existing = trades[existingIndex];    
        // Keep existing IDs unless new images were added    
        tradeData.screenshotIds = existing.screenshotIds || [];    
        if (newScreenshotIds.length > 0) {    
            tradeData.screenshotIds.push(...newScreenshotIds);    
        }    
    } else {    
        tradeData.screenshotIds = newScreenshotIds;    
    }    
    
    // Update or add trade    
    if (existingIndex >= 0) {    
        trades[existingIndex] = tradeData;    
    } else {    
        trades.push(tradeData);    
    }    
    
    localStorage.setItem('tradingJournalTrades', JSON.stringify(trades));    
    sortTradesByDateAndReassignIds("desc");    
    renderJournalTable();    
    updateStatsSummary();    
    
    document.getElementById('trade-modal').style.display = 'none';    
    alert(`Trade ${tradeId} saved successfully!`);    
}    
    
/* ---------------------------    
   Helper: generate ID    
   --------------------------- */    
function generateTradeId() {    
    const lastId = trades.length > 0 ? parseInt((trades[trades.length - 1].id || "TR0").replace('TR', ''), 10) : 0;    
    return `TR${String(lastId + 1).padStart(3, '0')}`;    
}    
    
/* ---------------------------    
   Export & Clear    
   --------------------------- */    
async function exportData() {    
    // Export trades data without blobs    
    const exportData = trades.map(trade => {    
        const { screenshotIds, ...tradeData } = trade;    
        return {    
            ...tradeData,    
            screenshotCount: screenshotIds ? screenshotIds.length : 0    
        };    
    });    
    
    const dataStr = JSON.stringify(exportData, null, 2);    
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);    
    const exportFileDefaultName = `trading-journal-${new Date().toISOString().split('T')[0]}.json`;    
    const linkElement = document.createElement('a');    
    linkElement.setAttribute('href', dataUri);    
    linkElement.setAttribute('download', exportFileDefaultName);    
    linkElement.click();    
    alert(`Exported ${trades.length} trades to JSON file (images stored separately in browser database).`);    
}    
    
async function clearAllTrades() {    
    if (confirm('Are you sure you want to delete ALL trades and ALL screenshots? This action cannot be undone.')) {    
        // Clear IndexedDB    
        if (db) {    
            const transaction = db.transaction([STORE_NAME], 'readwrite');    
            const store = transaction.objectStore(STORE_NAME);    
            const request = store.clear();    
            request.onsuccess = () => console.log('IndexedDB cleared');    
        }    
        
        // Clear trades array    
        trades = [];    
        localStorage.removeItem('tradingJournalTrades');    
        renderJournalTable();    
        updateStatsSummary();    
        alert('All trades and screenshots have been cleared.');    
    }    
}    
    
/* ---------------------------    
   Initialize DOM event listeners    
   --------------------------- */    
document.addEventListener('DOMContentLoaded', async function () {    
    // Initialize IndexedDB first    
    await initDB();    
    loadOptionsFromLocalStorage();    
        
    // Optional: Enhance multiple selects with visual tags    
    enhanceMultipleSelects();    
        
    // Refresh options when modal is opened    
    const modal = document.getElementById('trade-modal');    
    const addTradeBtn = document.getElementById('add-trade-btn');    
        
    if (addTradeBtn) {    
        addTradeBtn.addEventListener('click', () => {               
            setTimeout(loadOptionsFromLocalStorage, 10);    
            openModal('add');    
        });    
    }    
        
    if (modal) {    
        const observer = new MutationObserver((mutations) => {    
            mutations.forEach((mutation) => {    
                if (mutation.attributeName === 'style' && modal.style.display === 'flex') {    
                    setTimeout(loadOptionsFromLocalStorage, 10);    
                }    
            });    
        });    
        observer.observe(modal, { attributes: true });    
    }        
        
    renderJournalTable();    
    updateStatsSummary();    
        
        
    const closeModalBtn = document.getElementById('close-modal');    
    const cancelTradeBtn = document.getElementById('cancel-trade');    
    const tradeForm = document.getElementById('trade-form');    
        
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');    
    cancelTradeBtn.addEventListener('click', () => modal.style.display = 'none');    
    
    modal.addEventListener('click', function (e) {    
        if (e.target === modal) modal.style.display = 'none';    
    });    
    
    tradeForm.addEventListener('submit', function (e) {    
        e.preventDefault();    
        saveTrade();    
    });    
    
    document.getElementById('search-trades').addEventListener('input', function () {    
        filterTrades(this.value);    
    });    
    
    document.getElementById('export-btn').addEventListener('click', exportData);    
    document.getElementById('clear-all-btn').addEventListener('click', clearAllTrades);    
    
    const today = new Date().toISOString().split('T')[0];    
    document.getElementById('entry-exit-date').value = today;    
    document.getElementById('trade-id').value = generateTradeId();    
    
    // Double-click to edit rows    
    document.addEventListener('dblclick', function (e) {    
        if (e.target.tagName === 'TD') {    
            const row = e.target.parentElement;    
            const tradeId = row.cells[0].textContent;    
            openModal('edit', tradeId);    
        }    
    });    
});    
    
/* ---------------------------    
   Search utility    
   --------------------------- */    
function filterTrades(searchTerm) {    
    if (!searchTerm) {    
        renderJournalTable(trades);    
        return;    
    }    
    const filtered = trades.filter(trade => {    
        return Object.values(trade).some(value =>    
            String(value).toLowerCase().includes(searchTerm.toLowerCase())    
        );    
    });    
    renderJournalTable(filtered);    
}    
    
/* ---------------------------    
   Clean up on page unload    
   --------------------------- */    
window.addEventListener('beforeunload', function() {    
    // Revoke all blob URLs to prevent memory leaks    
    document.querySelectorAll('img.thumb').forEach(img => {    
        if (img.src && img.src.startsWith('blob:')) {    
            URL.revokeObjectURL(img.src);    
        }    
    });    
});