const asteroidContainer = document.getElementById('asteroids');
const hazardousCheckbox = document.getElementById('hazardous');
const dateFilter = document.getElementById('date');
const searchNameInput = document.getElementById('searchName');
const asteroidCount = document.getElementById('asteroidCount');

async function fetchAsteroids() {
    asteroidContainer.innerHTML = '<p class="loading">Carregando...</p>';

    try {
        const response = await fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=HOglfPRfQAeaqN8RDrabkMn49w2wehuU1dvh8aoo');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        
        const { near_earth_objects } = await response.json();
        displayAsteroids(near_earth_objects);
    } catch (error) {
        asteroidContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

function displayAsteroids(asteroids) {
    asteroidContainer.innerHTML = '';
    const filteredAsteroids = filterAsteroids(asteroids);

    if (filteredAsteroids.length === 0) {
        asteroidContainer.innerHTML = '<p>Nenhum asteroide encontrado com os critérios selecionados.</p>';
    }

    filteredAsteroids.forEach(asteroid => {
        const asteroidDiv = document.createElement('div');
        asteroidDiv.classList.add('asteroid');
        if (asteroid.is_potentially_hazardous_asteroid) {
            asteroidDiv.classList.add('dangerous');
        }
        asteroidDiv.innerHTML = `
            <h3>${asteroid.name}</h3>
            <p>ID: ${asteroid.id}</p>
            <p>Diâmetro: ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m</p>
            <p>Velocidade Relativa: ${parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 0).toFixed(2)} km/h</p>
            <p>Perigo: ${asteroid.is_potentially_hazardous_asteroid ? 'Sim' : 'Não'}</p>
            <p>Data de Aproximação: ${asteroid.close_approach_data[0]?.close_approach_date || 'N/A'}</p>
        `;
        asteroidContainer.appendChild(asteroidDiv);
    });

    asteroidCount.textContent = `Total de asteroides exibidos: ${filteredAsteroids.length}`;
}

function filterAsteroids(asteroids) {
    const showHazardous = hazardousCheckbox.checked;
    const filterDate = dateFilter.value;
    const searchName = searchNameInput.value.toLowerCase();

    return asteroids.filter(asteroid => {
        const isHazardous = !showHazardous || asteroid.is_potentially_hazardous_asteroid;
        const matchesDate = !filterDate || asteroid.close_approach_data.some(data => data.close_approach_date === filterDate);
        const matchesName = !searchName || asteroid.name.toLowerCase().includes(searchName);

        return isHazardous && matchesDate && matchesName;
    });
}

document.getElementById('refresh').addEventListener('click', fetchAsteroids);
hazardousCheckbox.addEventListener('change', fetchAsteroids);
dateFilter.addEventListener('change', fetchAsteroids);
searchNameInput.addEventListener('input', fetchAsteroids);

fetchAsteroids();
