let trator, aveia = [], combustivel;
let pontuacao = 0, tempoRestante = 60;
let estadoDoJogo = "intro";
let introTimer = 0, etapaEducativa = 0;
let perguntas = [
  { pergunta: "Qual destes produtos pode ser feito com milho?", opcoes: ["A) Concreto", "B) Óleo vegetal", "C) Plástico rígido"], correta: "B" },
  { pergunta: "A soja é conhecida por ser rica em...", opcoes: ["A) Proteínas", "B) Açúcares", "C) Água"], correta: "A" },
  { pergunta: "O milho também pode ser usado como:", opcoes: ["A) Combustível", "B) Metal", "C) Borracha"], correta: "A" }
];
let indicePergunta = 0, quizRespondido = false, quizFinalizado = false;
let nivelSelecionado = null;

function setup() {
  createCanvas(800, 600);
  setInterval(contarTempo, 1000);
  textFont('Arial');
}

function draw() {
  if (estadoDoJogo === "intro") return mostrarIntroducao();
  if (estadoDoJogo === "selecionarNivel") return mostrarSelecaoNivel();

  background(135,206,235);
  fill(85,107,47); rect(0, height/2, width, height/2);

  if (estadoDoJogo === "jogando") jogar();
  else if (estadoDoJogo === "fim") mostrarFim();
  else if (estadoDoJogo === "venda") mostrarVenda();
  else if (estadoDoJogo === "educativo") mostrarEducativo();
  else if (estadoDoJogo === "quiz") mostrarQuiz();
}

function mostrarIntroducao() {
  background(255,250,240);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("🌽 Bem-vindo à Jornada da Colheita! 🌾", width/2, height/3 - 40);
  textSize(20);
  text("Controle um trator, colha aveia e colete combustível antes do tempo acabar.", width/2, height/3 + 10);
  textSize(18);
  fill(80);
  text("Pressione QUALQUER TECLA para continuar", width/2, height - 100);
}

function mostrarSelecaoNivel() {
  background(200,255,200);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(0);
  text("Selecione o Nível de Dificuldade", width/2, height/4);
  textSize(28);
  fill(nivelSelecionado === "facil" ? 'green' : 'black');
  text("F - Fácil", width/2, height/2 - 40);
  fill(nivelSelecionado === "medio" ? 'orange' : 'black');
  text("M - Médio", width/2, height/2);
  fill(nivelSelecionado === "dificil" ? 'red' : 'black');
  text("D - Difícil", width/2, height/2 + 40);
  textSize(18);
  fill(80);
  text("Pressione F, M ou D para escolher", width/2, height - 100);
}

function iniciarJogo() {
  trator = new Trator();
  pontuacao = 0;
  tempoRestante = nivelSelecionado === "facil" ? 90 : nivelSelecionado === "medio" ? 60 : 45;
  quizRespondido = quizFinalizado = false;
  indicePergunta = 0;
  etapaEducativa = 0;
  aveia = Array.from({length: nivelSelecionado === "dificil" ? 30 : nivelSelecionado === "medio" ? 20 : 15}, () => new Aveia());
  combustivel = new Combustivel();
  estadoDoJogo = "jogando";
}

