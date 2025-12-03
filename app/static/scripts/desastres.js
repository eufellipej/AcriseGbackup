// desastres.js - Mapa para a página de desastres

/**
 * FUNÇÃO PARA INICIALIZAR O MAPA
 */
function iniciarMapaDesastres() {
    const elementoMapa = document.getElementById('mapa-risco');
    if (!elementoMapa || typeof L === 'undefined') return;

    // Aguardar um pouco para garantir que o container esteja renderizado
    setTimeout(() => {
        const mapa = L.map('mapa-risco').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapa);
        
        adicionarMarcadoresDesastres(mapa);
    }, 100);
}

/**
 * ADICIONA OS MARCADORES DE DESASTRES
 */
function adicionarMarcadoresDesastres(mapa) {
    // Dados de exemplo - você pode modificar conforme necessário
    const desastres = [
        {
            nome: 'Terremoto',
            posicao: [-8.05, -34.9],
            descricao: 'Terremoto de magnitude 7.2 na costa',
            tipo: 'terremoto',
            severidade: 'alta'
        },
        {
            nome: 'Furacão',
            posicao: [28.5, -80.5],
            descricao: 'Furacão categoria 4 se aproximando',
            tipo: 'furacao',
            severidade: 'extrema'
        },
        {
            nome: 'Erupção Vulcânica',
            posicao: [-0.22, -78.51],
            descricao: 'Erupção ativa no Anel de Fogo',
            tipo: 'vulcao',
            severidade: 'media'
        },
        {
            nome: 'Inundação',
            posicao: [13.75, 100.49],
            descricao: 'Inundações no Sudeste Asiático',
            tipo: 'inundacao',
            severidade: 'alta'
        },
        {
            nome: 'Deslizamento',
            posicao: [-9.19, -75.02],
            descricao: 'Deslizamentos nos Andes',
            tipo: 'deslizamento',
            severidade: 'media'
        }
    ];
    
    desastres.forEach(desastre => {
        const icone = criarIconeDesastres(desastre.severidade);
        const marcador = L.marker(desastre.posicao, { icon: icone }).addTo(mapa);
        
        marcador.bindPopup(`
            <h3>${desastre.nome}</h3>
            <p>${desastre.descricao}</p>
            <p><strong>Tipo:</strong> ${desastre.tipo}</p>
            <p><strong>Severidade:</strong> ${desastre.severidade}</p>
        `);
    });
}

/**
 * CRIA ÍCONES PERSONALIZADOS CONFORME A SEVERIDADE
 */
function criarIconeDesastres(severidade) {
    let corIcone, tamanhoIcone;
    
    switch(severidade) {
        case 'extrema': corIcone = '#e74c3c'; tamanhoIcone = [30, 30]; break;
        case 'alta': corIcone = '#f39c12'; tamanhoIcone = [25, 25]; break;
        default: corIcone = '#27ae60'; tamanhoIcone = [20, 20];
    }
    
    return L.divIcon({
        className: 'icone-personalizado',
        html: `<div style="background-color: ${corIcone}; width: ${tamanhoIcone[0]}px; height: ${tamanhoIcone[1]}px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: tamanhoIcone,
        iconAnchor: [tamanhoIcone[0]/2, tamanhoIcone[1]/2]
    });
}

// Iniciar mapa quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarMapaDesastres);