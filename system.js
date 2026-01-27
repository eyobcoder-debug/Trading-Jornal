        // Load trades from localStorage
        let trades = JSON.parse(localStorage.getItem('tradingJournalTrades')) || [];
        
        // Store current filters
        let currentFilters = {
            model: '',
            symbol: ''
        };
        
        // Store column filters for each table (8-18)
        let columnFilters = {};
        
        // Initialize the application when the DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Set up table selection
            const tableSelect = document.getElementById('table-select');
            tableSelect.addEventListener('change', function() {
                showTable(this.value);
            });
            
            // Set up refresh button
            document.getElementById('refresh-analytics').addEventListener('click', function() {
                trades = JSON.parse(localStorage.getItem('tradingJournalTrades')) || [];
                updateAllTables();
                updateOverallStats();
                populateFilterOptions();
                alert('Analytics refreshed with latest data!');
            });
            
            // Set up global filter buttons
            document.getElementById('apply-global-filters').addEventListener('click', applyGlobalFilters);
            document.getElementById('clear-global-filters').addEventListener('click', clearGlobalFilters);
            
            // Set up column filter change events for tables 8-18
            for (let i = 8; i <= 18; i++) {
                const modelFilter = document.getElementById(`table${i}-model-filter`);
                const symbolFilter = document.getElementById(`table${i}-symbol-filter`);
                
                if (modelFilter) {
                    modelFilter.addEventListener('change', function() {
                        updateTableWithColumnFilters(i);
                    });
                }
                
                if (symbolFilter) {
                    symbolFilter.addEventListener('change', function() {
                        updateTableWithColumnFilters(i);
                    });
                }
            }
            
            // Initialize on page load
            updateAllTables();
            updateOverallStats();
            populateFilterOptions();
            
            // Show first table by default
            showTable('1');
        });
        
        // Function to show selected table
        function showTable(tableNumber) {
            // Hide all tables
            for (let i = 1; i <= 18; i++) {
                const tableElement = document.getElementById(`table-${i}`);
                if (tableElement) {
                    tableElement.classList.remove('active');
                }
            }
            
            // Show selected table
            const selectedTable = document.getElementById(`table-${tableNumber}`);
            if (selectedTable) {
                selectedTable.classList.add('active');
                
                // Scroll to the table
                selectedTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Show/hide global filters for tables 8-18
            const globalFilters = document.getElementById('global-filters');
            if (parseInt(tableNumber) >= 8 && parseInt(tableNumber) <= 18) {
                globalFilters.style.display = 'flex';
            } else {
                globalFilters.style.display = 'none';
            }
        }
        
        // Function to update overall statistics
        function updateOverallStats() {
            const totalTrades = trades.length;
            const profitTrades = trades.filter(t => t.netPnl > 0).length;
            const overallWinRate = totalTrades > 0 ? Math.round((profitTrades / totalTrades) * 100) : 0;
            
            // Find best performing model
            const models = {};
            trades.forEach(trade => {
                if (!models[trade.model]) {
                    models[trade.model] = { wins: 0, total: 0 };
                }
                models[trade.model].total++;
                if (trade.netPnl > 0) {
                    models[trade.model].wins++;
                }
            });
            
            let bestModel = '-';
            let bestModelRate = 0;
            
            Object.keys(models).forEach(model => {
                const winRate = Math.round((models[model].wins / models[model].total) * 100);
                if (winRate > bestModelRate) {
                    bestModel = model;
                    bestModelRate = winRate;
                }
            });
            
            // Find most traded symbol
            const symbols = {};
            trades.forEach(trade => {
                symbols[trade.symbol] = (symbols[trade.symbol] || 0) + 1;
            });
            
            let topSymbol = '-';
            let topSymbolCount = 0;
            
            Object.keys(symbols).forEach(symbol => {
                if (symbols[symbol] > topSymbolCount) {
                    topSymbol = symbol;
                    topSymbolCount = symbols[symbol];
                }
            });
            
            // Update DOM
            document.getElementById('total-trades').textContent = totalTrades;
            document.getElementById('overall-win-rate').textContent = `${overallWinRate}%`;
            document.getElementById('best-model').textContent = bestModel;
            document.getElementById('best-model-rate').textContent = `${bestModelRate}% Win Rate`;
            document.getElementById('top-symbol').textContent = topSymbol;
            document.getElementById('top-symbol-count').textContent = `${topSymbolCount} trades`;
        }
        
        // Function to populate filter options
        function populateFilterOptions() {
            // Get unique models and symbols
            const models = [...new Set(trades.map(trade => trade.model))].filter(Boolean);
            const symbols = [...new Set(trades.map(trade => trade.symbol))].filter(Boolean);
            
            // Populate global filters
            const globalModelFilter = document.getElementById('global-model-filter');
            const globalSymbolFilter = document.getElementById('global-symbol-filter');
            
            populateSelectOptions(globalModelFilter, models);
            populateSelectOptions(globalSymbolFilter, symbols);
            
            // Populate column filters for tables 8-18
            for (let i = 8; i <= 18; i++) {
                const modelFilter = document.getElementById(`table${i}-model-filter`);
                const symbolFilter = document.getElementById(`table${i}-symbol-filter`);
                
                if (modelFilter) {
                    populateSelectOptions(modelFilter, models);
                }
                
                if (symbolFilter) {
                    populateSelectOptions(symbolFilter, symbols);
                }
            }
        }
        
        // Helper function to populate select options
        function populateSelectOptions(selectElement, options) {
            // Clear existing options except the first one
            while (selectElement.options.length > 1) {
                selectElement.remove(1);
            }
            
            // Add new options
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            });
        }
        
        // Function to apply global filters
        function applyGlobalFilters() {
            const modelFilter = document.getElementById('global-model-filter').value;
            const symbolFilter = document.getElementById('global-symbol-filter').value;
            
            currentFilters.model = modelFilter;
            currentFilters.symbol = symbolFilter;
            
            // Update all tables with filters
            updateAllTables();
        }
        
        // Function to clear global filters
        function clearGlobalFilters() {
            document.getElementById('global-model-filter').value = '';
            document.getElementById('global-symbol-filter').value = '';
            
            currentFilters.model = '';
            currentFilters.symbol = '';
            
            // Clear column filters for tables 8-18
            for (let i = 8; i <= 18; i++) {
                const modelFilter = document.getElementById(`table${i}-model-filter`);
                const symbolFilter = document.getElementById(`table${i}-symbol-filter`);
                
                if (modelFilter) modelFilter.value = '';
                if (symbolFilter) symbolFilter.value = '';
            }
            
            // Reset column filters
            columnFilters = {};
            
            // Update all tables without filters
            updateAllTables();
        }
        
        // Function to update all tables
        function updateAllTables() {
            updateTable1(); // Accounts
            updateTable2(); // Symbols
            updateTable3(); // Models
            updateTable4(); // News Impact
            updateTable5(); // Narrative
            updateTable6(); // Bias
            updateTable7(); // Market Conditions
            updateTable8(); // Type of Trade
            updateTable9(); // Session
            updateTable10(); // Entry Time Frame
            updateTable11(); // Confluences
            updateTable12(); // Entry Signals
            updateTable13(); // Order Type
            updateTable14(); // By Day
            updateTable15(); // SL Management
            updateTable16(); // TP Management
            updateTable17(); // Mistakes
            updateTable18(); // Psychology
        }
        
        // Function to get filtered trades based on current filters
        function getFilteredTrades(additionalFilters = {}) {
            let filteredTrades = trades;
            
            // Apply global filters
            if (currentFilters.model) {
                filteredTrades = filteredTrades.filter(trade => trade.model === currentFilters.model);
            }
            
            if (currentFilters.symbol) {
                filteredTrades = filteredTrades.filter(trade => trade.symbol === currentFilters.symbol);
            }
            
            // Apply additional filters
            if (additionalFilters.model) {
                filteredTrades = filteredTrades.filter(trade => trade.model === additionalFilters.model);
            }
            
            if (additionalFilters.symbol) {
                filteredTrades = filteredTrades.filter(trade => trade.symbol === additionalFilters.symbol);
            }
            
            return filteredTrades;
        }
        
        // Function to update table with column filters
        function updateTableWithColumnFilters(tableNumber) {
            const modelFilter = document.getElementById(`table${tableNumber}-model-filter`).value;
            const symbolFilter = document.getElementById(`table${tableNumber}-symbol-filter`).value;
            
            // Store column filters
            columnFilters[tableNumber] = {
                model: modelFilter,
                symbol: symbolFilter
            };
            
            // Update the specific table
            switch(tableNumber) {
                case 8: updateTable8(); break;
                case 9: updateTable9(); break;
                case 10: updateTable10(); break;
                case 11: updateTable11(); break;
                case 12: updateTable12(); break;
                case 13: updateTable13(); break;
                case 14: updateTable14(); break;
                case 15: updateTable15(); break;
                case 16: updateTable16(); break;
                case 17: updateTable17(); break;
                case 18: updateTable18(); break;
            }
        }
        
        // Table 1: Accounts Performance
        function updateTable1() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('accounts-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const accounts = calculateAnalytics('account', filteredTrades);
            
            tableBody.innerHTML = accounts.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td class="win-rate">${item.winRate}%</td>
                    <td>${item.count}</td>
                </tr>
            `).join('');
        }
        
        // Table 2: Symbols Performance
        function updateTable2() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('symbols-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const symbols = calculateAnalytics('symbol', filteredTrades);
            
            tableBody.innerHTML = symbols.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 3: Trading Models
        function updateTable3() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('models-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const models = calculateAnalytics('model', filteredTrades);
            
            tableBody.innerHTML = models.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 4: News Impact Analysis
        function updateTable4() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('news-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const newsImpact = calculateAnalytics('newsImpact', filteredTrades);
                                    
					tableBody.innerHTML = newsImpact.flatMap(item =>
					  item.name.map(value => `
					    <tr>
					      <td>${value}</td>
					      <td>${item.count}</td>
					      <td>
					        <div class="outcomes-cell">
					          <span class="outcome-badge outcome-profit">${item.wins}W</span>
					          <span class="outcome-badge outcome-loss">${item.losses}L</span>
					          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
					        </div>
					      </td>
					      <td class="win-rate">${item.winRate}%</td>
					    </tr>
					  `)
					).join('');
        }
        
        // Table 5: Narrative Analysis
        function updateTable5() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('narrative-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const narrative = calculateAnalytics('narrative', filteredTrades);
            
            tableBody.innerHTML = narrative.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 6: Bias Analysis
        function updateTable6() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('bias-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const bias = calculateAnalytics('bias', filteredTrades);
            
            tableBody.innerHTML = bias.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 7: Market Conditions
        function updateTable7() {
            const filteredTrades = getFilteredTrades();
            const tableBody = document.getElementById('market-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const marketConditions = calculateAnalytics('marketConditions', filteredTrades);
            
            tableBody.innerHTML = marketConditions.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 8: Type of Trade Analysis
        function updateTable8() {
            const filteredTrades = getFilteredTrades(columnFilters[8]);
            const tableBody = document.getElementById('tradetype-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const tradeTypeData = calculateCombinedAnalytics('tradeType', filteredTrades);
            
            tableBody.innerHTML = tradeTypeData.map(item => `
                <tr>
                    <td>${item.category}</td>
                    <td>${item.model}</td>
                    <td>${item.symbol}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 9: Session Analysis
        function updateTable9() {
            const filteredTrades = getFilteredTrades(columnFilters[9]);
            const tableBody = document.getElementById('session-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const sessionData = calculateCombinedAnalytics('session', filteredTrades);
            
            tableBody.innerHTML = sessionData.map(item => `
                <tr>
                    <td>${item.category}</td>
                    <td>${item.model}</td>
                    <td>${item.symbol}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 10: Entry Time Frame Analysis
        function updateTable10() {
            const filteredTrades = getFilteredTrades(columnFilters[10]);
            const tableBody = document.getElementById('timeframe-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const timeframeData = calculateCombinedAnalytics('entryTimeframe', filteredTrades);
            
            tableBody.innerHTML = timeframeData.map(item => `
                <tr>
                    <td>${item.category}</td>
                    <td>${item.model}</td>
                    <td>${item.symbol}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 11: Confluences Analysis
        function updateTable11() {
            const filteredTrades = getFilteredTrades(columnFilters[11]);
            const tableBody = document.getElementById('confluences-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const confluencesData = calculateCombinedAnalytics('confluences', filteredTrades);
            console.log(JSON.stringify(confluencesData));
  						tableBody.innerHTML = confluencesData.flatMap(Bb =>
						  Bb.category.map(category => `
						    <tr>
						      <td>${category}</td>
						      <td>${Bb.model}</td>
						      <td>${Bb.symbol}</td>
						      <td>${Bb.count}</td>
						      <td>
						        <div class="outcomes-cell">
						          <span class="outcome-badge outcome-profit">${Bb.wins}W</span>
						          <span class="outcome-badge outcome-loss">${Bb.losses}L</span>
						          <span class="outcome-badge outcome-break-even">${Bb.breakEvens}BE</span>
						        </div>
						      </td>
						      <td class="win-rate">${Bb.winRate}%</td>
						    </tr>
						  `)
						).join('');
        }
        
        // Table 12: Entry Signals Analysis
        function updateTable12() {
            const filteredTrades = getFilteredTrades(columnFilters[12]);
            const tableBody = document.getElementById('entrysignals-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const entrySignalsData = calculateCombinedAnalytics('entrySignals', filteredTrades);
           
        		tableBody.innerHTML = entrySignalsData.flatMap(item =>
						  item.category.map(cat => `
						    <tr>
						      <td>${cat.trim()}</td>
						      <td>${item.model}</td>
						      <td>${item.symbol}</td>
						      <td>${item.count}</td>
						      <td>
						        <div class="outcomes-cell">
						          <span class="outcome-badge outcome-profit">${item.wins}W</span>
						          <span class="outcome-badge outcome-loss">${item.losses}L</span>
						          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
						        </div>
						      </td>
						      <td class="win-rate">${item.winRate}%</td>
						    </tr>
						  `)
						).join('');
        }
        
        // Table 13: Order Type Analysis
        function updateTable13() {
            const filteredTrades = getFilteredTrades(columnFilters[13]);
            const tableBody = document.getElementById('ordertype-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const orderTypeData = calculateCombinedAnalytics('orderType', filteredTrades);
            
            tableBody.innerHTML = orderTypeData.map(item => `
                <tr>
                    <td>${item.category}</td>
                    <td>${item.model}</td>
                    <td>${item.symbol}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 14: Performance By Day
        function updateTable14() {
            const filteredTrades = getFilteredTrades(columnFilters[14]);
            const tableBody = document.getElementById('byday-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const byDayData = calculateByDay(filteredTrades);
            
            tableBody.innerHTML = byDayData.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.topModel}</td>
                    <td>${item.topSymbol}</td>
                    <td>${item.count}</td>
                    <td>
                        <div class="outcomes-cell">
                            <span class="outcome-badge outcome-profit">${item.wins}W</span>
                            <span class="outcome-badge outcome-loss">${item.losses}L</span>
                            <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
                        </div>
                    </td>
                    <td class="win-rate">${item.winRate}%</td>
                </tr>
            `).join('');
        }
        
        // Table 15: SL Management Analysis
        function updateTable15() {
            const filteredTrades = getFilteredTrades(columnFilters[15]);
            const tableBody = document.getElementById('slmanagement-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const slManagementData = calculateCombinedAnalytics('slManagement', filteredTrades);
            
					tableBody.innerHTML = slManagementData.flatMap(item =>
					  item.category.map(cat => `
					    <tr>
					      <td>${cat.trim()}</td>
					      <td>${item.model}</td>
					      <td>${item.symbol}</td>
					      <td>${item.count}</td>
					      <td>
					        <div class="outcomes-cell">
					          <span class="outcome-badge outcome-profit">${item.wins}W</span>
					          <span class="outcome-badge outcome-loss">${item.losses}L</span>
					          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
					        </div>
					      </td>
					      <td class="win-rate">${item.winRate}%</td>
					    </tr>
					  `)
					).join('');
        }
        
        // Table 16: TP Management Analysis
        function updateTable16() {
            const filteredTrades = getFilteredTrades(columnFilters[16]);
            const tableBody = document.getElementById('tpmanagement-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const tpManagementData = calculateCombinedAnalytics('tpManagement', filteredTrades);
            
					tableBody.innerHTML = tpManagementData.flatMap(item =>
					  item.category.map(cat => `
					    <tr>
					      <td>${cat.trim()}</td>
					      <td>${item.model}</td>
					      <td>${item.symbol}</td>
					      <td>${item.count}</td>
					      <td>
					        <div class="outcomes-cell">
					          <span class="outcome-badge outcome-profit">${item.wins}W</span>
					          <span class="outcome-badge outcome-loss">${item.losses}L</span>
					          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
					        </div>
					      </td>
					      <td class="win-rate">${item.winRate}%</td>
					    </tr>
					  `)
					).join('');
        }
        
        // Table 17: Mistakes Analysis
        function updateTable17() {
            const filteredTrades = getFilteredTrades(columnFilters[17]);
            const tableBody = document.getElementById('mistakes-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const mistakesData = calculateCombinedAnalytics('mistakes', filteredTrades);
            
						tableBody.innerHTML = mistakesData.flatMap(item =>
						  item.category.map(cat => `
						    <tr>
						      <td>${cat.trim()}</td>
						      <td>${item.model}</td>
						      <td>${item.symbol}</td>
						      <td>${item.count}</td>
						      <td>
						        <div class="outcomes-cell">
						          <span class="outcome-badge outcome-profit">${item.wins}W</span>
						          <span class="outcome-badge outcome-loss">${item.losses}L</span>
						          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
						        </div>
						      </td>
						      <td class="win-rate">${item.winRate}%</td>
						    </tr>
						  `)
						).join('');
        }
        
        // Table 18: Psychology Analysis
        function updateTable18() {
            const filteredTrades = getFilteredTrades(columnFilters[18]);
            const tableBody = document.getElementById('psychology-table-body');
            
            if (filteredTrades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No trade data available for the selected filters</p>
                            <a href="journal-table.html" class="show-all-btn">
                                <i class="fas fa-plus"></i> Add Trades
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const psychologyData = calculateCombinedAnalytics('psychology', filteredTrades);
            
					tableBody.innerHTML = psychologyData.flatMap(item =>
					  item.category.map(cat => `
					    <tr>
					      <td>${cat.trim()}</td>
					      <td>${item.model}</td>
					      <td>${item.symbol}</td>
					      <td>${item.count}</td>
					      <td>
					        <div class="outcomes-cell">
					          <span class="outcome-badge outcome-profit">${item.wins}W</span>
					          <span class="outcome-badge outcome-loss">${item.losses}L</span>
					          <span class="outcome-badge outcome-break-even">${item.breakEvens}BE</span>
					        </div>
					      </td>
					      <td class="win-rate">${item.winRate}%</td>
					    </tr>
					  `)
					).join('');
        }
        
        // Function to calculate analytics for a given category
        function calculateAnalytics(category, tradesToAnalyze) {
            const categoryMap = {};
            
            tradesToAnalyze.forEach(trade => {
                const value = trade[category];
                if (!categoryMap[value]) {
                    categoryMap[value] = {
                        name: value,
                        count: 0,
                        wins: 0,
                        losses: 0,
                        breakEvens: 0
                    };
                }
                
                categoryMap[value].count++;
                
                if (trade.netPnl > 0) {
                    categoryMap[value].wins++;
                } else if (trade.netPnl < 0) {
                    categoryMap[value].losses++;
                } else {
                    categoryMap[value].breakEvens++;
                }
            });
            
            // Convert to array and calculate win rates
            return Object.values(categoryMap).map(item => {
                item.winRate = item.count > 0 ? 
                    Math.round((item.wins / item.count) * 100) : 0;
                return item;
            }).sort((a, b) => b.count - a.count);
        }
        
        // Function to calculate combined analytics (for tables 8-18)
        function calculateCombinedAnalytics(category, tradesToAnalyze) {
            // Group trades by the category, model, and symbol
            const groupedData = {};
            
            tradesToAnalyze.forEach(trade => {
                const key = `${trade[category]}|${trade.model}|${trade.symbol}`;
                if (!groupedData[key]) {
                    groupedData[key] = {
                        category: trade[category],
                        model: trade.model,
                        symbol: trade.symbol,
                        count: 0,
                        wins: 0,
                        losses: 0,
                        breakEvens: 0
                    };
                }
                
                groupedData[key].count++;
                
                if (trade.netPnl > 0) {
                    groupedData[key].wins++;
                } else if (trade.netPnl < 0) {
                    groupedData[key].losses++;
                } else {
                    groupedData[key].breakEvens++;
                }
            });
            
            // Convert to array and calculate win rates
            const result = Object.values(groupedData).map(item => {
                item.winRate = item.count > 0 ? 
                    Math.round((item.wins / item.count) * 100) : 0;
                return item;
            }).sort((a, b) => b.count - a.count);
            
            return result;
        }
        
        // Function to calculate analytics by day
        function calculateByDay(tradesToAnalyze) {
            const dayMap = {};
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            tradesToAnalyze.forEach(trade => {
                const date = new Date(trade.date);
                const dayName = daysOfWeek[date.getDay()];
                
                if (!dayMap[dayName]) {
                    dayMap[dayName] = {
                        name: dayName,
                        count: 0,
                        wins: 0,
                        losses: 0,
                        breakEvens: 0,
                        models: {},
                        symbols: {}
                    };
                }
                
                const dayData = dayMap[dayName];
                dayData.count++;
                
                // Track wins/losses
                if (trade.netPnl > 0) {
                    dayData.wins++;
                } else if (trade.netPnl < 0) {
                    dayData.losses++;
                } else {
                    dayData.breakEvens++;
                }
                
                // Track models
                if (!dayData.models[trade.model]) {
                    dayData.models[trade.model] = 0;
                }
                dayData.models[trade.model]++;
                
                // Track symbols
                if (!dayData.symbols[trade.symbol]) {
                    dayData.symbols[trade.symbol] = 0;
                }
                dayData.symbols[trade.symbol]++;
            });
            
            // Convert to array and calculate win rates
            return Object.values(dayMap).map(item => {
                item.winRate = item.count > 0 ? 
                    Math.round((item.wins / item.count) * 100) : 0;
                
                // Find top model for this day
                let topModel = 'None';
                let topModelCount = 0;
                for (const [model, count] of Object.entries(item.models)) {
                    if (count > topModelCount) {
                        topModelCount = count;
                        topModel = model;
                    }
                }
                item.topModel = topModel;
                
                // Find top symbol for this day
                let topSymbol = 'None';
                let topSymbolCount = 0;
                for (const [symbol, count] of Object.entries(item.symbols)) {
                    if (count > topSymbolCount) {
                        topSymbolCount = count;
                        topSymbol = symbol;
                    }
                }
                item.topSymbol = topSymbol;
                
                return item;
            }).sort((a, b) => daysOfWeek.indexOf(a.name) - daysOfWeek.indexOf(b.name));
        }