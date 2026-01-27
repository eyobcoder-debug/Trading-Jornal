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
   Trading Journal (with image upload/view)
   Replace your current <script> with this
   --------------------------- */

// load existing trades (if any)
let trades = JSON.parse(localStorage.getItem('tradingJournalTrades')) || [
    // sample seed data (unchanged)
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
        screenshot: [""] // keep array shape
    },
    // other seeds...
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
            console.error(JSON.stringify(error));
        }
    };

    reader.readAsText(file);
    sortTradesByDateAndReassignIds("desc"); // newest → oldest
    renderJournalTable();
});

sortTradesByDateAndReassignIds("desc"); // newest → oldest

// file input and label
const fileInput = document.getElementById('image-upload');
const fileLabel = document.getElementById('file-label');

// show chosen file names (not base64) in label for user feedback
fileInput.addEventListener("change", function () {
    const names = Array.from(fileInput.files).map(f => f.name).join(", ");
    fileLabel.textContent = names || "No file chosen";
});

/* ---------------------------
   Utility: Convert FileList => Array of base64 strings
   --------------------------- */
function filesToBase64(files) {
    if (!files || files.length === 0) return Promise.resolve([]);
    return Promise.all(
        Array.from(files).map(file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = err => reject(err);
            reader.readAsDataURL(file);
        }))
    );
}

/* ---------------------------
   Image Viewer: full-screen overlay gallery
   --------------------------- */
function viewImages(imageArray, startIndex = 0) {
    if (!imageArray || imageArray.length === 0) {
        alert("No images available");
        return;
    }

    // container overlay
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

    // image element
    const img = document.createElement('img');
    img.src = imageArray[current];
    img.style.cssText = `
        max-width: 95%;
        max-height: 85%;
        border-radius: 8px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    `;
    overlay.appendChild(img);

    // caption / index
    const caption = document.createElement('div');
    caption.textContent = `${current + 1} / ${imageArray.length}`;
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

    // left/right nav (simple)
    function prev() {
        current = (current - 1 + imageArray.length) % imageArray.length;
        img.src = imageArray[current];
        caption.textContent = `${current + 1} / ${imageArray.length}`;
    }
    function next() {
        current = (current + 1) % imageArray.length;
        img.src = imageArray[current];
        caption.textContent = `${current + 1} / ${imageArray.length}`;
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

    // close on overlay click or Escape
    overlay.addEventListener('click', () => overlay.remove());
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', onKey);
        } else if (e.key === 'ArrowLeft') prev();
        else if (e.key === 'ArrowRight') next();
    });

    // support swipe on touch devices (basic)
    let startX = null;
    overlay.addEventListener('touchstart', (ev) => { startX = ev.touches[0].clientX; });
    overlay.addEventListener('touchend', (ev) => {
        if (startX === null) return;
        const endX = ev.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) prev(); else next();
        }
        startX = null;
    });

    document.body.appendChild(overlay);
}

/* ---------------------------
   renderJournalTable: now renders thumbnails with touch/click to view
   --------------------------- */
