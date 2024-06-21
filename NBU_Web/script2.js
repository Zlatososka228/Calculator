document.addEventListener('DOMContentLoaded', function () {
    const currencyTable = document.getElementById('currency-table');
    const currencySelect = document.getElementById('currency-select');
    const uahAmountInput = document.getElementById('uah-amount');
    const convertBtn = document.getElementById('convert-btn');
    const conversionResult = document.getElementById('conversion-result');

    let currencyRates = {};

    function fetchCurrencyRates() {
        fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
            .then(response => response.json())
            .then(data => {
                updateCurrencyTable(data);
                populateCurrencySelect(data);
                currencyRates = data.reduce((acc, item) => {
                    acc[item.cc] = item.rate;
                    return acc;
                }, {});
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateCurrencyTable(data) {
        // Clear the table except the header
        currencyTable.innerHTML = `
            <div class="currency-row header">
                <div class="currency">Валюта</div>
                <div class="rate">Курс</div>
            </div>
        `;

        data.forEach(item => {
            const row = document.createElement('div');
            row.classList.add('currency-row');

            const currency = document.createElement('div');
            currency.classList.add('currency');
            currency.textContent = item.cc;

            const rate = document.createElement('div');
            rate.classList.add('rate');
            rate.textContent = item.rate.toFixed(2);

            row.appendChild(currency);
            row.appendChild(rate);

            currencyTable.appendChild(row);
        });
    }

    function populateCurrencySelect(data) {
        currencySelect.innerHTML = ''; // Clear previous options

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.cc;
            option.textContent = item.cc;
            currencySelect.appendChild(option);
        });
    }

    function convertCurrency() {
        const uahAmount = parseFloat(uahAmountInput.value);
        const selectedCurrency = currencySelect.value;

        if (isNaN(uahAmount) || !selectedCurrency) {
            conversionResult.textContent = 'Будь ласка, введіть коректну кількість та виберіть валюту.';
            return;
        }

        const rate = currencyRates[selectedCurrency];
        const convertedAmount = uahAmount / rate;

        conversionResult.textContent = `${uahAmount} UAH = ${convertedAmount.toFixed(2)} ${selectedCurrency}`;
    }

    convertBtn.addEventListener('click', convertCurrency);

    fetchCurrencyRates();
    setInterval(fetchCurrencyRates, 60000); // Refresh every minute
});
