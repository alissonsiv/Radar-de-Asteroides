const asteroidContainer = document.getElementById('asteroids');
const hazardousCheckbox = document.getElementById('hazardous');

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
    const filteredAsteroids = hazardousCheckbox.checked
        ? asteroids.filter(a => a.is_potentially_hazardous_asteroid)
        : asteroids;

    filteredAsteroids.forEach(asteroid => {
        const asteroidDiv = document.createElement('div');
        asteroidDiv.classList.add('asteroid');
        asteroidDiv.innerHTML = `
            <h3>${asteroid.name}</h3>
            <p>ID: ${asteroid.id}</p>
            <p>Diâmetro: ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m</p>
            <p>Perigo: ${asteroid.is_potentially_hazardous_asteroid ? 'Sim' : 'Não'}</p>
            <p>Data de Aproximação: ${asteroid.close_approach_data[0]?.close_approach_date || 'N/A'}</p>
        `;
        asteroidContainer.appendChild(asteroidDiv);
    });
}

document.getElementById('refresh').addEventListener('click', fetchAsteroids);
hazardousCheckbox.addEventListener('change', fetchAsteroids);

fetchAsteroids();
