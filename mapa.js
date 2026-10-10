// ==========================================
// 1. INICIALIZAÇÃO DO MAPA
// ==========================================
const map = L.map('map', { center: [-14.2350, -51.9253], zoom: 4 });
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);

setTimeout(() => {
    map.flyTo([-19.5000, -42.8000], 6, { animate: true, duration: 2.5 });
}, 1000);


// ==========================================
// 2. LÓGICA DO MODO ESCURO / CLARO
// ==========================================
const btnTema = document.getElementById('btn-tema');

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    
    // Troca o ícone do botão
    if (document.body.classList.contains('modo-escuro')) {
        btnTema.textContent = '☀️';
    } else {
        btnTema.textContent = '🌙';
    }
});


// ==========================================
// 3. LÓGICA DE GEOLOCALIZAÇÃO (ONDE ESTOU)
// ==========================================
const btnLocalizacao = document.getElementById('btn-localizacao');
let marcadorUsuario = null;

btnLocalizacao.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((posicao) => {
            const lat = posicao.coords.latitude;
            const lng = posicao.coords.longitude;

            // Desliza suavemente até o usuário (FlyTo)
            map.flyTo([lat, lng], 16, { duration: 1.5 });

            // Adiciona ou atualiza o pino da posição do usuário
            if (marcadorUsuario) {
                marcadorUsuario.setLatLng([lat, lng]);
            } else {
                marcadorUsuario = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("<b>Você está aqui!</b>")
                    .openPopup();
            }
        }, () => {
            alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        });
    } else {
        alert("Navegador não suporta geolocalização.");
    }
});


