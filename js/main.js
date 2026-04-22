"use strict";

const inputMensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");
const chat = document.getElementById("chat");

let filmes = [];
const generos = [
  "ação", "terror", "drama", "comédia",
  "ficção", "aventura", "suspense", "romance"
];


function obterMensagem() {
  return inputMensagem.value;
}

function limparEntrada() {
  inputMensagem.value = "";
}


// Mensagens 
function adicionarMensagemUsuario(texto) {
  const msg = document.createElement("div");
  msg.classList.add("usuario");
  msg.textContent = texto;
  chat.appendChild(msg);
}

function adicionarMensagemBot(texto) {
  const msg = document.createElement("div");
  msg.classList.add("bot");
  msg.textContent = texto;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function adicionarMensagemBotHTML(elemento) {
  const msg = document.createElement("div");
  msg.classList.add("bot");
  
  msg.appendChild(elemento);
  
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function mostrarDigitando() {
  const msg = document.createElement("div");
  msg.classList.add("bot", "digitando");
  
  msg.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  
  return msg;
}

// bot
function respostaAleatoria(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function processarMensagem(mensagem) {
  
  const texto = mensagem.toLowerCase();
  const genero = detectarGenero(texto);
  
  const digitando = mostrarDigitando();
  setTimeout(() => {
    digitando.remove();
    if (genero) {
      
      const lista = buscarPorGenero(genero);
      const sorteados = sortearFilmes(lista);
      
      const respostas = [
        `Aqui vão alguns filmes de ${genero} 🎬`,
        `Separei esses filmes de ${genero} pra você 🍿`,
        `Olha essas sugestões de ${genero} 👀`,
        `Você curte ${genero}? Então toma esses aqui 😎`
      ];
      adicionarMensagemBot(respostaAleatoria(respostas));
      mostrarPosters(sorteados);
    }
    else if (
      ["oi", "ola", "olá", "eae", "fala", "eai"].some(p => texto.includes(p))
    ) {
      
      const respostas = [
        "E aí! Eu sou o CineBot 🎬",
        "Olá! Pronto pra escolher um filme? 🍿",
        "Fala! Me diz um gênero que eu te ajudo 😎",
        "Oi! Bora achar um filme top? 🎥"
      ];
      adicionarMensagemBot(respostaAleatoria(respostas));
    }
    
    else if (
      ["ajudar", "ajuda", "função", "faz"].some(p => texto.includes(p))
    ) {
      
      const respostas = [
        "Eu te ajudo a encontrar filmes por gênero 🎬",
        "Sou um bot que recomenda filmes pra você 🍿",
        "Me diga um gênero e eu te mostro algumas opções 😎",
        "Posso sugerir filmes de ação, terror, comédia e mais!"
      ];
      adicionarMensagemBot(respostaAleatoria(respostas));
    }
    else if (
      ["obrigado", "valeu", "vlw", "tmj"].some(p => texto.includes(p))
    ) {
      
      const respostas = [
        "De nada! 😄",
        "Tamo junto! 🤝",
        "Disponha! 🎬",
        "Sempre que precisar 😎",
        "É nóis! 🍿",
        "Fico feliz em ajudar! 😊"
      ];
      
      adicionarMensagemBot(respostaAleatoria(respostas));
    }
    else {
      
      const respostas = [
        "Hmm... não entendi 🤔",
        "Pode tentar de outro jeito? 😅",
        "Me fala um gênero tipo: ação, terror, comédia 🎬",
        "Não peguei essa... tenta pedir um gênero 😎"
      ];
      adicionarMensagemBot(respostaAleatoria(respostas));
    }
    
  }, 1000);
}

// Funções filme
function detectarGenero(texto) {
  return generos.find(g => texto.includes(g)) || null;
}

function buscarPorGenero(genero) {
  return filmes.filter(f =>
    f.generos.some(g => g.toLowerCase() === genero)
  );
}

function sortearFilmes(lista) {
  return lista
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

// cards
function mostrarPosters(lista) {
  
  lista.forEach(filme => {
    
    const container = document.createElement("div");
    container.classList.add("card-filme");
    const img = document.createElement("img");
    img.src = filme.poster;
    img.alt = filme.nome;
    const info = document.createElement("div");
    info.classList.add("info-filme");
    const titulo = document.createElement("h4");
    titulo.textContent = `${filme.nome} (${filme.ano})`;
    const descricao = document.createElement("p");
    descricao.textContent = filme.descricao;
    info.appendChild(titulo);
    info.appendChild(descricao);
    container.appendChild(img);
    container.appendChild(info);
    adicionarMensagemBotHTML(container);
  });
}


// Evento
function onClickEnviar() {
  const mensagem = obterMensagem();
  if (!mensagem.trim()) return;
  adicionarMensagemUsuario(mensagem);
  limparEntrada();
  processarMensagem(mensagem);
}

btnEnviar.addEventListener("click", onClickEnviar);

inputMensagem.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    onClickEnviar();
  }
});

window.onload = async () => {
  const resposta = await fetch("json/filmes.json");
  filmes = await resposta.json();
  console.log(filmes);
  adicionarMensagemBot("Olá! Eu sou o CineBot 🎬");
  adicionarMensagemBot("Peça um gênero de filme.");
};