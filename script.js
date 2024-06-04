import themes from './themes.js';
import competitions from './competitions.js';

document.getElementById('disable-tema').addEventListener('change', updateFilters);
document.getElementById('tema').addEventListener('change', updateFilters);

document.getElementById('disable-limba').addEventListener('change', updateFilters);
document.getElementById('limba').addEventListener('change', updateFilters);

document.getElementById('disable-nivel').addEventListener('change', updateFilters);
document.getElementById('nivel').addEventListener('change', updateFilters);

document.getElementById('disable-competition').addEventListener('change', updateFilters);
document.getElementById('competition').addEventListener('change', updateFilters);

document.getElementById('disable-p/i').addEventListener('change', updateFilters);
document.getElementById('p/i').addEventListener('change', updateFilters);

document.getElementById('disable-tipologie').addEventListener('change', updateFilters);
document.getElementById('tipologie').addEventListener('change', updateFilters);

document.getElementById('disable-infos').addEventListener('change', updateFilters);
document.getElementById('infos').addEventListener('change', updateFilters);

document.getElementById('disable-data').addEventListener('change', updateFilters);
document.getElementById('date-min').addEventListener('change', updateFilters);
document.getElementById('date-max').addEventListener('change', updateFilters);

document.getElementById('disable-motiune-contains').addEventListener('change', updateFilters);
document.getElementById('motiune-contains').addEventListener('change', updateFilters);

document.getElementById('disable-info-contains').addEventListener('change', updateFilters);
document.getElementById('info-contains').addEventListener('change', updateFilters);

document.getElementById('disable-ca-contains').addEventListener('change', updateFilters);
document.getElementById('ca-contains').addEventListener('change', updateFilters);

document.getElementById('advanced-enable').addEventListener('change', updateFilters)

var useTema, useLimba, useNivel, useCompetition, usePi, useTipologie, useInfos, useData, useMotiuneC, useInfoC, useCaC, useAdvanced;
updateFilters();

document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});