// ==========================================
// 4. DADOS E TEXTOS DAS COMUNIDADES
// ==========================================
const bancoDeDados = {
    mg: {
        titulo: "📍 Comunidade de Mumbuca",
        subtitulo: "Jequitinhonha, Minas Gerais",
        lat: -16.283333, // Coordenada para rota (opcional)
        lng: -40.966667,
        capsulas: [
        { 
            icone: "🤝", 
            titulo: "Mutirão e Troca", 
            html: "O <b>mutirão</b> é uma prática ancestral de cooperação técnica e social. As famílias reúnem-se para realizar a plantação e a colheita coletiva, trocando dias de trabalho direto sem a necessidade de mediação financeira.",
            imagem: { src: "image_d8d5fc.jpg", alt: "Mutirão na horta" }, // <--- Imagem correspondente ao Multirão e Troca.
        },
        { 
            icone: "🛒",
            titulo: "Feira de Sábado",
            html: "A feira possibilita a venda direta aos consumidores na cidade, garantindo autonomia económica e eliminando o atravessador.",
            imagem: { src: "image_d8d61d.png", alt: "Feira de Sábado" }, // <--- Imagem correspondente a Feira de Sábado.
        },
        {
            icone: "🌱",
            titulo: "Cultivos",
            html: "<ul><li><b>Mandioca:</b> Produção de farinha e derivados.</li><li><b>Milho Crioulo:</b> Preservação de sementes tradicionais.</li><li><b>Hortaliças:</b> Cultivo orgânico.</li></ul>",
            imagem: { src: "image_d8d63a.jpg", alt: "Cultivo tradicional" } // <--- Imagem correspondente ao Cultivo.
        };
            {      
                ] 
            }
        ]
    },

    rj: {
    titulo: "📍 Quilombo do Campinho",
    subtitulo: "Paraty, Rio de Janeiro",
    lat: -23.2961, // Coordenada para rota (opcional)
    lng: -44.7008,
    capsulas: [
        { 
            icone: "👑", 
            titulo: "História", 
            html: "Comunidade fundada no século XIX por três mulheres ancestrais: <b>Antonica, Marcelina e Luiza</b>. A preservação do território ocorreu por meio da resistência e do matriarcado.",
            imagem: { src: "image_d93872.jpg", alt: "Jovens com trajes tradicionais em frente à igreja" } // <--- Imagem correspondente a História.
        },
        { 
            icone: "🍲", 
            titulo: "Gastronomia", 
            html: "O Restaurante do Quilombo serve pratos emblemáticos:<br><br><ul><li><b>Camarão com Taioba</b></li><li><b>Peixe à Moda Quilombola</b></li><li><b>Drink de Juçara</b></li></ul>",
            imagem: { src: "image_d93b3a.jpg", alt: "Prato com feijoada e acompanhamentos" } // <--- Imagem correspondente a Gastronomia.
        },
        {
            icone: "🎨",
            titulo: "Artesanato",
            html: "A Casa de Artesanato reúne trançados em fibra de taboa, cestaria e esculturas em madeira, além de manter vivo o Jongo e a Capoeira.",
            imagem: { src: "image_d93b57.jpg", alt: "Casa de Artesanato" } // <--- Imagem correspondente a Artesanato.
        };


// ==========================================
// 5. CRIAÇÃO DOS PINOS E POPUPS
// ==========================================
function gerarIcone(cor, atraso = '0s') {
    return L.divIcon({
        className: 'custom-pin',
        html: `
            <div class="pin-wrapper">
                <div class="ripple"></div>
                <div class="pin-animado" style="animation-delay: ${atraso};">
                    <svg viewBox="0 0 24 24" fill="${cor}" width="36px" height="36px">
                        <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                    </svg>
                </div>
            </div>`,
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -32]
    });
}

function gerarPopupHTML(idComunidade) {
    const dados = bancoDeDados[idComunidade];
    let html = `<div class="popup-conteudo"><h3 class="popup-titulo">${dados.titulo}</h3><p class="popup-subtitulo">${dados.subtitulo}</p><div class="capsula-container">`;
    dados.capsulas.forEach((cap, index) => {
        html += `<button class="capsula" onclick="abrirPainel('${idComunidade}', ${index})">${cap.icone} ${cap.titulo}</button>`;
    });
    return html + `</div></div>`;
}

// Criação do marcador de MG
const marcadorMG = L.marker([-16.283333, -40.966667], { icon: gerarIcone('#2563eb', '2.5s') }).addTo(map);
marcadorMG.bindPopup(gerarPopupHTML('mg'), { maxWidth: 280 });
marcadorMG.on('click', function(e) {
    map.flyTo(e.latlng, 16, { duration: 1.2 }); // Animação suave ao clicar no pino
});

// Criação do marcador do RJ
const marcadorRJ = L.marker([-23.2961, -44.7008], { icon: gerarIcone('#f97316', '2.8s') }).addTo(map);
marcadorRJ.bindPopup(gerarPopupHTML('rj'), { maxWidth: 280 });
marcadorRJ.on('click', function(e) {
    map.flyTo(e.latlng, 16, { duration: 1.2 }); // Animação suave ao clicar no pino
});


// ==========================================
// 6. LÓGICA DO PAINEL LATERAL (DRAWER)
// ==========================================
function abrirPainel(idComunidade, indexCapsula) {
    const comunidade = bancoDeDados[idComunidade];
    const cap = comunidade.capsulas[indexCapsula];
    const divConteudo = document.getElementById('conteudoPainel');
    
    let conteudoHTML = `<h2>${cap.icone} ${cap.titulo}</h2><hr><div class="texto-painel">`;

    if (cap.tipo === 'galeria') {
        conteudoHTML += `
            <div class="galeria-container">
                <button class="btn-galeria prev" onclick="mudarFoto('${cap.idGaleria}', -1)">&#10094;</button>
                <div class="galeria-slides" id="${cap.idGaleria}">`;
        
        cap.imagens.forEach(img => {
            conteudoHTML += `<img src="${img.src}" alt="${img.alt}" onclick="ampliarImagem(this, '${cap.idGaleria}')">`;
        });

        conteudoHTML += `
                </div>
                <button class="btn-galeria next" onclick="mudarFoto('${cap.idGaleria}', 1)">&#10095;</button>
            </div>
            <p style="font-size:11px; text-align:center; margin-top:8px;">Clique na foto para ampliar.</p>`;
    } else {
        conteudoHTML += cap.html;
    }

    // Opcional: Se a cápsula tiver áudio cadastrado, ele aparece aqui
    if (cap.audio) {
        conteudoHTML += `
            <div class="audio-container" style="margin-top: 15px;">
                <label><b>Ouvir relato:</b></label>
                <audio controls src="${cap.audio}" style="width:100%; margin-top:5px;"></audio>
            </div>
        `;
    }

    // Botão "Como Chegar" integrado no painel lateral
    if (comunidade.lat && comunidade.lng) {
        conteudoHTML += `
            <a href="https://www.google.com/maps/dir/?api=1&destination=${comunidade.lat},${comunidade.lng}" target="_blank" class="btn-rota" style="display:block; margin-top:20px; text-align:center; padding:10px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
                🗺️ Como Chegar (Google Maps)
            </a>
        `;
    }
    
    conteudoHTML += `</div>`;
    divConteudo.innerHTML = conteudoHTML;

    document.getElementById('painelLateral').classList.add('aberto');
    document.getElementById('overlayPainel').classList.add('aberto');
}

function fecharPainel() {
    document.getElementById('painelLateral').classList.remove('aberto');
    document.getElementById('overlayPainel').classList.remove('aberto');
}


// ==========================================
// 7. LÓGICA DA GALERIA AMPLIADA (MODAL)
// ==========================================
let listaFotosModal = [];
let indiceFotoModal = 0;

function mudarFoto(idGaleria, direcao) {
    const galeria = document.getElementById(idGaleria);
    if (galeria) galeria.scrollBy({ left: direcao * galeria.clientWidth, behavior: 'smooth' });
}

function ampliarImagem(elementoImg, idGaleria) {
    const galeria = document.getElementById(idGaleria);
    if (galeria) {
        const imgs = Array.from(galeria.querySelectorAll('img'));
        listaFotosModal = imgs.map(img => ({ src: img.src, alt: img.alt || 'Foto' }));
        indiceFotoModal = imgs.findIndex(img => img.src === elementoImg.src);
    } else {
        listaFotosModal = [{ src: elementoImg.src, alt: elementoImg.alt || 'Foto' }];
        indiceFotoModal = 0;
    }
    atualizarModal();
    document.getElementById('imagemModal').style.display = 'flex';
}

function atualizarModal() {
    const foto = listaFotosModal[indiceFotoModal];
    document.getElementById('imagemExpandida').src = foto.src;
    document.getElementById('modalLegenda').textContent = listaFotosModal.length > 1 
        ? `${foto.alt} (${indiceFotoModal + 1}/${listaFotosModal.length})` : foto.alt;
    
    const displayBtns = listaFotosModal.length > 1 ? 'block' : 'none';
    document.querySelector('.modal-btn.prev').style.display = displayBtns;
    document.querySelector('.modal-btn.next').style.display = displayBtns;
}

function mudarFotoModal(direcao, event) {
    if (event) event.stopPropagation();
    if (listaFotosModal.length <= 1) return;
    indiceFotoModal = (indiceFotoModal + direcao + listaFotosModal.length) % listaFotosModal.length;
    atualizarModal();
}

function fecharModal(event) {
    if (!event || event.target.id === 'imagemModal' || event.target.classList.contains('fechar-modal')) {
        document.getElementById('imagemModal').style.display = 'none';
    }
}

document.addEventListener('keydown', e => {
    if (document.getElementById('imagemModal').style.display === 'flex') {
        if (e.key === 'ArrowLeft') mudarFotoModal(-1);
        else if (e.key === 'ArrowRight') mudarFotoModal(1);
        else if (e.key === 'Escape') fecharModal();
    }
});