function jogar() {
  trator.mover();
  trator.exibir();

  aveia.forEach((a,i) => {
    a.exibir();
    if (trator.coletar(a)) {
      pontuacao += 10;
      aveia.splice(i,1);
      aveia.push(new Aveia());
    }
  });

  combustivel.exibir();
  if (trator.coletarCombustivel(combustivel)) {
    trator.tanque = min(trator.tanque + 30, trator.tanqueMax);
    combustivel = new Combustivel();
  }

  trator.consumirCombustivel();
  if (tempoRestante <= 0 || trator.tanque <= 0) estadoDoJogo = "fim";

  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Pontos: ${pontuacao}`,10,10);
  text(`Combustível: ${floor(trator.tanque)}`,10,40);
  text(`Tempo: ${tempoRestante}`,10,70);
}

function mostrarFim() {
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Tempo esgotado!", width/2, height/2);
  setTimeout(()=> estadoDoJogo = "venda", 2000);
}

function mostrarVenda() {
  background(200,230,255);
  textAlign(CENTER);
  textSize(18);
  text(`Ótimo! Vou comprar sua aveia por ${pontuacao} moedas.\nPressione ESPAÇO para continuar`, width/2, height/2);
}

function mostrarEducativo() {
  background(250);
  textAlign(CENTER, TOP);
  textSize(26);
  fill(0);
  let linhas = (etapaEducativa === 0) ? [
    "🌽 Tudo sobre o milho!",
    "O milho é usado para alimentos, biocombustível e ração.",
    "(➡ para continuar)"
  ] : [
    "🌱 Tudo sobre a soja!",
    "A soja é rica em proteínas e importante na agroindústria.",
    "(➡ para iniciar o quiz)"
  ];
  let y0 = height/3;
  linhas.forEach((l,i)=> text(l, width/2, y0 + i*32));
}

function mostrarQuiz() {
  background(255);
  textAlign(CENTER);
  textSize(26);
  if (quizFinalizado) {
    text(`Quiz finalizado!\nPontos: ${pontuacao}\nPressione R para reiniciar`, width/2, height/2);
    return;
  }
  let p = perguntas[indicePergunta];
  text(`${indicePergunta+1}/${perguntas.length}: ${p.pergunta}`, width/2,100);
  textSize(20);
  p.opcoes.forEach((o,i)=> text(o, width/2,160 + i*40));
  if (quizRespondido) {
    fill("green");
    textSize(18);
    text("Respondido!", width/2, height-60);
  }
  fill(0);
  textSize(16);
  text("Pressione A, B ou C", width/2, height-30);
}

function keyPressed() {
  if (estadoDoJogo === "intro") {
    estadoDoJogo = "selecionarNivel";
    return;
  }
  if (estadoDoJogo === "selecionarNivel") {
    let k = key.toLowerCase();
    if (["f","m","d"].includes(k)) {
      nivelSelecionado = k;
      iniciarJogo();
    }
    return;
  }
  if (estadoDoJogo === "venda" && key === ' ') {
    estadoDoJogo = "educativo";
    return;
  }
  if (estadoDoJogo === "educativo" && keyCode === RIGHT_ARROW) {
    etapaEducativa++;
    if (etapaEducativa > 1) estadoDoJogo = "quiz";
    return;
  }
  if (estadoDoJogo === "quiz") {
    if (!quizRespondido && /[abc]/i.test(key)) {
      let resposta = key.toUpperCase();
      let correta = perguntas[indicePergunta].correta;
      pontuacao += (resposta === correta ? 10 : -5);
      quizRespondido = true;
      setTimeout(()=>{
        indicePergunta++;
        quizRespondido = false;
        if (indicePergunta >= perguntas.length) quizFinalizado = true;
      }, 800);
    } else if (quizFinalizado && key.toLowerCase() === 'r') {
      estadoDoJogo = "intro";
    }
    return;
  }
}

function contarTempo() {
  if (estadoDoJogo === "jogando" && tempoRestante > 0) tempoRestante--;
}

class Trator { /*... mesma classe que você já usava ...*/ 
  constructor() {
    this.x = width/2; this.y = height-50;
    this.largura = 80; this.altura = 60; this.velocidade = 7;
    this.tanque = this.tanqueMax = 150;
  }
  exibir() {
    fill(34,139,34); rectMode(CENTER);
    rect(this.x,this.y,this.largura,this.altura);
    fill(0,191,255);
    rect(this.x,this.y-this.altura/3,this.largura/2,this.altura/2);
    fill(80);
    rect(this.x-this.largura/3,this.y-this.altura/2,5,20);
    fill(30);
    ellipse(this.x-this.largura/3,this.y+this.altura/2,25,25);
    ellipse(this.x+this.largura/3,this.y+this.altura/2,35,35);
    rectMode(CORNER);
  }
  mover() {
    if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) this.x -= this.velocidade;
    if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) this.x += this.velocidade;
    if (keyIsDown(UP_ARROW)||keyIsDown(87)) this.y -= this.velocidade;
    if (keyIsDown(DOWN_ARROW)||keyIsDown(83)) this.y += this.velocidade;
    this.x = constrain(this.x, this.largura/2, width - this.largura/2);
    this.y = constrain(this.y, height/2 + this.altura/2, height - this.altura/2);
  }
  coletar(item) { return dist(this.x,this.y,item.x,item.y) < (this.largura*0.3 + item.raio*0.7); }
  coletarCombustivel(g) { return dist(this.x,this.y,g.x,g.y) < (this.largura*0.3 + g.raio*0.7); }
  consumirCombustivel() { this.tanque -= 0.05; }
}

class Aveia {
  constructor() {
    this.x = random(width);
    this.y = random(height/2 + 50, height - 50);
    this.raio = 10;
  }
  exibir() {
    fill(255,215,0);
    ellipse(this.x,this.y,this.raio*2);
  }
}

class Combustivel {
  constructor() {
    this.x = random(width);
    this.y = random(height/2 + 50, height - 50);
    this.raio = 15;
  }
  exibir() {
    let brilho = sin(frameCount*0.1)*50 + 205;
    fill(255,0,0,brilho);
    rectMode(CENTER);
    rect(this.x,this.y,this.raio*2,this.raio*2,5);
    rectMode(CORNER);
  }
}