document.addEventListener("DOMContentLoaded", () => {
    fetch('motions.json')
        .then(response => response.json())
        .then(data => {
            window.motions = data;
            populateFilters(data);
            displayRandomMotion(data);
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
    const piSelect = document.getElementById('p/i');
    const tipologieSelect = document.getElementById('tipologie');

    const temas = new Set();
    const limbas = new Set();
    const nivels = new Set();
    const competitionsSet = new Set();
    const piOptions = new Set();
    const tipologieOptions = new Set();

    motions.forEach(motion => {
        ['TEMA 1', 'TEMA 2', 'TEMA 3', 'Tema 1', 'Tema 2', 'Tema 3'].forEach(temaKey => {
            const tema = motion[temaKey];
            if (tema && themes[tema]) {
                temas.add(themes[tema].representativeTheme);
            }
        });
        if (motion.LIMBA) limbas.add(motion.LIMBA);
        if (motion.NIVEL) nivels.add(motion.NIVEL);
        if (motion['Nume Comp.']) {
            Object.values(competitions).forEach(comp => {
                if (comp.aliases.some(alias => motion['Nume Comp.'].includes(alias))) {
                    competitionsSet.add(comp.displayName);
                }
            });
        }
        if (motion['P/I']) {
            piOptions.add(motion['P/I']);
        }
        if (motion['TIPOLOGIE']) {
            tipologieOptions.add(motion['TIPOLOGIE']);
        }
    });

    Array.from(temas).sort().forEach(tema => {
        const displayName = themes[tema] ? themes[tema].displayName : tema;
        temaSelect.add(new Option(displayName, tema));
    });
    Array.from(limbas).sort().forEach(limba => limbaSelect.add(new Option(limba, limba)));
    Array.from(nivels).sort().forEach(nivel => nivelSelect.add(new Option(nivel, nivel)));
    Array.from(competitionsSet).sort().forEach(comp => {
        competitionSelect.add(new Option(comp, comp));
    });
    Array.from(piOptions).sort().forEach(option => {
        piSelect.add(new Option(option, option.toLowerCase()));
    });
    Array.from(tipologieOptions).sort().forEach(option => {
        tipologieSelect.add(new Option(option, option.toLowerCase()));
    });
}

function displayMotions(motions) {
    const motionsContainer = document.getElementById('motions');
    motionsContainer.innerHTML = '';
    motions.forEach(motion => {
        const motionElement = document.createElement('div');
        motionElement.innerHTML = `${motion['AN']} - ${motion['Nume Comp.']}: ${motion['Moțiune']}`;
        motionsContainer.appendChild(motionElement);
        console.log(1);
    });
}

function displayRandomMotion(motions) {
    console.log(motions);
    const motionsContainer = document.getElementById('main-display-motion');
    const infosContainer = document.getElementById('main-display-infoslide');
    const otherContainer = document.getElementById('main-display-other');
    motionsContainer.innerHTML = '';
    infosContainer.innerHTML = '';
    otherContainer.innerHTML = '';

    if (motions.length === 0) {
        motionsContainer.innerHTML = 'No motions found.';
        return;
    }

    const randomMotion = motions[Math.floor(Math.random() * motions.length)];
    motionsContainer.innerHTML = `<b>Motiune:</b> ${randomMotion['Moțiune']}`;
    if(randomMotion['INFOs.'].length > 1){
        infosContainer.style.display = 'block';
        infosContainer.innerHTML = `<b>Infoslide:</b> ${randomMotion['INFOs.']}`;
    } else {
        infosContainer.style.display = 'none';
    }
    otherContainer.innerHTML = `<b>Tip:</b> ${randomMotion['P/I']} <br> <b>Data:</b> ${randomMotion['Data']} <br> <b>Competitie:</b> ${randomMotion['Nume Comp.']}`;
}

function updateFilters() {
    useAdvanced = document.getElementById('advanced-enable').checked;

    if (!useAdvanced) {
        document.getElementById('advanced-filters').style.display = 'none';
    } else {
        document.getElementById('advanced-filters').style.display = 'inline';
    }

    useTema = document.getElementById('disable-tema').checked;
    useLimba = document.getElementById('disable-limba').checked;
    useNivel = document.getElementById('disable-nivel').checked;
    useCompetition = document.getElementById('disable-competition').checked;
    usePi = document.getElementById('disable-p/i').checked;
    useTipologie = document.getElementById('disable-tipologie').checked;
    useInfos = document.getElementById('disable-infos').checked;
    useData = document.getElementById('disable-data').checked;
    useMotiuneC = document.getElementById('disable-motiune-contains').checked;
    useInfoC = document.getElementById('disable-info-contains').checked;
    useCaC = document.getElementById('disable-ca-contains').checked;

    console.log(useTema);
    if (!useTema) {document.getElementById('tema').value = ''; document.getElementById('tema').disabled = true;} else { document.getElementById('tema').disabled = false;}
    if (!useLimba) {document.getElementById('limba').value = ''; document.getElementById('limba').disabled = true;} else { document.getElementById('limba').disabled = false;}
    if (!useNivel) {document.getElementById('nivel').value = ''; document.getElementById('nivel').disabled = true;} else { document.getElementById('nivel').disabled = false;}
    if (!useCompetition) {document.getElementById('competition').value = ''; document.getElementById('competition').disabled = true;} else { document.getElementById('competition').disabled = false;}
    if (!usePi) {document.getElementById('p/i').value = ''; document.getElementById('p/i').disabled = true;} else { document.getElementById('p/i').disabled = false;}
    if (!useTipologie) {document.getElementById('tipologie').value = ''; document.getElementById('tipologie').disabled = true;} else { document.getElementById('tipologie').disabled = false;}
    if (!useInfos) {document.getElementById('infos').value = ''; document.getElementById('infos').disabled = true;} else { document.getElementById('infos').disabled = false;}
    if (!useData) {
        document.getElementById('date-min').valueAsDate = null; document.getElementById('date-min').disabled = true;
        document.getElementById('date-max').valueAsDate = null; document.getElementById('date-max').disabled = true;
    } else {
        document.getElementById('date-min').disabled = false;
        document.getElementById('date-max').disabled = false;
    }
    if (!useMotiuneC) {document.getElementById('motiune-contains').value = ''; document.getElementById('otiune-contains').disabled = true;} else { document.getElementById('motiune-contains').disabled = false;}
    if (!useInfoC) {document.getElementById('info-contains').value = ''; document.getElementById('info-contains').disabled = true;} else { document.getElementById('info-contains').disabled = false;}
    if (!useCaC) {document.getElementById('ca-contains').value = ''; document.getElementById('ca-contains').disabled = true;} else { document.getElementById('ca-contains').disabled = false;}


}

function filterMotions() {
    const tema = document.getElementById('tema').value;
    const limba = document.getElementById('limba').value;
    const nivel = document.getElementById('nivel').value;
    const competition = document.getElementById('competition').value;
    const pi = document.getElementById('p/i').value;
    const tipologie = document.getElementById('tipologie').value;
    const infos = document.getElementById('infos').value;
    const dateMin = document.getElementById('date-min').valueAsDate;
    const dateMax = document.getElementById('date-max').valueAsDate;
    const motiuneContains = document.getElementById('motiune-contains').value
    const infoContains = document.getElementById('info-contains').value
    const caContains = document.getElementById('ca-contains').value

    const filteredMotions = window.motions.filter(motion => {
        const temas = [
            themes[motion['TEMA 1']] ? themes[motion['TEMA 1']].representativeTheme : null,
            themes[motion['TEMA 2']] ? themes[motion['TEMA 2']].representativeTheme : null,
            themes[motion['TEMA 3']] ? themes[motion['TEMA 3']].representativeTheme : null,
            themes[motion['Tema 1']] ? themes[motion['Tema 1']].representativeTheme : null,
            themes[motion['Tema 2']] ? themes[motion['Tema 2']].representativeTheme : null,
            themes[motion['Tema 3']] ? themes[motion['Tema 3']].representativeTheme : null,
        ].filter(Boolean);

        const motionDate = processDate(motion['Data']);

        const temaMatch = matchReturn(useTema, tema === '' || temas.some(t => t && t.includes(tema)));
        const limbaMatch = matchReturn(useLimba, limba === '' || motion.LIMBA === limba);
        const nivelMatch = matchReturn(useNivel, nivel === '' || motion.NIVEL === nivel);
        const competitionMatch = matchReturn(useCompetition && useAdvanced, competition === '' || Object.values(competitions).some(comp => comp.aliases.some(alias => motion['Nume Comp.'].includes(alias)) && comp.displayName.includes(competition)));
        const piMatch = matchReturn(usePi && useAdvanced, pi === '' || motion['P/I'].toLowerCase() === pi);
        const tipologieMatch = matchReturn(useTipologie && useAdvanced, tipologie === '' || motion['TIPOLOGIE'].toLowerCase() === tipologie);
        const dateMatch = matchReturn(useData && useAdvanced, (!dateMin || motionDate.getTime() >= dateMin.getTime()) && (!dateMax || motionDate.getTime() <= dateMax.getTime()));
        const motiuneContainsMatch = matchReturn(useMotiuneC && useAdvanced, (motion['Moțiune'].toLowerCase().includes(motiuneContains.toLowerCase())));
        const infoContainsMatch = matchReturn(useInfoC && useAdvanced, (motion['INFOs.'].toLowerCase().includes(infoContains.toLowerCase())));
        const caContainsMatch = matchReturn(useCaC && useAdvanced, (motion['CA Team'].toLowerCase().includes(caContains.toLowerCase())));
        const infosMatch = matchReturn(useInfoC && useAdvanced, infos === 'both' || (infos === 'with' && motion['INFOs.'] && motion['INFOs.'].length > 1) || (infos === "without" && motion['INFOs.'].length < 1));

        return temaMatch && limbaMatch && nivelMatch && competitionMatch && piMatch && tipologieMatch && infosMatch && dateMatch && motiuneContainsMatch && infoContainsMatch && caContainsMatch;
    });

    displayRandomMotion(filteredMotions);
}

function matchReturn(condition1, condition2){
    const _match = (condition1, condition2) => condition1 ? condition2 : true;
    const match =_match(condition1, condition2);
    return match;
}

function processDate(date) {
    const splitDate = date.toString().split('-');
    switch (splitDate[1]) {
        case 'dec.':
            splitDate[1] = '12';
            break;
        case 'ian.':
            splitDate[1] = '01';
            break;
        case 'feb.':
            splitDate[1] = '02';
            break;
        case 'mar.':
            splitDate[1] = '03';
            break;
        case 'apr.':
            splitDate[1] = '04';
            break;
        case 'mai':
            splitDate[1] = '05';
            break;
        case 'iun.':
            splitDate[1] = '06';
            break;
        case 'iul.':
            splitDate[1] = '07';
            break;
        case 'aug.':
            splitDate[1] = '08';
            break;
        case 'sept.':
            splitDate[1] = '09';
            break;
        case 'oct.':
            splitDate[1] = '10';
            break;
        case 'nov.':
            splitDate[1] = '11';
            break;
        default:
            break;
    }

    if(splitDate[0].length == 1){
        splitDate[0] = `0${splitDate[0]}`;
    }

    const processedDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    const finalDate = new Date(processedDate);
    return finalDate;
}