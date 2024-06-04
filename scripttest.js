// script.js
import themes from './themes.js';

document.addEventListener("DOMContentLoaded", () => {
    fetch('motions.json')
        .then(response => response.json())
        .then(data => {
            window.motions = data;
            populateFilters(data);
            displayMotions(data);
        })
        .catch(error => console.error('Error fetching motions:', error));

    const filterButton = document.getElementById('filter-button');
    filterButton.addEventListener('click', filterMotions);
});

function populateFilters(motions) {
    const temaSelect = document.getElementById('tema');
    const limbaSelect = document.getElementById('limba');
    const nivelSelect = document.getElementById('nivel');
    const competitionSelect = document.getElementById('competition');

    const temas = new Set();
    const limbas = new Set();
    const nivels = new Set();
    const competitions = new Set();

    motions.forEach(motion => {
        ['TEMA 1', 'TEMA 2', 'TEMA 3', 'Tema 1', 'Tema 2', 'Tema 3'].forEach(temaKey => {
            const tema = motion[temaKey];
            if (tema && themes[tema]) {
                temas.add(themes[tema].representativeTheme);
            }
        });
        if (motion.LIMBA) limbas.add(motion.LIMBA);
        if (motion.NIVEL) nivels.add(motion.NIVEL);
        if (motion['Nume Comp.']) competitions.add(motion['Nume Comp.']);
    });

    Array.from(temas).sort().forEach(tema => {
        const displayName = themes[tema] ? themes[tema].displayName : tema;
        temaSelect.add(new Option(displayName, tema));
    });
    Array.from(limbas).sort().forEach(limba => limbaSelect.add(new Option(limba, limba)));
    Array.from(nivels).sort().forEach(nivel => nivelSelect.add(new Option(nivel, nivel)));
    Array.from(competitions).sort().forEach(competition => competitionSelect.add(new Option(competition, competition)));
}

function displayMotions(motions) {
    const motionsContainer = document.getElementById('motions');
    motionsContainer.innerHTML = '';
    motions.forEach(motion => {
        const motionElement = document.createElement('div');
        motionElement.innerHTML = `${motion['AN']} - ${motion['Nume Comp.']}: ${motion['Moțiune']}`;
        motionsContainer.appendChild(motionElement);
    });
}

function filterMotions() {
    const tema = document.getElementById('tema').value;
    const limba = document.getElementById('limba').value;
    const nivel = document.getElementById('nivel').value;
    const competition = document.getElementById('competition').value;

    const filteredMotions = window.motions.filter(motion => {
        const temas = [
            themes[motion['TEMA 1']] ? themes[motion['TEMA 1']].representativeTheme : null,
            themes[motion['TEMA 2']] ? themes[motion['TEMA 2']].representativeTheme : null,
            themes[motion['TEMA 3']] ? themes[motion['TEMA 3']].representativeTheme : null,
            themes[motion['Tema 1']] ? themes[motion['Tema 1']].representativeTheme : null,
            themes[motion['Tema 2']] ? themes[motion['Tema 2']].representativeTheme : null,
            themes[motion['Tema 3']] ? themes[motion['Tema 3']].representativeTheme : null,
        ].filter(Boolean);

        return (tema === '' || temas.includes(tema)) &&
               (limba === '' || motion.LIMBA === limba) &&
               (nivel === '' || motion.NIVEL === nivel) &&
               (competition === '' || motion['Nume Comp.'] === competition);
    });

    displayMotions(filteredMotions);
}