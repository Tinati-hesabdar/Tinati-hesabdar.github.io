
async function fetchCryptoPrices() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,ripple,litecoin,polkadot,chainlink,stellar,uniswap,vechain,solana,monero,tron,bitcoin-cash,dash,neo,ethereum-classic,zcash,ethereum-name-service,crypto-com-chain,bat,yearn-finance,elrond,ftx-token,dogecoin,aave,cosmos,avax,huobi-token,maker,compound,pancake-swap,shiba-inu,quant,flow&vs_currencies=usd');
    const data = await response.json();
    return data;
}


function updateTicker(data) {
    const ticker = document.getElementById('cryptoTicker');
    const tickerClone = document.getElementById('cryptoTickerClone');
    ticker.innerHTML = ''; // پاک کردن محتوا برای به‌روزرسانی
    tickerClone.innerHTML = ''; // پاک کردن محتوا برای به‌روزرسانی

    let content = '';

    for (const [key, value] of Object.entries(data)) {
        const price = value.usd;
        const cryptoName = key.charAt(0).toUpperCase() + key.slice(1); // نام کریپتوکارنسی را فرمت می‌کنیم
        content += `<span class="mx-4 crypto-item">${cryptoName}: $${price}</span>`;
    }

    ticker.innerHTML = content;
    tickerClone.innerHTML = content; // کپی کردن محتوا برای نوار دوم
}

async function initTicker() {
    const data = await fetchCryptoPrices();
    updateTicker(data);

    // به‌روزرسانی قیمت‌ها هر 60 ثانیه
    setInterval(async () => {
        const newData = await fetchCryptoPrices();
        updateTicker(newData);
    }, 60000); // زمان به 60 ثانیه تغییر یافت
}

// شروع
initTicker();







    document.addEventListener('DOMContentLoaded', async function () {
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
        const vs_currency = 'usd';  
        const coins = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'polkadot', 'uniswap', 'chainlink', 'litecoin'];
        const dollarRate = 50000; // نرخ تتر به تومان

        const response = await fetch(`${apiUrl}?vs_currency=${vs_currency}&ids=${coins.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=true`);
        const data = await response.json();

        const tableBody = document.getElementById('crypto-table');

        data.forEach(coin => {
            const priceInToman = (coin.current_price * dollarRate).toLocaleString('fa-IR');
            const priceInDollar = coin.current_price.toLocaleString('en-US');
            let change24h = coin.price_change_percentage_24h.toFixed(2);

            const changeText = change24h < 0 ? `${change24h.replace('-', '')}%−` : `${change24h}%`;
            const changeClass = coin.price_change_percentage_24h >= 0 ? 'text-green-600 crypto-change' : 'text-red-600 crypto-change';
            const chartColor = coin.price_change_percentage_24h >= 0 ? '#4caf50' : '#f44336';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-4 px-4 text-center">
                    <div class="crypto-item">
                        <img src="${coin.image}" alt="${coin.name}" class="crypto-icon">
                        <span class="crypto-name">${coin.name}</span>
                    </div>
                </td>
                <td class="py-4 px-4 text-center">${priceInToman} تومان</td>
                <td class="py-4 px-4 text-center">${priceInDollar} دلار</td>
                <td class="py-4 px-4 text-center ${changeClass} rtl">
                    ${changeText}
                </td>
                <td class="py-4 px-4">
                    <div class="bg-white p-2 shadow rounded-lg">
                        <canvas id="${coin.id}-chart" width="100" height="180"></canvas>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);

            const ctx = document.getElementById(`${coin.id}-chart`).getContext('2d');

            const filteredPrices = coin.sparkline_in_7d.price.filter(price => price !== undefined && !isNaN(price));
            const labels = filteredPrices.map((_, index) => index);

            const lastPrice = filteredPrices[filteredPrices.length - 1].toFixed(2);

            const gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, `${chartColor}88`);
            gradient.addColorStop(1, `${chartColor}00`);

            function significantChanges(prices) {
                const significantPoints = [];
                for (let i = 1; i < prices.length; i++) {
                    const change = Math.abs(prices[i] - prices[i - 1]);
                    const changePercentage = (change / prices[i - 1]) * 100;
                    if (changePercentage > 5) { // تغییر بیشتر از 5 درصد
                        significantPoints.push(i);
                    }
                }
                return significantPoints;
            }

            const importantPoints = significantChanges(filteredPrices);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'قیمت هفتگی',
                        data: filteredPrices,
                        borderColor: chartColor,
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: gradient,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: importantPoints.map(index => labels[index]).includes(labels) ? '#fff' : 'transparent', 
                        pointBorderColor: importantPoints.map(index => labels[index]).includes(labels) ? chartColor : 'transparent',
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: chartColor,
                        pointHoverBorderColor: '#fff',
                        pointStyle: 'circle',
                        hoverBorderWidth: 3
                    }, 
                    {
                        label: 'آخرین قیمت',
                        data: Array(filteredPrices.length - 1).fill(null).concat([lastPrice]),
                        borderColor: chartColor,
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 6,
                        pointBackgroundColor: chartColor,
                        pointBorderColor: '#fff',
                        pointStyle: 'circle',
                        showLine: false 
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    animations: {
                        tension: {
                            duration: 1000,
                            easing: 'easeOutBounce',
                            from: 1,
                            to: 0.5,
                            loop: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#333',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 12 },
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `قیمت: ${context.parsed.y}`;
                                },
                                title: function() {
                                    return importantPoints.includes(context.dataIndex) ? 'نقطه مهم' : '';
                                }
                            },
                            filter: function(tooltipItem) {
                                return importantPoints.includes(tooltipItem.dataIndex);
                            }
                        },
                        annotation: {
                            annotations: {
                                lastPriceLabel: {
                                    type: 'label',
                                    xValue: labels.length - 1,
                                    yValue: lastPrice,
                                    backgroundColor: chartColor,
                                    content: `قیمت: ${lastPrice}`,
                                    enabled: true,
                                    color: '#fff',
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    },
                                    position: 'end'
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            beginAtZero: false,
                            suggestedMin: Math.min(...filteredPrices) * 0.95,
                            suggestedMax: Math.max(...filteredPrices) * 1.05,
                            ticks: {
                                display: true,
                                color: '#888',
                                font: {
                                    size: 12
                                },
                                padding: 5
                            },
                            grid: {
                                display: true,
                                color: '#eee',
                                drawBorder: false,
                                lineWidth: 1
                            }
                        }
                    },
                    elements: {
                        line: {
                            borderCapStyle: 'round',
                            borderJoinStyle: 'round',
                            shadowColor: '#000',
                            shadowBlur: 5
                        },
                        point: {
                            shadowColor: '#000',
                            shadowBlur: 5
                        }
                    }
                }
            });
        });
    });
