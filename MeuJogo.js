class MeuJogo extends Phaser.Scene {
  constructor() {
    super({key: 'MeuJogo'});
        // ...
       this.bgMusic = null;    // letiável para a Música de Fundo
    this.motorSound = null; // letiável para o Som do Motor
    this.isAudioEnabled = false; // Permanece para controle de clique inicial
    }
    // --- FUNÇÕES AUXILIARES DE ESTADO ---
  mudarEstado(novoEstado) {
   this.gameState = novoEstado;
        
    const isPlaying = novoEstado === 'JOGANDO';
        
      if (this.introGroup) this.introGroup.setVisible(novoEstado === 'INTRO');

      
      if (this.gameOverGroup) this.gameOverGroup.setVisible(novoEstado === 'GAMEOVER');
        
      if (this.car && this.car.body) {
      this.car.body.enable = isPlaying; 
      this.car.setVisible(isPlaying);
      }
        
      // Pausa/Resume o gerador de obstáculos
      if (this.timerGeracao) {
      this.timerGeracao.paused = !isPlaying;
      }
      

     // --- INICIALIZAÇÃO DE ÁUDIO ---
      this.bgMusic = this.sound.add('bgmusic', { volume: 0.2, loop: true });
      this.motorSound = this.sound.add('motorsound', { volume: 5.0, loop: true }); 
        
      // --- GRUPOS DE ESTADO ---
      this.introGroup = this.add.group();
      this.gameOverGroup = this.add.group();
        
      // CRIAÇÃO DA TELA INTRO (CORREÇÃO DE FLUXO)
      // ... (código da tela INTRO) ...

      // --- CRIAÇÃO DA TELA GAME OVER (Para mostrar no fim) ---
      // Cria o sprite Game Over (inicialmente invisível)
      const gameOverImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'gameover_screen')
      .setOrigin(0.5)
      .setDepth(100)
      .setDisplaySize(this.scale.width, this.scale.height);
      this.time.paused = true;

      // Adiciona botões de controle (Exemplo)
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;

      const btnRestart = this.add.image(centerX, centerY + 200, 'restart')
       .setOrigin(0.5)
       .setInteractive()
       .setDepth(101);

      const btnCreditos = this.add.image(centerX, centerY + 350, 'creditos')
       .setOrigin(0.5)
        .setInteractive()
        .setDepth(101);

    // === BOTÃO CRÉDITOS ===


    btnCreditos.on('pointerdown', () => {
      const overlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.6)
      .setDepth(149);

      const creditosImg = this.add.image(960, this.scale.height, 'tela_creditos')
      .setOrigin(0.5, 0)
      .setDepth(150)
      .setScale(0.9);

      const alturaCreditos = 8226;
      const destinoY = -alturaCreditos + this.scale.height;

      this.tweens.add({
      targets: creditosImg,
      y: destinoY,
      duration: 40000,
      ease: 'Linear',
      onComplete: () => {
      overlay.destroy(); // remove o fundo quando acabar
      creditosImg.destroy();
    }
    });
    });
     
    this.gameOverGroup.add(btnRestart);
    this.gameOverGroup.add(btnCreditos);

    btnRestart.on('pointerdown', () => {
    window.location.reload(); // Opção mais simples para reiniciar a página inteira
  });
      
  }
        
  // toggleHUD = (mostrar) => {
  //  const alvoAlpha = mostrar ? 1 : 0;
  //  const targets = [this.hud, this.professor, this.motorista, this.vidaText, this.lousa, this.perguntaText, this.respostaText];
  //  const validTargets = targets.filter(t => t);
  //  this.tweens.add({ targets: validTargets, alpha: alvoAlpha, duration: 700, ease: 'Sine.easeInOut' });
  // };
      //INICIO DO CREATE
  create() {

     this.jogoAtivo = true;
     this.score = 0;

     // tecla F - fullscreen
     this.input.keyboard.on('keydown-F', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    });

    // === SISTEMA DE PONTUAÇÃO ===
     this.pontuacao = 0;
     this.meta = 800;
     this.venceu = false;
     this.combo = 0; // acertos consecutivos
     this.tempoSemColisao = 0;

       // === HUD DE PONTUAÇÃO ===

    // Fundo da pontuação
     this.pontosFundo = this.add.image(960, 80, 'pontos') // centralizado no topo
     .setOrigin(0.5)
     .setDepth(100); // acima da pista e do carro

   // Texto da pontuação sobre o fundo
     this.scoreText = this.add.text(960, 80, 'Pontos: 0', {
     fontSize: '40px',
     fontFamily: 'Arial Black',
     color: '#ffffff',
     stroke: '#000000',
     strokeThickness: 8,
     align: 'center'
     })
     .setOrigin(0.5)
     .setDepth(101);

     if (UserActivation) {this.sound.play('bgmusic', { volume: 0.4, loop: true })
      };  //INICIA SOM APOS INTERAÇÃO DO USUARIO
   
    // --- CONFIG INICIAL ---
    this.cameras.main.setBackgroundColor('#87CEEB'); // fallback cor do céu

    // --- FUNDO ---
    if (this.textures.exists('fundo')) {
      const bg = this.add.image(960, 540, 'fundo').setDisplaySize(1920, 1080);
      bg.setDepth(0);
    } else {
      this.add.rectangle(960, 540, 1920, 1080, 0x87CEEB).setOrigin(0.5).setDepth(0);
    }

    // --- ESTRADA (obter dimensões reais) ---
    let roadWidth = 1920, roadHeight = 484; // defaults
    if (this.textures.exists('estrada')) {
      try {
      const tex = this.textures.get('estrada');
      const img = tex.getSourceImage ? tex.getSourceImage() : (tex.source && tex.source[0] && tex.source[0].image);
      if (img && img.width && img.height) {
       roadWidth = img.width;
       roadHeight = img.height;
      }
      } catch (e) { /* ignore */ }
    }

    const roadY = 1080 - Math.round(roadHeight / 2);

    // === CAMADA DA CERCA (entre paisagem e estrada) ===
      if (this.textures.exists('cerca')) {
      const cercaAltura = 76;
      const estradaY = 575;   // Y da estrada
      const estradaAltura = 484;

    // Posição: ligeiramente acima da estrada
      const cercaY = estradaY - (estradaAltura / 2) + 230;

    // TileSprite repetindo horizontalmente, cobrindo toda a tela
     this.cerca = this.add.tileSprite(960, cercaY, 1920, cercaAltura, 'cerca')
     .setOrigin(0.5)
     .setDepth(10); // entre faixa (10) e estrada (12)
     } else {
     console.warn('cerca.png não encontrada — ignorando camada de cerca.');
    }

   

    // === GRUPO DE OBSTÁCULOS ===
     this.obstaculos = this.physics.add.group();

  

    // Tabelas de tipos
      this.tiposEstaticos = ['obs_estatico1', 'obs_estatico2', 'obs_estatico3', 'obs_estatico4'];
      this.tiposDinamicos = ['obs_dinamico1', 'obs_dinamico2', 'obs_dinamico3'];
      this.tiposRetro = ['obs_retro1', 'obs_retro2', 'obs_retro3'];

    // velocidade da pista — usada pelos obstáculos
      this.velocidadePista = 300;

    // faixas Y (para os obstáculos se alinharem às 3 faixas da estrada)
      this.faixasY = [roadY - roadHeight / 4, roadY, roadY + roadHeight / 4];


    // evento que gera obstáculos de forma periódica
     this.eventoObstaculos = this.time.addEvent({
     delay: 3300,
     callback: this.gerarObstaculo,
     callbackScope: this,
     loop: true
    });

  
   // === FAIXA DE PAISAGEM (sobre a estrada) ===
    if (this.textures.exists('paisagem')) {
      const faixaAltura = 336;
      const estradaY = 575; // mesmo Y usado na estrada
      const estradaAltura = 484; // altura real da imagem da estrada

    // Posição da faixa: sobreposta à parte superior da estrada
    // (ligeiramente mais alta, para parecer atrás mas visível)
      const faixaY = estradaY - (estradaAltura / 2) + 100; // ajuste fino do overlap

      this.faixa = this.add.tileSprite(960, faixaY, 3210, faixaAltura, 'paisagem')
     .setOrigin(0.5)
     .setDepth(2); // logo acima do fundo, abaixo das demais camadas
     } else {
      console.warn('paisagem.png não encontrada — ignorando camada de paisagem.');
    }


    // --- ESTRADA (tileSprite) ---
      if (this.textures.exists('estrada')) {
      this.road = this.add.tileSprite(960, roadY, 1920, roadHeight, 'estrada').setOrigin(0.5).setDepth(5);
      const scaleXroad = 1920 / roadWidth;
      this.road.setScale(scaleXroad, 1);
    } else {
      // fallback rectangles caso falte imagem
      this.road = null;
      this.roadFallbackA = this.add.rectangle(960, roadY, 1920, roadHeight, 0x444444).setOrigin(0.5).setDepth(5);
      this.roadFallbackB = this.add.rectangle(960 + 1920, roadY, 1920, roadHeight, 0x444444).setOrigin(0.5).setDepth(5);
    }

    // --- DEFINIÇÃO DAS COORDENADAS FIXAS DAS FAIXAS (LANES) ---
    // Y's EXATOS que você precisa: 660, 800, 950
    this.carLanes = [660, 800, 850]; // Índice 0 = topo, 1 = meio, 2 = baixo

    this.currentLane = 1; // Começa na faixa do meio (índice 1)


    // --- CARRO (Physics Sprite) ---
     const carX = 650; // Seu X fixo
     const carY = this.carLanes[this.currentLane]; // Posição Y é a do centro da Faixa 2 (800)

     if (this.textures.exists('carro')) {
      this.car = this.physics.add.sprite(carX, carY, 'carro').setDepth(11).setScale(1.0);
      this.car.body.setAllowGravity(false);
      this.car.setImmovable(true);
      this.car.body.setSize(this.car.width * 0.6, this.car.height * 0.5, true); // tamanho do hitbox do carro

    // descobre número de frames
      let carFrameCount = 1;
      try {
      const ct = this.textures.get('carro');
      const img = ct.getSourceImage ? ct.getSourceImage() : (ct.source && ct.source[0] && ct.source[0].image);
      if (img && img.width) {
      
     // TAMANHO DE CADA SPRITE DO CARRO
     //const fw = 536, fh = 277; // TAMANHO CARRO AMARELO VELHO
      const fw = 476, fh = 276;
      const cols = Math.max(1, Math.floor(img.width / fw));
      const rows = Math.max(1, Math.floor(img.height / fh));
      carFrameCount = cols * rows;
    }
    } catch (e) {}
      this.anims.create({
     key: 'dirigir',
     frames: this.anims.generateFrameNumbers('carro', { start: 0, end: Math.max(0, carFrameCount - 1) }),
     frameRate: 20,
     repeat: -1
    });
     
      this.car.play('dirigir');
     } else {
      this.car = this.physics.add.rectangle(carX, carY, 180, 90, 0xff0000).setDepth(11);
      this.car.setImmovable(true);
    }

    // --- COLISÃO COM OBSTÁCULOS (CORRETO) ---
     this.physics.add.overlap(this.car, this.obstaculos, (car, obst) => {
      // Verifica se estão na mesma faixa (diferença pequena em Y)
     const mesmaFaixa = Math.abs(car.y - obst.y) < 50;

    if (mesmaFaixa) {
      // Colisão tratada na função (invulnerabilidade, dano)
      // Chamado UMA VEZ por frame que a colisão persiste
      this.tratarColisao(obst); 
 

    // efeito de invulnerabilidade
      this.invulneravel = true;

     this.tweens.add({
        targets: this.car,
        alpha: 0.25,
        yoyo: true,
        repeat: 2, // Pisca uma vez por dano
        duration: 400,
        onComplete: () => {
            this.car.setAlpha(1);
        }
    });

     // volta a ser vulnerável depois de 3 segundos
     this.time.delayedCall(3000, () => {
      this.invulneravel = false;
    });
    }
    }, null, this);


    // faixas verticais do carro (3 faixas)
      const laneGap = Math.round(roadHeight / 3);
      this.carLanes = [roadY - laneGap, roadY, roadY + laneGap];
      this.currentLane = 1;
      this.car.y = this.carLanes[this.currentLane];

    // --- HUD: moldura (imagem) e professor (spritesheet) ---

    
      const hudX = 45; // margem lateral 10px
      const hudY = 15; // margem topo 10px

      if (this.textures.exists('moldura')) {
      this.hud = this.add.image(hudX, hudY, 'moldura').setOrigin(0, 0).setDepth(20);
    } else {
      this.hud = this.add.rectangle(hudX, hudY, 1920, 566, 0x000000, 0.4).setOrigin(0, 0).setDepth(20);
    }

    // professor: por baixo da moldura (depth menor) para que a moldura se sobreponha
      if (this.textures.exists('professor')) {
      this.professor = this.add.sprite(hudX + 283, hudY + 288, 'professor', 0).setScale(1.0).setDepth(19);
    } else {
      this.professor = this.add.rectangle(hudX + 340, hudY + 288, 180, 180, 0x6666ff).setDepth();
    }

    // tenta determinar número de frames do professor
      let profFrameCount = 7;
      try {
      const pt = this.textures.get('professor');
      const img = pt.getSourceImage ? pt.getSourceImage() : (pt.source && pt.source[0] && pt.source[0].image);
      if (img && img.width) {
      const fw = 450, fh = 450;
      const cols = Math.max(1, Math.floor(img.width / fw));
      const rows = Math.max(1, Math.floor(img.height / fh));
      profFrameCount = cols * rows;
    }
    } catch (e) {}

      this.anims.create({
      key: 'danoProfessor',
      frames: this.anims.generateFrameNumbers('professor', { start: 0, end: Math.max(0, profFrameCount - 1) }),
      frameRate: 0
    });

    // vida do professor (usa profFrameCount como máximo)
      
      this.vidaMax = profFrameCount;
      this.vidaAtual = this.vidaMax;

    // frame mostrado: 0 = sem dano, frame = vidaMax - vidaAtual
      this.professor.setFrame(this.vidaMax - this.vidaAtual);

    // texto de vida (mostra valor numérico)
      //this.vidaText = this.add.text(hudX + 100, hudY + 200, 'Vida: ' + this.vidaAtual, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setDepth(2);

    // --- NOVO: HUD DO MOTORISTA (Elemento Visual Secundário) ---
     const motoristaHudX = 1590; // Posição X (lado direito)
     const motoristaHudY = 295;  // Posição Y (topo)

    // Sprite do Motorista (Ele espelha o frame do professor)
     if (this.textures.exists('motorista')) {
    // Inicializa o motorista no mesmo frame do professor (0 = vida cheia)
     this.motorista = this.add.sprite(motoristaHudX, motoristaHudY, 'motorista', 0) 
     .setScale(1.0)
     .setDepth(19);
    } else {
    this.motorista = this.add.rectangle(motoristaHudX, motoristaHudY, 180, 180, 0xFF9900).setDepth(19);
    }

    // Criamos a animação (apenas para definir os frames)
     this.anims.create({
     key: 'danoMotorista',
     frames: this.anims.generateFrameNumbers('motorista', { start: 0, end: 6 }), // 7 quadros (0 a 6)
     frameRate: 0,
    });

    // --- LOUSA (caixa de perguntas) ---
      const lousaLargura = 756;
      const lousaAltura = 418;
      const lousaX = hudX + 920;
      const lousaY = hudY + 280;

      if (this.textures.exists('lousa')) {
      this.lousa = this.add.image(lousaX, lousaY, 'lousa').setDisplaySize(lousaLargura, lousaAltura).setOrigin(0.5).setDepth(22);
    } else {
      this.lousa = this.add.rectangle(lousaX, lousaY, lousaLargura, lousaAltura, 0x222222, 0.6).setDepth(22);
    }

    // texto da pergunta (com wrap limitado)
      const textoConfig = {
      fontSize: '40px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: lousaLargura - 10 }, // 40 px de margem interna
      lineSpacing: 6
    };

      this.perguntaText = this.add.text(lousaX, lousaY - 20, '', textoConfig).setOrigin(0.5).setDepth(23);
      this.respostaText = this.add.text(lousaX, lousaY + 150, '', {
      fontSize: '40px',
      color: '#aeee9dff',
      fontFamily: 'Arial',
      backgroundColor: '#00000002',
      padding: { x: 30, y: 30 },
      align: 'center'
    }).setOrigin(0.5).setDepth(23);

    // --- LISTA DE PEERGUNTAS ---
      this.perguntas = [
        // as perguntas adicionais devem seguir esse padrão elementar ' {q: 'pergunta', a: 'resposta'}, '
      { q: 'Quanto vale, 5 + 3 = ?', a: '8' },
      { q: 'quanto vale, 4 x 4 = ?', a: '16'},
      { q: 'Quanto vale, 5 x 5 = ?', a: '25'},
      { q: 'Quanto vale, 6 x 6 = ?', a: '36'},
      { q: 'Quanto vale, 7 x 7 = ?', a: '49'},
      { q: 'Quanto vale, 8 x 8 = ?', a: '64'},
      { q: 'Quanto vale, 9 x 9 = ?', a: '81'},
      { q: 'Quanto vale, 3 x 3 = ?', a: '9'},
      { q: 'Um carro percorre 60 km em 2 horas. Qual a velocidade média?', a: '30' },
      { q: 'Se um triângulo tem lados 3, 4 e 5, qual é o perímetro?', a: '12' },
      { q: 'Uma caixa contém 12 maçãs. João comeu 4. Quantas maçãs sobraram?', a: '8' },
      { q: 'Qual é a área de um retângulo de base 5 e altura 3?', a: '15' },
      { q: 'Uma fábrica produz 150 peças em 5 horas. Quantas peças produz em 1 hora?', a: '30' },
      { q: 'Resolva para x: 3x + 5 = 20', a: '5' },
      { q: 'Se um número aumentado de 7 dá 15, qual é esse número?', a: '8' },
      { q: 'Qual o valor de 25% de 80?', a: '20' },
      { q: 'Qual a média entre os números 10, 12 e 14?', a: '12' },
      { q: 'Qual é o resultado de 4² + 2²?', a: '20' },
      { q: 'A soma de dois números é 30, um é 18. Qual o outro?', a: '12' },
      { q: 'Se 5x = 35, qual o valor de x?', a: '7' },
      { q: 'Qual é o menor número primo?', a: '2' },
      { q: 'Um ângulo reto mede quantos graus?', a: '90' },
      { q: 'Se um livro custa 20 e está com 10% de desconto, qual o preço final?', a: '18' },
      { q: 'Qual o número inverso de 1/5 ?', a: '5' },
      { q: 'A área de um quadrado é 49. Qual o lado do quadrado?', a: '7' },
      { q: 'Qual o valor de  x em : 2x - 7 = 9', a: '8' },
      { q: 'Se um tanque tem 100 litros e está cheio até 75%, quantos litros tem?', a: '75' },
      { q: 'Qual o resultado de √81?', a: '9' },
      { q: 'Quanto é 20% de 50?', a: '10' },
      { q: 'Um triângulo tem um ângulo de 50º e outro de 60º. Qual o terceiro?', a: '70' },
      { q: 'Qual o perímetro de um quadrado com lado 10?', a: '40' },
      { q: 'Se uma passagem custa 15 e você tem 50, quantas passagens pode comprar?', a: '3' },
      { q: 'Qual a fração que representa 25% (arredonde resposta)?', a: '1/4' },
      { q: 'Qual é o resultado da expressão: 10 - (2 + 3)?', a: '5' },
      { q: 'Que número multiplicado por 6 dá 42?', a: '7' },
      { q: 'Se um ângulo mede 135º, é ( 1 ) agudo, ( 2 ) reto ou ( 3 ) obtuso?', a: '3' },
      { q: 'Quantos segundos tem 3 minutos?', a: '180' },
      { q: 'Se uma camisa custa 50 e tem 20% de desconto, qual o preço final?', a: '40' },
      { q: 'Qual a fração equivalente a 0,75 (arredonde)?', a: '1' },
      { q: 'Um triângulo retângulo tem catetos 6 e 8. Qual a hipotenusa?', a: '10' },
      { q: 'Qual o número de lados de um hexágono?', a: '6' },
      { q: 'Todo número elevado ao expoente 0 é igual a ?', a: '1' },
      { q: 'Qual o valor de x em 5x = 25?', a: '5' },
      { q: 'Se a temperatura cai de 30 para 15, qual foi a variação?', a: '-15' },
      { q: 'Quanto vale a soma dos ângulos internos de um triângulo?', a: '180' },
      { q: 'Qual probabilidade em % de sair cara em um jogo de cara ou coroa ?', a: '50' },
      { q: 'Qual o valor da área do quadrado de lado 12?', a: '144' },
      { q: 'Quanto é 4 × 7?', a: '28' },
      { q: 'Um aquário tem dimensões 5x4x3. Qual o volume?', a: '60' },
      { q: 'Se um produto custa 120 e aumenta 10%, quanto passa a custar?', a: '132' },
      { q: 'Qual a raiz quadrada de 64?', a: '8' },
      { q: 'Em uma compra de 5 itens, cada um custa 8, qual seria o total?', a: '40' },
      { q: 'Calcule a média de 7, 8 e 9?', a: '8' },
      { q: 'Um retângulo tem perímetro 24 e base 7. Qual a altura?', a: '5' },
      { q: 'Qual a da raiz cúbica de 27?', a: '3' },
      { q: 'Se 3/4 de uma pizza foi comida, qual a fração que sobra ?', a: '1/4' },
      { q: 'Quantos minutos tem meia hora?', a: '30' },
      { q: 'Qual é o número primo seguinte a 7?', a: '11' },
      { q: 'Em uma sala com 20 alunos, 5 estavam ausentes. Qual a porcentagem dos alunos presentes ?', a: '75' },
      { q: 'Quantas diagonais tem um quadrado?', a: '2' },
      { q: 'Se um quadrado tem lado 9, qual seu perímetro?', a: '36' },
      { q: 'Qual é o valor de 15 - 7 + 3?', a: '11' },
      { q: 'Um telefone custa 100 e tem desconto de 15%. Qual o preço final?', a: '85' },
      { q: 'Se a velocidade de um carro é 90km/h, quantos km percorre em 2 horas?', a: '180', a:'180km'},
      { q: 'Qual a área de um triângulo com base 10 e altura 6?', a: '30' },
      { q: 'Qual o resultado de 8 × 7?', a: '56' },
      { q: 'Se um triângulo tem dois catetos 5 e 12, qual a hipotenuza se esse triangulo for retângulo?', a: '13' },
      { q: 'Qual o valor de 13 + 24?', a: '37' },
      { q: 'Um número dividido por 4 é 7. Qual é o número?', a: '28' },
      { q: 'Quanto é 10% de 50?', a: '5' },
      { q: 'Qual o resultado da operação 9²?', a: '81' },
      { q: 'Um círculo tem diâmetro 10. Qual o raio?', a: '5' },
      { q: 'Qual é o menor número natural?', a: '0' },
      { q: 'Um PENTÁGONO,é um polígono com quantos lados?', a: '5' },
      { q: 'Resolva: 2(x - 3) = 8', a: '7' },
      { q: 'Qual a área de um quadrado com lado 11?', a: '121' },
      { q: 'Qual a fração que corresponde a 50% (arredonde)?', a: '1/2' },
      { q: 'Um pacote tem 24 balas e é dividido entre 6 crianças igualmente. Quantas balas cada uma recebe?', a: '4' },
      { q: 'Qual a raiz quadrada de 100?', a: '10' },
      { q: 'Qual o valor de 3x se x=4?', a: '12' },
      { q: 'Qual é o número seguinte a 99?', a: '100' },
      { q: 'Uma loja vendeu 120 produtos em 4 dias. Qual a média diária?', a: '30' },
      { q: 'Se aumentarmos 10% em 50, qual o novo valor?', a: '55' },
      { q: 'Uma caixa tem 5 pacotes de arroz. Se 2 pacotes são usados, quantos sobram ?', a: '3' },
      { q: 'Qual o valor do perímetro de um triângulo com lados 6, 7 e 8?', a: '21' },
      { q: 'Qual o volume de um cubo de aresta 3?', a: '27' },
      { q: 'Qual é o ângulo complementar de 40º?', a: '50' },
      { q: 'Se x + 3 = 10, qual o valor de x?', a: '7' },
      { q: 'Qual o valor de 5³?', a: '125' },
      { q: 'Quanto é 100 menos 35?', a: '65' },
      { q: 'Se um tanque tem 250 e já está com 100, quanto falta para encher?', a: '150' },
      { q: 'Quantos anagramas tem a palavra MATEMÁTICA ?', a: '7'},
      { q: 'Pedro tem 20 anos e seu irmão caçula nasceu hoje🥰. Com que idade pedro terá o dobro da idade do irmão caçula? ', a: '40'},
      { q: 'Quanto vale 3! ?', a: '6'},
      { q: 'Quanto vale 5# ?', a: '30'},
      { q: 'Quanto vale a raiz quadrada de 36 ?', a: '6'},
      { q: 'Uma sacola com uma dúzia de laranjas, contém quantas laranjas no total?', a: '12'},
      { q: 'De quantas formas diferentes podemos organizar os anagramas da palavra: SAPO ?', a: '24'},
      { q: 'Quanto vale, 10 - 4 = ?', a: '6' },
      { q: 'Quanto vale a soma dos ângulos internos de um triângulo qualquer ?', a: '180'},
      { q: 'Quanto vale, 7 x 2 = ?', a: '14' },
      { q: 'Quanto vale, 9 - 12 = ?', a: '-3' },
      { q: 'Quanto é log de 64 na base 8 ? Dica: leia como: Qual o expoente que transforma a base 8 em 64.', a: '2' },
      { q: 'Qual a raiz quadrada de 9 ?', a: '3' },
      { q: 'Quando eu tinha 4 anos a idade do meu irmão era o dobro da minha idade. Hoje meu irmão tem 20 anos, que idade eu tenho hoje?', a: '16' },
      { q: 'Uma compra custa 7,50. Você paga com 10 e a balconista pede 2,50 para facilitar. Quanto de troco você deve receber?', a: '5' }, 
      { q: 'O pai de Maria foi passear com 3 filhas: Joana, Sofia e Andrea. Quantas filhas tem o pai de Maria?', a: '4' },
      { q: 'Quanto é log10 ? dica: quando a base for omitida, base = 10).', a: '1' },
      { q: 'Quanto vale x na equação: x/3 + 6 = 10 ?', a: '12' },
      { q: 'Quando pedro nasceu seu pai tinha 33 anos, hoje o pai de Pedro tem 40. qual idade pedro tem hoje ?', a: '7'},
      { q: 'Qual é o inverso de 1/4 ?', a: '4' },
      { q: 'Quando Diana completou 15 anos sua tia tinha o dobro de sua idade. Hoje Diana tem 30 anos, que idade tem hoje a tia de Diana? ', a: '45'},
      { q: 'Quanto vale, 2 - 4 = ?', a: '-2'},
      { q: 'Eu tinha 10 laranjas, vendi 1/2 por 5 cada uma. Quanto recebi?', a: '25' },
      { q: 'Em um Triângulo retângulo, se os catetos medem 6cm e 8cm. Quantos cm mede a Hipotenusa?', a: '10' },
      { q: 'Quanto é o log de x²+4x+4 na base (x+2)?', a: '2' },
      { q: 'Perímetro de um quadrado cuja área é 9 cm²?', a: '12' },
      { q: 'Quanto é a divisão do perímetro pelo diâmetro de qualquer circunferência?', a: '3,14', a:'3' },
      { q: 'Quantas partes de 1/4 cabem em 1 inteiro?', a: '4' },
      { q: 'Qual é a quarta parte de 100', a: '25'},
    ];
    
      // controle de game play

    // Detecta o início do toque
    this.input.on('pointerdown', (pointer) => {
    this.startY = pointer.y;
     });

    // Detecta o fim do toque
    this.input.on('pointerup', (pointer) => {
    const deltaY = pointer.y - this.startY;
 
     if (deltaY < -50) {
     // deslizou para cima
     this.moverCarroCima();
    } else if (deltaY > 50) {
      // deslizou para baixo
     this.moverCarroBaixo();
    }
     });

     this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
     const minLane = 0; // Faixa de cima
     const maxLane = this.carLanes.length - 1; // Faixa de baixo (2)

     if (deltaY < 0) {
     // Scroll para cima (sobe)
     this.currentLane = Math.max(minLane, this.currentLane - 1);
    } else if (deltaY > 0) {
     // Scroll para baixo (desce)
      this.currentLane = Math.min(maxLane, this.currentLane + 1);
    }
    


   

    this.tweens.add({
    targets: this.car,
     y: this.carLanes[this.currentLane], // O carro vai para o Y da faixa escolhida
     duration: 250,
     ease: 'Sine.easeInOut'
    });
    });

    // Cria um input invisível só para chamar o teclado do Android
