
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












const cryptos = [
    { name: 'Bitcoin', id: 'bitcoin' },
    { name: 'Ethereum', id: 'ethereum' },
    { name: 'Ripple', id: 'ripple' },
    { name: 'Litecoin', id: 'litecoin' },
    { name: 'Cardano', id: 'cardano' },
    { name: 'Dogecoin', id: 'dogecoin' },
    { name: 'Dogecoin', id: 'dogecoin' }
];

let currentIndex = 0;

const createChart = (ctx, cryptoName) => {
    const gradientBackground = (ctx, color) => {
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
        gradient.addColorStop(0, `rgba(${color}, 0.5)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        return gradient;
    };

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: gradientBackground(ctx, '75, 192, 192'),
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Price: $${context.raw.toFixed(2)}`;
                        }
                    },
                    backgroundColor: '#ffffff',
                    titleColor: '#000000',
                    bodyColor: '#000000',
                    borderColor: '#cccccc',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    position: 'top',
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        borderColor: '#ddd'
                    },
                    ticks: {
                        color: '#555',
                        callback: function (value) {
                            return `$${value}`;
                        }
                    }
                }
            }
        }
    });
};

const fetchCryptoData = async (cryptoId, chart) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=1`);
        const data = await response.json();
        const prices = data.prices.filter((_, index) => index % 10 === 0).map(price => price[1]);
        const timestamps = data.prices.filter((_, index) => index % 10 === 0).map(price => new Date(price[0]).toLocaleTimeString());

        chart.data.labels = timestamps;
        chart.data.datasets[0].data = prices;
        chart.update();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const updateCharts = () => {
    const cryptoWidgets = document.getElementById('crypto-widgets');
    cryptoWidgets.innerHTML = '';

    const nextCryptos = cryptos.slice(currentIndex, currentIndex + 3);
    nextCryptos.forEach(crypto => {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'flex-shrink-0 w-72'; // اندازه کارت‌ها

        const title = document.createElement('h3');
        title.className = 'text-center text-lg text-gray-700 mb-2';
        title.textContent = crypto.name;

        const canvas = document.createElement('canvas');

        chartContainer.appendChild(title);
        chartContainer.appendChild(canvas);
        cryptoWidgets.appendChild(chartContainer);

        const ctx = canvas.getContext('2d');
        const chart = createChart(ctx, crypto.name);

        fetchCryptoData(crypto.id, chart);
    });

    currentIndex = (currentIndex + 3) % cryptos.length;
};

updateCharts();