function renderJournalTable(filteredTrades = trades) {
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
    
    
    filteredTrades.forEach((trade, index) => {
        let pnlClass, pnlStatus;
        if (trade.netPnl > 0) { pnlClass = 'profit'; pnlStatus = 'Profit'; }
        else if (trade.netPnl < 0) { pnlClass = 'loss'; pnlStatus = 'Loss'; }
        else { pnlClass = 'break-even'; pnlStatus = 'Break Even'; }

        const lessonsTruncated = trade.lessonsLearned && trade.lessonsLearned.length > 50
            ? trade.lessonsLearned.substring(0, 50) + '...'
            : (trade.lessonsLearned || '');

        const row = document.createElement('tr');

        // Build screenshot cell: thumbnails that open viewer on click/touch
        const screenshots = Array.isArray(trade.screenshot) ? trade.screenshot.filter(Boolean) : (trade.screenshot ? [trade.screenshot] : []);
        let screenshotCellHtml;
        if (screenshots.length === 0) {
            screenshotCellHtml = `<div class="image-upload" style="cursor: default;">
                                    <i class="fas fa-image"></i>
                                    <span>No</span>
                                 </div>`;
        } else {
            // build small thumbnails (limit to first 4 thumbnails in the cell)
            const thumbs = screenshots.slice(0, 4).map((src, i) =>
                `<img class="thumb" data-index="${i}" src="${src}" style="width:48px;height:32px;object-fit:cover;border-radius:4px;margin-right:6px;cursor:pointer;border:1px solid #334155;">`
            ).join('');
            const moreBadge = screenshots.length > 4 ? `<span style="margin-left:6px;color:#94a3b8;font-size:0.85rem">+${screenshots.length-4}</span>` : '';
            screenshotCellHtml = `<div class="thumb-container" style="display:flex;align-items:center;">${thumbs}${moreBadge}</div>`;
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

        // Delete button that updates localStorage and UI
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!confirm("Are you sure you want to delete this?")) return;
            deleteTradeById(trade.id);
            renderJournalTable();
            updateStatsSummary();
        });
        row.querySelector('.action-cell').appendChild(deleteBtn);

        // click / touch for editing (double click already does this in your original)
        // Add event listener to thumbnails to open viewer
        // After row is inserted into DOM we will attach thumbnail listeners:
        tableBody.appendChild(row);

        // attach thumbnail listeners (if any)
        const thumbContainer = row.querySelector('.thumb-container');
        if (thumbContainer && screenshots.length > 0) {
            // attach click and touchstart (mobile)
            thumbContainer.querySelectorAll('img.thumb').forEach(imgEl => {
                imgEl.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const idx = parseInt(imgEl.dataset.index, 10) || 0;
                    viewImages(screenshots, idx);
                });
                imgEl.addEventListener('touchstart', (ev) => {
                    ev.stopPropagation();
                    const idx = parseInt(imgEl.dataset.index, 10) || 0;
                    viewImages(screenshots, idx);
                });
            });

            // clicking the container (e.g. if user clicks the '+n' badge)
            thumbContainer.addEventListener('click', (ev) => {
                ev.stopPropagation();
                viewImages(screenshots, 0);
            });
        }
    });
    
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
   Modal open / edit (keeps original logic, but ensures screenshot stays an array)
   --------------------------- */
function openModal(mode, tradeId = null) {
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
            // standard single-value fields
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

            // multi-select helper
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

            // show existing image filenames in label (we cannot set files[] programmatically)
            const screenshots = Array.isArray(trade.screenshot) ? trade.screenshot : (trade.screenshot ? [trade.screenshot] : []);
            fileLabel.textContent = screenshots.length ? `Has ${screenshots.length} image(s)` : 'No file chosen';
        }
    }
    modal.style.display = 'flex';
}

/* ---------------------------
   Save trade (handles image file conversion + storage)
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

    const imageFiles = document.getElementById('image-upload').files;
    // convert to base64 (if files chosen)
    const base64images = await filesToBase64(imageFiles); // if none, returns []

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
        // screenshot will be an array of base64 strings
        screenshot: []
    };

    // If editing existing and user didn't upload new images, preserve existing images
    if (existingIndex >= 0) {
        const existing = trades[existingIndex];
        // preserve prior screenshots if user did not add new ones
        tradeData.screenshot = (base64images.length > 0) ? base64images : (Array.isArray(existing.screenshot) ? existing.screenshot : (existing.screenshot ? [existing.screenshot] : []));
    } else {
        tradeData.screenshot = base64images; // can be empty array
    }

    // convert arrays to strings for display fields (if needed). You already store arrays for multi-selects; keep them as arrays for clarity
    // but if you prefer string join: e.g. tradeData.confluences = tradeData.confluences.join(', ');

    if (existingIndex >= 0) trades[existingIndex] = tradeData;
    else trades.push(tradeData);

    localStorage.setItem('tradingJournalTrades', JSON.stringify(trades));
    sortTradesByDateAndReassignIds("desc"); // newest → oldest   
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
function exportData() {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `trading-journal-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    alert(`Exported ${trades.length} trades to JSON file.`);
}

function clearAllTrades() {
    if (confirm('Are you sure you want to delete ALL trades? This action cannot be undone.')) {
        localStorage.clear();
        trades = [];
        localStorage.removeItem('tradingJournalTrades');
        renderJournalTable();
        updateStatsSummary();
        alert('All trades have been cleared.');
    }
}

/* ---------------------------
   Initialize DOM event listeners
   --------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    loadOptionsFromLocalStorage();
    
    // Optional: Enhance multiple selects with visual tags
    enhanceMultipleSelects();
    
    // Also refresh options when modal is opened (in case they were updated)
    const modal = document.getElementById('trade-modal');
    const addTradeBtn = document.getElementById('add-trade-btn');
    
    if (addTradeBtn) {
        addTradeBtn.addEventListener('click', () => {           
            setTimeout(loadOptionsFromLocalStorage, 10);
            openModal('add');
        });
    }
    
    // Also refresh when clicking on the modal (if it's opened by other means)
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

    // double-click to edit rows (already existed in your original; keep)
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