this.hiddenInput = document.createElement('input');
this.hiddenInput.type = 'number'; // força o teclado numérico
this.hiddenInput.style.opacity = 0;
this.hiddenInput.style.position = 'absolute';
this.hiddenInput.style.pointerEvents = 'none';
this.hiddenInput.style.height = '0px';
this.hiddenInput.style.width = '0px';
document.body.appendChild(this.hiddenInput);

// Captura o valor digitado
this.hiddenInput.addEventListener('input', () => {
  const valor = this.hiddenInput.value.trim();
  if (valor !== '') {
    this.processarResposta(valor);
    this.hiddenInput.value = ''; // limpa
    this.hiddenInput.blur(); // fecha o teclado
  }
});

    // // Criando o elemento de input HTML
    //   const inputElement = document.createElement('input');
    //   inputElement.type = 'text';
    //   inputElement.id = 'respostaInput';
    //   inputElement.style.position = 'absolute';
    //   inputElement.style.top = '80%';
    //   inputElement.style.left = '50%';
    //   inputElement.style.transform = 'translate(-50%, -50%)';
    //   inputElement.style.fontSize = '32px';
    //   inputElement.style.padding = '10px';
    //   inputElement.style.zIndex = 1000;
    //   inputElement.style.display = 'none'; // ← começa oculto
    //   document.body.appendChild(inputElement);


    // permite números, sinal de menos, vírgula, ponto e letras (caso queira respostas com texto)
    // você pode adaptar para aceitar apenas caracteres desejados
    // teclado para digitar resposta e Enter/Backspace

    this.input.keyboard.on('keydown', (ev) => {
    
     if (!this.perguntaAtiva) return; // só aceita digitação quando há pergunta ativa
     if (ev.key === 'Backspace') {
      this.respostaAtual = this.respostaAtual.slice(0, -1);
    } else if (ev.key === 'Enter') {
      this.validarResposta(false); // respondeu dentro do tempo
    } else if (/^[0-9\-.,A-Za-z]$/.test(ev.key)) 
    
    {
    
      this.respostaAtual += ev.key;
    }
      this.respostaText.setText(this.respostaAtual);
    });

    

  // --- FUNÇÃO: toggleHUD (fade in/out) ---
    this.toggleHUD = (mostrar) => {
      const alvoAlpha = mostrar ? 1 : 0;
      const targets = [this.hud, this.professor, this.motorista, this.lousa, this.perguntaText, this.respostaText];
      // garante que todos existam
      const validTargets = targets.filter(t => t);
      this.tweens.add({
        targets: validTargets,
        alpha: alvoAlpha,
        duration: 2000,
        ease: 'Sine.easeInOut'
      });
    };

    // inicia HUD invisível
      this.hud.setAlpha(0);
     this.professor.setAlpha(0);
     this.lousa.setAlpha(0);
     this.perguntaText.setAlpha(0);
     this.respostaText.setAlpha(0);

    // --- TEMPORIZADORES e LÓGICA DE PERGUNTAS ---
     this.tempoResposta = 25000; // 25s para responder
     this.tempoPausa = 7000;    // 6s de pausa entre perguntas
     this.timerPergunta = null;
     this.perguntaAtiva = false;
     this.respostaAtual = '';

    // função que escolhe e mostra nova pergunta
      this.novaPergunta = () => {
       // Exibe o campo de resposta
      // inputElement.style.display = 'block';
      // inputElement.focus();
      // Quando o jogador tocar na área de resposta chama teclado
      this.lousa.setInteractive();
      this.lousa.on('pointerdown', () => {
      this.hiddenInput.focus(); // abre o teclado no Android
      });
      //clicando fora some o teclado
      this.input.on('pointerdown', (pointer, gameObject) => {
      if (!gameObject || gameObject !== this.caixaResposta) {
      this.hiddenInput.blur(); // fecha teclado se tocar fora
      }
     });

    // sorteia uma pergunta não vazia
      let idx = Phaser.Math.Between(0, this.perguntas.length - 1);
    // evita índice para pergunta vazia
      let attempts = 0;
      while ((this.perguntas[idx].q === '' || this.perguntas[idx].q == null) && attempts < 10) {
        idx = Phaser.Math.Between(0, this.perguntas.length - 1);
        attempts++;
      }
      this.perguntaAtual = idx;
      this.perguntaText.setText(this.perguntas[this.perguntaAtual].q);
      this.respostaAtual = '';
      this.respostaText.setText('');
      this.perguntaAtiva = true;
      
    // mostra HUD com fade
      this.toggleHUD(true);

    // limpa timer anterior
      if (this.timerPergunta) this.timerPergunta.remove();

    // inicia timer de resposta (20s)
      this.timerPergunta = this.time.delayedCall(this.tempoResposta, () => {
        // tempo esgotado -> considera errado
        this.validarResposta(true);
        //const resposta = parseInt(inputElement.value);
        //esconde teclado no celular
        // inputElement.value = '';
        // inputElement.style.display = 'none';
      });
    };

    // finalizar pergunta: chamado após validar resposta (acertou/errou) e inicia pausa de 15s
     this.finalizarPergunta = () => {
    // garante cancelar timer
      if (this.timerPergunta) {
        this.timerPergunta.remove();
        this.timerPergunta = null;
         // Limpa e esconde o input
       inputElement.value = '';
       inputElement.style.display = 'none';
      }
      this.perguntaAtiva = false;

    // esconde HUD durante a pausa
      this.toggleHUD(false);
      

    // após pausa, inicia nova pergunta
      this.time.delayedCall(this.tempoPausa, () => {
        this.novaPergunta();
      });
    };

    // vinculamos validarResposta (definida abaixo) — chamamos novaPergunta para começar
      this.novaPergunta();

     
   // FIM DO CREATE     
  } 
    // VALIDAÇÃO DE RESPOSTA
  validarResposta(timedOut = false) {
    if (!this.perguntaAtiva) return; // evita chamadas duplicadas
     this.perguntaAtiva = false;

    // cancela timer se existir
    if (this.timerPergunta) {
      this.timerPergunta.remove();
      this.timerPergunta = null;
    }

     const corretaRaw = this.perguntas[this.perguntaAtual].a;
     const respostaRaw = (this.respostaAtual || '').toString().trim();

    let acertou = false;
     if (timedOut) {
     acertou = false;
    } else {
    // comparação flexível: remove espaços e compara case-insensitive
      const normalize = s => s.toString().trim().toLowerCase().replace(/\s+/g, '');
      if (normalize(corretaRaw) === normalize(respostaRaw)) acertou = true;
    }

    if (acertou) {
     this.perguntaText.setText('✅ Correto!');this.sound.play('sfx_acerto', { volume: 2.0 });this.pontuacao += 30;
     this.combo++;

     if (this.combo == 2) {
     this.pontuacao += 15; // bônus de combo
     
    //this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, '😁👍+15 Combo!', {
     fontSize: '60px',
     fontFamily: 'Arial Black',
     color: '#b3fa0cff',
     stroke: '#0e0e0dff',
     strokeThickness: 10,
     align: 'center'
     }).setOrigin(0.5).setDepth(150).setAlpha(0);
     

     this.tweens.add({
     targets: comboText,
     alpha: 1,
     y: 440,
     duration: 500,
     yoyo: true,
     hold: 500,
     ease: 'Back.easeOut',
     onComplete: () => comboText.destroy()
    });
    }
    if (this.combo == 3) {
     this.pontuacao += 20; // bônus de combo
     
    //this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, 'ETA NOIS!😁👍+20 Combo!', {
     fontSize: '60px',
     fontFamily: 'Arial Black',
     color: '#b3fa0cff',
     stroke: '#0e0e0dff',
     strokeThickness: 10,
     align: 'center'
     }).setOrigin(0.5).setDepth(150).setAlpha(0);
     

     this.tweens.add({
     targets: comboText,
     alpha: 1,
     y: 440,
     duration: 500,
     yoyo: true,
     hold: 500,
     ease: 'Back.easeOut',
     onComplete: () => comboText.destroy()
    });
    }if (this.combo == 4) {
     this.pontuacao += 25; // bônus de combo
     
    //this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, 'HIIIII HUUUUL .🤩👍+25 Combo!', {
     fontSize: '60px',
     fontFamily: 'Arial Black',
     color: '#b3fa0cff',
     stroke: '#0e0e0dff',
     strokeThickness: 10,
     align: 'center'
     }).setOrigin(0.5).setDepth(150).setAlpha(0);
     

     this.tweens.add({
     targets: comboText,
     alpha: 1,
     y: 440,
     duration: 500,
     yoyo: true,
     hold: 500,
     ease: 'Back.easeOut',
     onComplete: () => comboText.destroy()
    });
    }
    if (this.combo == 5) {
     this.pontuacao += 35; // bônus de combo
     
    //this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, 'IMPRESSIONANTE! 😍👍+35 Combo!', {
     fontSize: '60px',
     fontFamily: 'Arial Black',
     color: '#b3fa0cff',
     stroke: '#0e0e0dff',
     strokeThickness: 10,
     align: 'center'
     }).setOrigin(0.5).setDepth(150).setAlpha(0);
     

     this.tweens.add({
     targets: comboText,
     alpha: 1,
     y: 440,
     duration: 500,
     yoyo: true,
     hold: 500,
     ease: 'Back.easeOut',
     onComplete: () => comboText.destroy()
    });
    }
    if (this.combo >= 6) {
     this.pontuacao += 45; // bônus de combo
     
    //this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, 'YOU ARE A SUPER PLAYER! 🎉🤩🎉 +45 Combo!', {
     fontSize: '60px',
     fontFamily: 'Arial Black',
     color: '#b3fa0cff',
     stroke: '#0e0e0dff',
     strokeThickness: 10,
     align: 'center'
     }).setOrigin(0.5).setDepth(150).setAlpha(0);
     

     this.tweens.add({
     targets: comboText,
     alpha: 1,
     y: 440,
     duration: 500,
     yoyo: true,
     hold: 500,
     ease: 'Back.easeOut',
     onComplete: () => comboText.destroy()
    });
    }

  

    this.atualizarPontuacao('#00ff00'); // verde = acerto normal
    this.verificarMeta();
      if (this.vidaAtual < this.vidaMax) this.vidaAtual++;
    } else {
      const corretaExibir = corretaRaw;
      if (timedOut) {
        this.perguntaText.setText(`⌛ Tempo esgotado! Resp.: ${corretaExibir}`);this.sound.play('sfx_erro', { volume: 2.0 });this.combo = 0;
      } else {
        this.perguntaText.setText(`❌ Errado (resp.: ${corretaExibir})`);this.sound.play('sfx_erro', { volume: 2.0 });this.combo = 0;
      }
      if (this.vidaAtual > 0) this.vidaAtual--;
    }

    // Atualiza HUD do professor com fade+pulsar
      const frame = Math.max(0, this.vidaMax - this.vidaAtual); // 0 = sem dano
    // animação: fade out + pulsar -> trocar frame -> fade in
     this.tweens.add({
      targets: (this.professor, this.motorista),
      alpha: 1,
      scale: 1.05,
      duration: 450,
      ease: 'Sine.easeOut',
      
    onComplete: () => {
      try { this.professor.setFrame(frame); } catch (e) {}
      this.tweens.add({
        targets: (this.professor, this.motorista),
          alpha: 0,
          scale: 1.0,
          duration: 500,
          ease: 'Sine.easeIn'
     });
      }
    });
    

    // atualiza texto da vida
     if (this.vidaText) this.vidaText.setText('Vida: ' + this.vidaAtual);

    // se morreu, fim de jogo (reinicia cena após delay)
    if (this.vidaAtual <= 0) {
      this.perguntaText.setText('😢💀 O professor foi derrotado!');
      // esconde HUD por enquanto e reinicia em 2.5s
      this.toggleHUD(false);
      if (this.pontuacaoTimer) this.pontuacaoTimer.paused = true;
        // 🔥 CORREÇÃO: MUDAR PARA O ESTADO GAMEOVER E PARAR A MÚSICA 🔥
             if (this.bgMusic && this.bgMusic.isPlaying) {
    this.bgMusic.stop();
    }
     if (this.eventoObstaculos) {
     this.eventoObstaculos.remove(false); // para o loop sem destruir completamente
     this.eventoObstaculos = null;
    }

   // pausa movimento dos obstáculos existentes
     this.obstaculos.children.iterate((obs) => {
     if (obs.body) obs.body.setVelocityX(1000);
    });

     this.mudarEstado('GAMEOVER'); 
            
     return
    }

    // finaliza pergunta e inicia pausa (15s) antes da próxima
     this.finalizarPergunta();


   // FIM DE VALIDAR RESPOSTA
  }
  //INICIO DE GERAR OBSTACULO//
  gerarObstaculo() {
     // faixas fixas (ajuste conforme o Y real das lanes do carro)
     this.faixasY = [660, 800, 950];

    // inicializa controle das lanes ocupadas se ainda não existir
     if (!this.lanesOcupadas) {
     this.lanesOcupadas = [false, false, false];
    }

    // --- Escolhe uma faixa livre ---
      const lanesLivres = this.faixasY
     .map((y, i) => ({ y, i }))
     .filter(l => !this.lanesOcupadas[l.i]);

     if (lanesLivres.length === 0) return; // todas ocupadas, sai da função

    // sorteia uma lane livre
     const escolha = Phaser.Utils.Array.GetRandom(lanesLivres);
     const y = escolha.y;
     const laneIndex = escolha.i;
     this.lanesOcupadas[laneIndex] = true;

    // --- decide tipo de obstáculo ---
     const tipo = Phaser.Math.Between(1, 3);
     let key, x, velX;

     if (tipo === 1) {
    // estático: vem da direita para esquerda
     key = Phaser.Utils.Array.GetRandom(this.tiposEstaticos);
     x = 1920 + 100;
     velX = -Math.round(this.velocidadePista * 2.1);

    } else if (tipo === 2) {
    // dinâmico: um pouco mais rápido
     key = Phaser.Utils.Array.GetRandom(this.tiposDinamicos);
     x = 1920 + 100;
     velX = -Math.round(this.velocidadePista * 1.4);

    } else {
    // retro: vem de trás pra frente (pela esquerda)
     key = Phaser.Utils.Array.GetRandom(this.tiposRetro);
     x = -100;
     velX = Math.round(this.velocidadePista * 1.6);
    }

    // cria obstáculo
     const obs = this.obstaculos.create(x, y, key);
     obs.body.setAllowGravity(false);
     obs.setImmovable(true);
     obs.setCollideWorldBounds(false);
     if (obs.body) obs.body.velocity.x = velX;

    // --- AJUSTE DE PROFUNDIDADE AUTOMÁTICO ---
     obs.setDepth(y); // quanto maior o y, mais "à frente"

    // marca lane ocupada até que o obstáculo desapareça
     obs.on('destroy', () => {
     this.lanesOcupadas[laneIndex] = false;
    });

    // destrói automaticamente quando sair da tela
     this.time.delayedCall(15000, () => {
     if (obs.active && (obs.x < -200 || obs.x > 2200)) {
     obs.destroy();
    }
    });

   //FIM DE GERAR OBSTACULO//

  }
  // TRATAR COLISÃO COM OBSTÁCULO
  tratarColisao(obst) {

   this.combo = 0; // perde combo ao colidir
   this.tempoSemColisao = 0;

   if (this.invulneravel) return;
  // TOCA SOM DE COLISÃO
   this.sound.play('sfx_colisao', { volume: 2.0 }); 

    // 1. Aplica o Dano (acontece APENAS UMA VEZ por colisão)
     if (this.vidaAtual >= 0) {
     this.vidaAtual--;
    }
     this.invulneravel = true;

    

    // --- ANIMAÇÃO DE DANO E ATUALIZAÇÃO DOS 2 PERSONAGENS ---
     const novoFrame = Math.max(0, this.vidaMax - this.vidaAtual);
    
    // Aplicamos o mesmo novoFrame para o Motorista
    this.tweens.add({
     targets: [this.professor, this.motorista], // 🔥 ALVO DUPLO 🔥
     alpha: 0,
     scale: 1.3,
     duration: 300,
     ease: 'Sine.easeOut',
       onComplete: () => {
         this.professor.setFrame(novoFrame); // Atualiza Professor
         this.motorista.setFrame(novoFrame); // 🔥 ATUALIZA MOTORISTA 🔥
         this.tweens.add({
        targets: [this.professor, this.motorista],
          alpha: 1,
          scale: 1.0,
          duration: 400,
          ease: 'Sine.easeIn'
        });
        }
    });

  // se vida zerou, tratar fim de jogo
   if (this.vidaAtual <= 0) {
      this.perguntaText.setText('😢💀 O professor foi derrotado!'); 
      
      // esconde HUD por enquanto e reinicia em 2.5s
      this.toggleHUD(false);
        // 🔥 CORREÇÃO: MUDAR PARA O ESTADO GAMEOVER E PARAR A MÚSICA 🔥
             if (this.bgMusic && this.bgMusic.isPlaying) {
    this.bgMusic.stop();
   }
   if (this.eventoObstaculos) {
    this.eventoObstaculos.remove(false); // para o loop sem destruir completamente
    this.eventoObstaculos = null;
   }

    // pausa movimento dos obstáculos existentes
     this.obstaculos.children.iterate((obs) => {
     if (obs.body) obs.body.setVelocityX(1000);
    });
     this.mudarEstado('GAMEOVER'); 
     return; 
    }

    this.tempoSemColisao = 0;

  } //FIM DE TRATAR COLISÃO
  //INICIO DE UPDATE//
  update(time, delta) {

    if (!this.venceu && !this.invulneravel) {
     this.tempoSemColisao += delta;
    if (this.tempoSemColisao >= 2000) { // a cada 2 segundos
     this.pontuacao += 5;
     this.tempoSemColisao = 0;
     this.atualizarPontuacao();
     this.verificarMeta();
    }
  }

    this.car.setDepth(this.car.y);

    // movimento da faixa (parallax mais lento)
    if (this.faixa && this.faixa.tilePositionX !== undefined) {
      this.faixa.tilePositionX += 1;
    }

    // Movimento da cerca (parallax mais lento que a estrada)
    if (this.cerca && this.cerca.tilePositionX !== undefined) {
      this.cerca.tilePositionX += 3; // ajusta velocidade conforme desejar
    }

    // movimento da estrada
    if (this.road && this.road.tilePositionX !== undefined) {
      this.road.tilePositionX += 10;
    } else if (this.roadFallbackA && this.roadFallbackB) {
      this.roadFallbackA.x -= 8;
      this.roadFallbackB.x -= 8;
      if (this.roadFallbackA.x <= -960) this.roadFallbackA.x = this.roadFallbackB.x + 1920;
      if (this.roadFallbackB.x <= -960) this.roadFallbackB.x = this.roadFallbackA.x + 1920;
    }

     // === MOVIMENTO DOS OBSTÁCULOS ===
    this.obstaculos.children.each(obs => {
      if (obs.x < -200 || obs.x > 2120) {
      obs.destroy(); // remove quando sai da tela
    }
    });

  } // FIM DE UPDATE
  // VERIFICAÇÃO DA META DO JOGO
  verificarMeta() {
   if (this.venceu) return; // evita repetir

   if (this.pontuacao >= this.meta) {
    this.venceu = true;
    this.mostrarTelaVitoria();
  }
  // Exemplo de onde ocorre a verificação da pontuação
  }
  //ATUALIZAÇÃO DE PONTUAÇÃO
  atualizarPontuacao(cor = '#00ff00') {
   // Atualiza o texto
     this.scoreText.setText('Pontos: ' + this.pontuacao);

   // Aplica cor temporária e animação de brilho
     const corOriginal = '#ffffff';
     this.scoreText.setColor(cor);

     this.tweens.add({
     targets: this.scoreText,
     scale: 1.8,
     duration: 120,
     yoyo: true,
     ease: 'Sine.easeInOut',
     onComplete: () => this.scoreText.setColor(corOriginal)
    });
  }
  //MOSTRA TELA DE VITÓRIA
  mostrarTelaVitoria() {

    if (this.vitoriaAtiva) return; // evita múltiplas ativações
    this.vitoriaAtiva = true;
    // pausa perguntas e obstáculos temporariamente
    //this.time.paused = true;

    // imagem de vitória (coloque o arquivo em assets como "vitoria.png")
     const telaVitoria = this.add.image(960, 600, 'vitoria')
     .setOrigin(0.5)
     .setDepth(200)
     .setAlpha(0);

    // texto de pontuação
     const textoVitoria = this.add.text(960, 600, `Pontos: ${this.pontuacao}`, {
    fontSize: '70px',
     fontFamily: 'Arial Black',
     color: '#ffee00ff',
     stroke: '#000000ff',
     strokeThickness: 14,
    }).setOrigin(0.5).setDepth(201).setAlpha(0);
    

   // fade in
     this.tweens.add({
     targets: [telaVitoria, textoVitoria],
     alpha: 1,
     duration: 1000,
     ease: 'Sine.easeInOut'
    });

    if (this.audioJogo && this.audioJogo.isPlaying) this.audioJogo.stop();

    // toca trilha da vitória
     this.audioVitoria = this.sound.add('audio_vitoria', { volume: 6.0 });
     this.audioVitoria.play();

    // após 5 segundos, remove a tela e retoma o jogo
      this.time.delayedCall(5000, () => {
      this.tweens.add({
      targets: [telaVitoria, textoVitoria],
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        telaVitoria.destroy();
        textoVitoria.destroy();
        //this.time.pause = true;
        this.venceu = false; // permite continuar jogando
      } 
    });
    });
  }

} // FIM DA CENA

