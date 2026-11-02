// Seleção de elementos do DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const suggestionsList = document.getElementById('suggestions-list');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const errorMessage = document.getElementById('error-message');
const feelsLike = document.getElementById('feels-like');
const tempMax = document.getElementById('temp-max');
const tempMin = document.getElementById('temp-min');
const weatherIcon = document.getElementById('weather-icon');

// Chave da API exposta
const apiKey = '8cf9b1859e6f03351b3a283267cde5c1';

// Variável para controlar o tempo de espera (debounce) nas requisições de autocomplete
let debounceTimer;

// Evento de clique no botão de busca
searchBtn.addEventListener('click', () => {
    handleSearch();
});

// Evento de tecla Enter
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        suggestionsList.classList.add('hidden');
        handleSearch();
    }
});

// Identifica o que o usuário está digitando para decidir entre Autocomplete ou CEP
cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    
    clearTimeout(debounceTimer);

    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    // Aguarda 300ms após o usuário parar de digitar para não sobrecarregar a API
    debounceTimer = setTimeout(() => {
        // Se parecer um CEP (apenas números), não busca sugestões de cidades
        if (!/^\d+$/.test(query)) {
            fetchCitySuggestions(query);
        }
    }, 300);
});

// Função principal que direciona para CEP ou Nome de Cidade
// Identifica o que o usuário está digitando para gerenciar o Autocomplete e a limpeza do cartão
cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    
    clearTimeout(debounceTimer);

    // Se o usuário apagar todo o texto do input, o cartão de clima some na hora!
    if (query === '') {
        weatherCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        suggestionsList.classList.add('hidden');
        return;
    }

    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    // Aguarda 300ms após o usuário parar de digitar para chamar o autocomplete
    debounceTimer = setTimeout(() => {
        // Se for CEP (apenas números), não busca sugestões de cidades
        if (!/^\d+$/.test(query)) {
            fetchCitySuggestions(query);
        }
    }, 300);
});

// Evento de clique no botão de busca
searchBtn.addEventListener('click', () => {
    handleSearch();
});

// Evento de tecla Enter
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        suggestionsList.classList.add('hidden');
        handleSearch();
    }
});

// Função principal que direciona para CEP ou Nome de Cidade
// Identifica o que o usuário está digitando para gerenciar o Autocomplete e a limpeza do cartão
cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    
    clearTimeout(debounceTimer);

    // Se o usuário apagar todo o texto do input, o cartão de clima some na hora!
    if (query === '') {
        weatherCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        suggestionsList.classList.add('hidden');
        return;
    }

    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    // Aguarda 300ms após o usuário parar de digitar para chamar o autocomplete
    debounceTimer = setTimeout(() => {
        // Se for CEP (apenas números), não busca sugestões de cidades
        if (!/^\d+$/.test(query)) {
            fetchCitySuggestions(query);
        }
    }, 300);
});

// Evento de clique no botão de busca
searchBtn.addEventListener('click', () => {
    handleSearch();
});

// Evento de tecla Enter
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        suggestionsList.classList.add('hidden');
        handleSearch();
    }
});

// Função principal que direciona para CEP ou Nome de Cidade
// Identifica o que o usuário está digitando para gerenciar o Autocomplete e a limpeza do cartão
cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    
    clearTimeout(debounceTimer);

    // Se o usuário apagar todo o texto do input, o cartão de clima some na hora!
    if (query === '') {
        weatherCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        suggestionsList.classList.add('hidden');
        return;
    }

    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    // Aguarda 300ms após o usuário parar de digitar para chamar o autocomplete
    debounceTimer = setTimeout(() => {
        // Se for CEP (apenas números), não busca sugestões de cidades
        if (!/^\d+$/.test(query)) {
            fetchCitySuggestions(query);
        }
    }, 300);
});

// Evento de clique no botão de busca
searchBtn.addEventListener('click', () => {
    handleSearch();
});

// Evento de tecla Enter
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        suggestionsList.classList.add('hidden');
        handleSearch();
    }
});

// Função principal que direciona para CEP ou Nome de Cidade
function handleSearch() {
    const query = cityInput.value.trim();
    if (query === '') return;

    suggestionsList.classList.add('hidden');

    // Esconde o cartão anterior ao iniciar uma nova busca
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const cleanQuery = query.replace(/\D/g, '');

    if (cleanQuery.length === 8) {
        getWeatherByCep(cleanQuery);
    } else {
        getWeatherData(query);
    }
}

// 1. BUSCA POR CEP (Usando BrasilAPI + OpenWeatherMap por coordenadas)
async function getWeatherByCep(cep) {
    try {
        // BrasilAPI busca os dados baseados no CEP
        const cepResponse = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        if (!cepResponse.ok) throw new Error('CEP não encontrado');
        
        const cepData = await cepResponse.json();
        
        // Corrigido: A BrasilAPI retorna 'latitude' e 'longitude' por extenso
        const lat = cepData.location?.coordinates?.latitude;
        const lon = cepData.location?.coordinates?.longitude;

        if (!lat || !lon) {
            throw new Error('Coordenadas não disponíveis para este CEP');
        }

        // Com as coordenadas corretas, buscamos o clima no OpenWeatherMap
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error('Erro ao buscar clima');

        const data = await weatherResponse.json();
        displayWeather(data);

    } catch (error) {
        showError();
    }
}

// 2. BUSCA POR NOME DE CIDADE
async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Cidade não encontrada');

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError();
    }
}

// 3. AUTOCOMPLETAR (Sugestões de cidades enquanto digita)
async function fetchCitySuggestions(query) {
    // API de Geocodificação Direct do OpenWeatherMap retorna até 5 cidades compatíveis
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return;

        const cities = await response.json();
        showSuggestions(cities);
    } catch (error) {
        console.error('Erro ao buscar sugestões', error);
    }
}

// Exibe a lista suspensa na tela
function showSuggestions(cities) {
    suggestionsList.innerHTML = '';

    if (cities.length === 0) {
        suggestionsList.classList.add('hidden');
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        // Mostra o nome, estado/província e país (ex: São Paulo, SP, BR)
        const stateStr = city.state ? `, ${city.state}` : '';
        li.textContent = `${city.name}${stateStr}, ${city.country}`;

        // Quando o usuário clica em uma sugestão da lista
        li.addEventListener('click', () => {
            cityInput.value = `${city.name}, ${city.country}`;
            suggestionsList.classList.add('hidden');
            getWeatherData(city.name);
        });

        suggestionsList.appendChild(li);
    });

    suggestionsList.classList.remove('hidden');
}

// Preenche o HTML com os dados do clima
function displayWeather(data) {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Correção: Inserir o iconCode diretamente dentro da template string (${iconCode})
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.classList.remove('hidden'); // Mostra a imagem do ícone

    temp.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    
    feelsLike.textContent = Math.round(data.main.feels_like);
    tempMax.textContent = Math.round(data.main.temp_max);
    tempMin.textContent = Math.round(data.main.temp_min);

    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;
}

// Exibe mensagem de erro
function showError() {
    weatherCard.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}


// Seleciona o botão de tema
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Verifica se o usuário já havia escolhido o tema escuro anteriormente
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
}

// Evento de clique para alternar o modo noturno/claro
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});