class MeuJogo extends Phaser.Scene {
  constructor() {
    super({key: 'MeuJogo'});
        // ...
       this.bgMusic = null;    // letiável para a Música de Fundo
    this.motorSound = null; // letiável para o Som do Motor
    this.isAudioEnabled = false; // Permanece para controle de clique inicial
    }

  // ===============================================
  // === FUNÇÃO: MOSTRAR CRÉDITOS PROFISSIONAIS =====
  // ===============================================
mostrarCreditos = () => {

  // ====== CONFIGURAÇÕES GERAIS DE ESTILO ======
  const corTexto = '#FFFFFF';
  const corFundo = 0x000000;
  const corSombra = '#706a6aff';
  const tamanhoFonte = '46px';
  const tempoFade = 1000;       // ms (fade-in e fade-out)
  const tempoRolagem = 15000;  // ms (tempo para os créditos subirem)
  
  // ====== FUNDO PRETO EM FADE ======
  const fundo = this.add.rectangle(
    this.scale.width / 2,
    this.scale.height / 2,
    this.scale.width,
    this.scale.height,
    corFundo
  )
  .setDepth(900)
  .setAlpha(0);

  this.tweens.add({
    targets: fundo,
    alpha: 1,
    duration: tempoFade,
    ease: 'Sine.easeInOut'
  });


  // ====== LOGOS OPCIONAIS ======
  // Ajuste ou remova se não quiser logos
  const logoEscola = this.add.image(this.scale.width / 2 - 250, 180, 'logoEscola')
    .setDisplaySize(260, 130)
    .setOrigin(0.5)
    .setDepth(901);

  const logoEvento = this.add.image(this.scale.width / 2 + 250, 180, 'logoEvento')
    .setDisplaySize(260, 130)
    .setOrigin(0.5)
    .setDepth(901);


   // ============================================
   // 🔻 🔻 🔻  AQUI VOCÊ COLOCA O TEXTO DOS CRÉDITOS 🔻 🔻 🔻
   // ============================================
   const textoCreditos = `
   
   Math na Estrada: dirigindo pelos caminhos da matemática.


   FATEC CPS SP - 1º Semestre ADS. 

 
   2.  INTEGRANTES PROGRAMADORES.


   Alberto Sodré, alberto.santos12@fatec.sp.gov.br   


   Arthur vieira, arthur.vieira2@fatec.sp.gov.br  


   Felipe Lima, felipe.lima134@fatec.sp.gov.br 


   Kauã santos, kaua.santos22@fatec.sp.gov.br  


   Nicolas Lemes, nicolas.lemes2@fatec.sp.gov.br 


   Samuel Henrique, samuel.silva197@fatec.sp.gov.br 


   Recursos utilizados:

 
   google Gemini IA, 

 
   Open IA Chat GPT:  

 
   Edição de sprite sheet: https://www.finalparsec.com/tools/sprite_sheet_maker  


   Artes: https://br.freepik.com/  


   Artes: https://br.pinterest.com/  


   Artes: https://suno.com/home  

   
   Artes: https://sketchfab.com/feed  


   Edição de imagem: https://www.remove.bg/pt-br  


   Audio: https://online-audio-converter.com/pt/  


   Hospedagem do jogo online: https://github.com/  


   Arte e efeitos sonoros: https://pixabay.com/pt/  


   Codigo phaser.min.js: https://www.jsdelivr.com/  


   Ferramentas de edição e código: M.S visual studio, gnu gimp 3, M.S paint 3d. 


   Agradecimentos especiais


   Agradecemos de coração a oportunidade


   de participar deste evento,

 
   a toda equipe organizadora,
   

   a professora Diana e ao professor Adriano 


   por abraçar de verdade o evento, 


   e a todos os envolvidos e aos participantes, 


   que espero de verdade que curtam jogar o game


   tanto quanto nós curtimos construi-lo. 🤩
   






   "O MPOSSÍVEL É VENCIDO PELA OUSADIA DE ACREDITAR."
 
   `;

  // ============================================
  // ====== BLOCO DE TEXTO ======
  const bloco = this.add.text(
    this.scale.width / 2,
    this.scale.height + 2920,   // começa abaixo da tela
    textoCreditos,
    {
      fontSize: tamanhoFonte,
      fontFamily: 'Arial Black',
      color: corTexto,
      align: 'center',
      wordWrap: { width: this.scale.width - 200 }
    }
  )
  .setOrigin(0.5)
  .setDepth(902);

  bloco.setShadow(4, 4, corSombra, 6);


  // ====== ANIMAÇÃO DE ROLAGEM ======
  this.tweens.add({
    targets: bloco,
    y: -bloco.height,
    duration: tempoRolagem,
    ease: 'Linear',
    onComplete: () => fecharCreditos()
  });


  // ====== FUNÇÃO DE FECHAR (fade-out) ======
  const fecharCreditos = () => {
    this.tweens.add({
      targets: [fundo, bloco, logoEscola, logoEvento],
      alpha: 0,
      duration: tempoFade,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        fundo.destroy();
        bloco.destroy();
        logoEscola.destroy();
        logoEvento.destroy();
      }
    });
  };


  // ====== TOQUE OU CLIQUE ENCERRA ANTES ======
 this.time.delayedCall(250, () => {
  this.input.once('pointerdown', () => fecharCreditos());
});
  }
   // ===============================================
   // --- FUNÇÕES AUXILIARES DE ESTADO ---
   // ===============================================
  mudarEstado(novoEstado) {
   this.gameState = novoEstado;
        
    const isPlaying = novoEstado === 'JOGANDO';
        
      if (this.introGroup) this.introGroup.setVisible(novoEstado === 'INTRO');

      
      if (this.gameOverGroup) this.gameOverGroup.setVisible(novoEstado === 'GAMEOVER');

      console.log = novoEstado;
        
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

      const btnRestart = this.add.image(centerX - 600, centerY + 250, 'restart')
       .setOrigin(0.5)
       .setInteractive()
       .setDepth(101);

      const btnCreditos = this.add.image(centerX + 600, centerY + 250, 'creditos')
       .setOrigin(0.5)
        .setInteractive()
        .setDepth(101);

    // === BOTÃO CRÉDITOS ===


    btnCreditos.on('pointerdown', () => {
      this.mostrarCreditos();
    });
     
    this.gameOverGroup.add(btnRestart);
    this.gameOverGroup.add(btnCreditos);

    btnRestart.on('pointerdown', () => {
    window.location.reload(); // Opção mais simples para reiniciar a página inteira
  });
      
  }
  // ===============================================
  //INICIO DO CREATE
  // ===============================================
  create() {

     this.jogoAtivo = true;
     this.score = 0;

     //=== tecla F - fullscreen===
     this.input.keyboard.on('keydown-F', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    });

    // === SISTEMA DE PONTUAÇÃO ===
     this.pontuacao = 0;
     this.meta = 1000;
     this.venceu = false;
     this.combo = 0; // acertos consecutivos
     this.tempoSemColisao = 0;

       // === HUD DE PONTUAÇÃO ===

    //=== Fundo da pontuação ===
     this.pontosFundo = this.add.image(960, 80, 'pontos') // centralizado no topo
     .setOrigin(0.5)
     .setDepth(100); // acima da pista e do carro

   //=== Texto da pontuação sobre o fundo ===
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

     if (UserActivation) {this.sound.play('bgmusic', { volume: 0.15, loop: true })
      };  //=== INICIA SOM APOS INTERAÇÃO DO USUARIO ===
   
    // --- CONFIG INICIAL ---
    this.cameras.main.setBackgroundColor('#87CEEB'); // fallback cor do céu

    // === FUNDO ===
    if (this.textures.exists('fundo')) {
      const bg = this.add.image(960, 540, 'fundo').setDisplaySize(1920, 1080);
      bg.setDepth(0);
    } else {
      this.add.rectangle(960, 540, 1920, 1080, 0x87CEEB).setOrigin(0.5).setDepth(0);
    }

    // === ESTRADA (obter dimensões reais) ===
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
      this.tiposDinamicos = ['obs_dinamico1', 'obs_dinamico2', 'obs_dinamico3', 'obs_dinamico4'];
      this.tiposRetro = ['obs_retro1', 'obs_retro2', 'obs_retro3', 'obs_retro4','obs_retro5'];

    // velocidade da pista — usada pelos obstáculos
      this.velocidadePista = 300;

    // faixas Y (para os obstáculos se alinharem às 3 faixas da estrada)
      this.faixasY = [roadY - roadHeight / 4, roadY, roadY + roadHeight / 4];


    // evento que gera obstáculos de forma periódica
     this.eventoObstaculos = this.time.addEvent({
     delay: 2500,
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


    // === ESTRADA (tileSprite) ===
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

    // === DEFINIÇÃO DAS COORDENADAS FIXAS DAS FAIXAS (LANES) ===
    // Y's EXATOS que você precisa: 660, 800, 950
    this.carLanes = [610, 710, 800]; // Índice 0 = topo, 1 = meio, 2 = baixo

    this.currentLane = 1; // Começa na faixa do meio (índice 1)


    // === CARRO (Physics Sprite) ===
     const carX = 655; // Seu X fixo
     const carY = this.carLanes[this.currentLane]; // Posição Y é a do centro da Faixa 2 (800)

     if (this.textures.exists('carro')) {
      this.car = this.physics.add.sprite(carX, carY, 'carro').setDepth(11).setScale(1.0);
      this.car.body.setAllowGravity(false);
      this.car.setImmovable(true);
      this.car.body.setSize(this.car.width * 0.4, this.car.height * 0.4, true); // tamanho do hitbox do carro

    // descobre número de frames
      let carFrameCount = 1;
      try {
      const ct = this.textures.get('carro');
      const img = ct.getSourceImage ? ct.getSourceImage() : (ct.source && ct.source[0] && ct.source[0].image);
      if (img && img.width) {
      
     // TAMANHO DE CADA SPRITE DO CARRO
     //const fw = 461, fh = 277; // TAMANHO CARRO AMARELO VELHO
      const fw = 461, fh = 276;
      const cols = Math.max(1, Math.floor(img.width / fw));
      const rows = Math.max(1, Math.floor(img.height / fh));
      carFrameCount = cols * rows;
    }
    } catch (e) {}
      this.anims.create({
     key: 'dirigir',
     frames: this.anims.generateFrameNumbers('carro', { start: 0, end: Math.max(0, carFrameCount - 1) }),
     frameRate: 10,
     repeat: -1
    });
     
      this.car.play('dirigir');
     } else {
      this.car = this.physics.add.rectangle(carX, carY, 180, 90, 0xff0000).setDepth(11);
      this.car.setImmovable(true);
    }

    // === COLISÃO COM OBSTÁCULOS (CORRETO) ===
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

    // 📜--- LISTA DE PEERGUNTAS ---
    this.perguntas = [
  { q: 'quanto vale, 3 x 3 = ?', a: '9', b: '16', c: '6', d: '99'},
  { q: 'quanto vale, 4 x 4 = ?', a: '16', b: '8', c: '12', d: '20'},
  { q: 'Quanto vale, 5 x 5 = ?', a: '25', b: '10', c: '20', d: '30'},
  { q: 'Quanto vale, 6 x 6 = ?', a: '36', b: '12', c: '30', d: '42'},
  { q: 'Quanto vale, 7 x 7 = ?', a: '49', b: '14', c: '42', d: '56'},
  { q: 'Quanto vale, 8 x 8 = ?', a: '64', b: '16', c: '56', d: '72'},
  { q: 'Quanto vale, 9 x 9 = ?', a: '81', b: '18', c: '72', d: '90'},
  { q: 'Quanto vale, 3 x 3 = ?', a: '9', b: '6', c: '12', d: '33'},
  { q: 'Um carro percorre 60 km em 2 horas. Qual a velocidade média?', a: '30', b: '120', c: '60', d: '2'},
  { q: 'Se um triângulo tem lados 3, 4 e 5, qual é o perímetro?', a: '12', b: '60', c: '7', d: '9'},
  { q: 'Uma caixa contém 12 maçãs. João comeu 4. Quantas maçãs sobraram?', a: '8', b: '12', c: '4', d: '16'},
  { q: 'Qual é a área de um retângulo de base 5 e altura 3?', a: '15', b: '8', c: '16', d: '30'},
  { q: 'Uma fábrica produz 150 peças em 5 horas. Quantas peças produz em 1 hora?', a: '30', b: '150', c: '750', d: '25'},
  { q: 'Resolva para x: 3x + 5 = 20', a: '5', b: '15', c: '8', d: '3'},
  { q: 'Se um número aumentado de 7 dá 15, qual é esse número?', a: '8', b: '15', c: '7', d: '22'},
  { q: 'Qual o valor de 25% de 80?', a: '20', b: '25', c: '40', d: '8'},
  { q: 'Qual a média entre os números 10, 12 e 14?', a: '12', b: '10', c: '14', d: '36'},
  { q: 'Qual é o resultado de 4² + 2²?', a: '20', b: '12', c: '36', d: '16'},
  { q: 'A soma de dois números é 30, um é 18. Qual o outro?', a: '12', b: '18', c: '30', d: '48'},
  { q: 'Se 5x = 35, qual o valor de x?', a: '7', b: '5', c: '30', d: '35'},
  { q: 'Qual é o menor número primo?', a: '2', b: '1', c: '0', d: '3'},
  { q: 'Um ângulo reto mede quantos graus?', a: '90', b: '180', c: '45', d: '100'},
  { q: 'Se um livro custa 20 e está com 10% de desconto, qual o preço final?', a: '18', b: '2', c: '22', d: '19'},
  { q: 'Qual o número inverso de 1/5 ?', a: '5', b: '1/5', c: '-5', d: '0.5'},
  { q: 'A área de um quadrado é 49. Qual o lado do quadrado?', a: '7', b: '49', c: '12.25', d: '9'},
  { q: 'Qual o valor de x em : 2x - 7 = 9', a: '8', b: '16', c: '1', d: '9'},
  { q: 'Se um tanque tem 100 litros e está cheio até 75%, quantos litros tem?', a: '75', b: '100', c: '25', d: '50'},
  { q: 'Qual o resultado de √81?', a: '9', b: '81', c: '40.5', d: '7'},
  { q: 'Quanto é 20% de 50?', a: '10', b: '20', c: '50', d: '5'},
  { q: 'Um triângulo tem um ângulo de 50º e outro de 60º. Qual o terceiro?', a: '70', b: '110', c: '180', d: '60'},
  { q: 'Qual o perímetro de um quadrado com lado 10?', a: '40', b: '100', c: '20', d: '10'},
  { q: 'Se uma passagem custa 15 e você tem 50, quantas passagens pode comprar?', a: '3', b: '4', c: '5', d: '2'},
  { q: 'Qual a fração que representa 25% (arredonde resposta)?', a: '1/4', b: '1/2', c: '1/3', d: '1/5'},
  { q: 'Qual é o resultado da expressão: 10 - (2 + 3)?', a: '5', b: '15', c: '9', d: '10'},
  { q: 'Que número multiplicado por 6 dá 42?', a: '7', b: '6', c: '8', d: '48'},
  { q: 'Se um ângulo mede 135º, é ( 1 ) agudo, ( 2 ) reto, ou ( 3 ) obtuso?', a: '3', b: '1', c: '2', d: ''},
  { q: 'Quantos segundos tem 3 minutos?', a: '180', b: '60', c: '300', d: '3'},
  { q: 'Se uma camisa custa 50 e tem 20% de desconto, qual o preço final?', a: '40', b: '10', c: '30', d: '45'},
  { q: 'Qual a fração equivalente a 0,75 ?', a: '3/4', b: '1/16', c: '1/2', d: '75/2'},
  { q: 'Um triângulo retângulo tem catetos 6 e 8. Qual a hipotenusa?', a: '10', b: '14', c: '48', d: '100'},
  { q: 'Qual o número de lados de um hexágono?', a: '6', b: '5', c: '7', d: '8'},
  { q: 'Todo número elevado ao expoente 0 é igual a ?', a: '1', b: '0', c: 'Ele mesmo', d: '10'},
  { q: 'Qual o valor de x em 5x = 25?', a: '5', b: '20', c: '25', d: '125'},
  { q: 'Se a temperatura cai de 30 para 15, qual foi a variação?', a: '-15', b: '15', c: '45', d: '30'},
  { q: 'Quanto vale a soma dos ângulos internos de um triângulo?', a: '180', b: '90', c: '360', d: '100'},
  { q: 'Qual probabilidade em % de sair cara em um jogo de cara ou coroa ?', a: '50', b: '100', c: '25', d: '0'},
  { q: 'Qual o valor da área do quadrado de lado 12?', a: '144', b: '48', c: '24', d: '12'},
  { q: 'Quanto é 4 × 7?', a: '28', b: '11', c: '24', d: '32'},
  { q: 'Um tanque tem dimensões 5x4x3. Qual o volume do tanque?', a: '60', b: '12', c: '47', d: '30'},
  { q: 'Se um produto custa 120 e aumenta 10%, quanto passa a custar?', a: '132', b: '130', c: '12', d: '120'},
  { q: 'Qual a raiz quadrada de 64?', a: '8', b: '4', c: '16', d: '32'},
  { q: 'Em uma compra de 5 itens, cada um custa 8, qual seria o total?', a: '40', b: '13', c: '45', d: '35'},
  { q: 'Em uma sala com 20 alunos, 5 tem 16 anos, 8 tem 17 anos e 7 tem 15. Qual a MODA da idade dos alunos?', a: '17', b: '25', c: '15', d: '50'},
  { q: 'Calcule a média de 7, 8 e 9?', a: '8', b: '7', c: '9', d: '24'},
  { q: 'Um retângulo tem perímetro 24 e base 7. Qual a altura?', a: '5', b: '17', c: '14', d: '10'},
  { q: 'Qual a da raiz cúbica de 27?', a: '3', b: '9', c: '6', d: '13.5'},
  { q: 'Se 3/4 de uma pizza foi comida, qual a fração que sobra ?', a: '1/4', b: '3/4', c: '4/3', d: '1/3'},
  { q: 'Quantos minutos tem meia hora?', a: '30', b: '60', c: '15', d: '50'},
  { q: 'Qual é o número primo seguinte a 7?', a: '11', b: '9', c: '13', d: '10'},
  { q: 'Em uma sala com 20 alunos, 5 estavam ausentes. Qual a porcentagem dos alunos presentes ?', a: '75', b: '25', c: '15', d: '80'},
  { q: 'Quantas diagonais tem um quadrado?', a: '2', b: '1', c: '4', d: '8'},
  { q: 'Se um quadrado tem lado 9, qual seu perímetro?', a: '36', b: '81', c: '18', d: '27'},
  { q: 'Qual é o valor de 15 - 7 + 3?', a: '11', b: '5', c: '19', d: '10'},
  { q: 'Um telefone custa 100 e tem desconto de 15%. Qual o preço final?', a: '85', b: '15', c: '115', d: '90'},
  { q: 'Se a velocidade de um carro é 90km/h, quantos km percorre em 2 horas?', a: '180', b: '90', c: '45', d: '270'},
  { q: 'Qual a área de um triângulo com base 10 e altura 6?', a: '30', b: '60', c: '16', d: '20'},
  { q: 'Qual o resultado de 8 × 7?', a: '56', b: '15', c: '48', d: '64'},
  { q: 'Se um triângulo tem dois catetos 5 e 12, qual a hipotenuza se esse triangulo for retângulo?', a: '13', b: '17', c: '7', d: '60'},
  { q: 'Qual o valor de 13 + 24?', a: '37', b: '11', c: '36', d: '47'},
  { q: 'Um número dividido por 4 é 7. Qual é o número?', a: '28', b: '1.75', c: '11', d: '24'},
  { q: 'Quanto é 10% de 50?', a: '5', b: '10', c: '50', d: '25'},
  { q: 'Qual o resultado da operação 9²?', a: '81', b: '18', c: '9', d: '72'},
  { q: 'Um círculo tem diâmetro 10. Qual o raio?', a: '5', b: '10', c: '20', d: '3,14'},
  { q: 'Qual é o menor número natural?', a: '0', b: '1', c: '-1', d: '2'},
  { q: 'Um PENTÁGONO,é um polígono com quantos lados?', a: '5', b: '6', c: '7', d: '4'},
  { q: 'Qual o valor de X quando 2(x - 3) = 8 ?', a: '7', b: '4', c: '5.5', d: '10'},
  { q: 'Qual a área de um quadrado com lado 11 ?', a: '121', b: '44', c: '22', d: '11'},
  { q: 'Qual a fração que corresponde a 50% (arredonde)?', a: '1/2', b: '1/3', c: '1/4', d: '1/5'},
  { q: 'Um pacote tem 24 balas e é dividido entre 6 crianças igualmente. Quantas balas cada uma recebe?', a: '4', b: '6', c: '30', d: '144'},
  { q: 'Qual a raiz quadrada de 100 ?', a: '10', b: '50', c: '100', d: '20'},
  { q: 'Qual o valor de 3x se x=4 ?', a: '12', b: '7', c: '34', d: '4/3'},
  { q: 'Qual é o número seguinte a 99 ?', a: '100', b: '98', c: '101', d: '199'},
  { q: 'Uma loja vendeu 120 produtos em 4 dias. Qual a média diária ?', a: '30', b: '120', c: '480', d: '40'},
  { q: 'Se aumentarmos 10% em 50, qual o novo valor?', a: '55', b: '50', c: '60', d: '45'},
  { q: 'Uma caixa tem 5 pacotes de arroz. Se 2 pacotes são usados, quantos sobram ?', a: '3', b: '2', c: '5', d: '7'},
  { q: 'Qual o valor do perímetro de um triângulo com lados 6, 7 e 8?', a: '21', b: '168', c: '15', d: '20'},
  { q: 'Qual o volume de um cubo de aresta 3 ?', a: '27', b: '9', c: '18', d: '3'},
  { q: 'Qual é o ângulo complementar de 40º ?', a: '50', b: '140', c: '40', d: '90'},
  { q: 'Se x + 3 = 10, qual o valor de x?', a: '7', b: '13', c: '10', d: '3'},
  { q: 'Qual o valor de 5³ ?', a: '125', b: '15', c: '25', d: '50'},
  { q: 'Quanto é 100 menos 35 ?', a: '65', b: '75', c: '135', d: '55'},
  { q: 'Se um tanque tem 250 e já está com 100, quanto falta para encher?', a: '150', b: '250', c: '100', d: '350'},
  { q: 'Quantos anagramas tem a palavra MATEMÁTICA ?', a: '7', b: '10', c: '151200', d: '3'},
  { q: 'Pedro tem 20 anos e seu irmão caçula nasceu hoje🥰. Com que idade pedro terá o dobro da idade do irmão caçula? ', a: '40', b: '20', c: '30', d: '39'},
  { q: 'Quanto vale 3! ?', a: '6', b: '3', c: '9', d: '1'},
  { q: 'Quanto vale 5# ?', a: '30', b: '120', c: '25', d: '15'},
  { q: 'Quanto vale a raiz quadrada de 36 ?', a: '6', b: '18', c: '12', d: '3'},
  { q: 'Uma sacola com uma dúzia de laranjas, contém quantas laranjas no total?', a: '12', b: '10', c: '6', d: '24'},
  { q: 'De quantas formas diferentes podemos organizar os anagramas da palavra: SAPO ?', a: '24', b: '4', c: '16', d: '12'},
  { q: 'Quanto vale, 10 - 4 = ?', a: '6', b: '14', c: '5', d: '7'},
  { q: 'Quanto vale a soma dos ângulos internos de um triângulo qualquer ?', a: '180', b: '90', c: '360', d: '120'},
  { q: 'Quanto vale, 7 x 2 = ?', a: '14', b: '9', c: '5', d: '16'},
  { q: 'Quanto vale, 9 - 12 = ?', a: '-3', b: '3', c: '21', d: '-2'},
  { q: 'Quanto é log de 64 na base 8 ? Dica: leia como: Qual o expoente que transforma a base 8 em 64.', a: '2', b: '8', c: '4', d: '16'},
  { q: 'Qual a raiz quadrada de 9 ?', a: '3', b: '81', c: '4.5', d: '18'},
  { q: 'Quando eu tinha 4 anos a idade do meu irmão tinha o dobro da minha idade. Se hoje meu irmão tem 20 anos, qual a minha idade agora?', a: '16', b: '20', c: '10', d: '24'},
  { q: 'Uma compra custa 7,50. Você paga com 10 e a balconista pede 2,50 para facilitar. Quanto de troco você deve receber?', a: '5', b: '2.50', c: '7.50', d: '0'},
  { q: 'O pai de Maria foi passear com 3 filhas: Joana, Sofia e Andrea. Quantas filhas tem o pai de Maria?', a: '4', b: '3', c: '1', d: '5'},
  { q: 'Quanto é log10 ? dica: quando a base for omitida, base = 10).', a: '1', b: '10', c: '0', d: '100'},
  { q: 'Quanto vale x na equação: x/3 + 6 = 10 ?', a: '12', b: '4', c: '24', d: '10'},
  { q: 'Quando pedro nasceu seu pai tinha 33 anos, hoje o pai de Pedro tem 40. qual idade pedro tem hoje ?', a: '7', b: '33', c: '40', d: '10'},
  { q: 'Qual é o inverso de 1/4 ?', a: '4', b: '1/4', c: '-4', d: '0.25'},
  { q: 'Quando Diana completou 15 anos sua tia tinha o dobro de sua idade. Hoje Diana tem 30 anos, que idade tem hoje a tia de Diana? ', a: '60', b: '30', c: '45', d: '40'},
  { q: 'Quanto vale, 2 - 4 = ?', a: '-2', b: '2', c: '6', d: '-6'},
  { q: 'Eu tinha 10 laranjas, vendi 1/2 por 5 cada uma. Quanto recebi?', a: '25', b: '50', c: '10', d: '5'},
  { q: 'Em um Triângulo retângulo, se os catetos medem 6cm e 8cm. Quantos cm mede a Hipotenusa?', a: '10', b: '14', c: '28', d: '100'},
  { q: 'Quanto é o log de x²+4x+4 na base (x+2)?', a: '2', b: '1', c: 'x+2', d: '4'},
  { q: 'Perímetro de um quadrado cuja área é 9 cm²?', a: '12', b: '9', c: '3', d: '36'},
  { q: 'Quanto é a divisão do perímetro pelo diâmetro de qualquer circunferência?', a: '3,14', b: '3', c: '6.28', d: '1'},
  { q: 'Quantas partes de 1/4 cabem em 1 inteiro?', a: '4', b: '1', c: '2', d: '8'},
  { q: 'Qual é a quarta parte de 100', a: '25', b: '4', c: '100', d: '50'},
  ];
    // Ativar tela cheia (somente mobile)
if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
  this.input.once('pointerdown', () => {
    if (!this.scale.isFullscreen) {
      this.scale.startFullscreen();
    }
  });
}
    if (!this.scale.isFullscreen) {
  try {
    this.scale.startFullscreen();
  } catch (e) {
    console.warn("O navegador bloqueou o fullscreen automático. Toque na tela para ativar.");
  }
}
    
    // =========================
// CONTROLE DE MOVIMENTO
// =========================

// --- DESKTOP (scroll do mouse) ---
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

  // Movimento suave
  this.tweens.add({
    targets: this.car,
    y: this.carLanes[this.currentLane], // O carro vai para o Y da faixa escolhida
    duration: 250,
    ease: 'Sine.easeInOut'
  });
});


// --- MOBILE (gesto de deslizar vertical) ---
this.input.on('pointerdown', (pointer) => {
  this.startY = pointer.y;
});

this.input.on('pointerup', (pointer) => {
  const deltaY = pointer.y - this.startY;
  const minLane = 0;
  const maxLane = this.carLanes.length - 1;

  if (deltaY < -50) {
    // deslizou para cima
    this.currentLane = Math.max(minLane, this.currentLane - 1);
  } else if (deltaY > 50) {
    // deslizou para baixo
    this.currentLane = Math.min(maxLane, this.currentLane + 1);
  }

  // Movimento suave (mesmo tween usado no PC)
  this.tweens.add({
    targets: this.car,
    y: this.carLanes[this.currentLane],
    duration: 250,
    ease: 'Sine.easeInOut'
  });
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

    //=== inicia HUD invisível===
      this.hud.setAlpha(0);
     this.professor.setAlpha(0);
     this.lousa.setAlpha(0);
     this.perguntaText.setAlpha(0);
     this.respostaText.setAlpha(0);

    // === TEMPORIZADORES e LÓGICA DE PERGUNTAS ===
     this.tempoResposta = 25000; // 25s para responder
     this.tempoPausa = 7000;    // 6s de pausa entre perguntas
     this.timerPergunta = null;
     this.perguntaAtiva = false;
     this.respostaAtual = '';

    //=== função que escolhe e mostra nova pergunta MULTIPLA ESCOLHA, BOTÕES HORIZONTAIS) ===
this.novaPergunta = () => {

  // sorteia uma pergunta válida
  let idx = Phaser.Math.Between(0, this.perguntas.length - 1);
  let attempts = 0;
  while ((this.perguntas[idx].q === '' || this.perguntas[idx].q == null) && attempts < 10) {
    idx = Phaser.Math.Between(0, this.perguntas.length - 1);
    attempts++;
  }

  this.perguntaAtual = idx;
  const perguntaAtual = this.perguntas[this.perguntaAtual];

  // Mostra texto da pergunta
  this.perguntaText.setText(perguntaAtual.q);
  this.perguntaAtiva = true;
  this.toggleHUD(true);
  //this.agendarPausa();


  // limpa botões antigos se existirem
  if (this.opcoesGroup) this.opcoesGroup.clear(true, true);
  else this.opcoesGroup = this.add.group();

  // embaralha alternativas
  const alternativas = Phaser.Utils.Array.Shuffle([
    { texto: perguntaAtual.a, correta: true },
    { texto: perguntaAtual.b, correta: false },
    { texto: perguntaAtual.c, correta: false },
    { texto: perguntaAtual.d, correta: false },
  ]);

  // === CONTROLE DE POSICIONAMENTO ===
  const centerX = this.scale.width / 2;
  const baseY = this.scale.height - 635; // altura dos botões
  const espacamento = 185; // distância entre botões
  const tamanhoBotao = 60; // largura aproximada para centralizar imagens depois

  // === CRIA OS BOTÕES ===
  alternativas.forEach((alt, i) => {
    // posição horizontal (4 botões centralizados)
    const posX = centerX - (espacamento * 1.5) + (i * espacamento);
    
    const botao = this.add.image(posX, baseY, 'imgBotaoPadrao')
  .setDisplaySize(130, 75)
  .setInteractive({ useHandCursor: true })
  .setDepth(80);

    // --- PLACEHOLDER: botão retangular ---
    // const botao = this.add.rectangle(posX, baseY, 130, 75, 0xffffff, 0.25)
    //   .setStrokeStyle(4, 0x000000)
    //   .setInteractive({ useHandCursor: true })
    //   .setDepth(80);

    // --- TEXTO TEMPORÁRIO ---
    const label = this.add.text(posX, baseY, alt.texto, {
      fontSize: '42px',
      fontFamily: 'Arial Black',
      color: '#fcfcfcff',
      align: 'center',
      wordWrap: { width: 200 },
    }).setOrigin(0.5).setDepth(81);

    // grupo pra manipular junto
    this.opcoesGroup.addMultiple([botao, label]);

    // --- INTERAÇÃO ---
    botao.on('pointerdown', () => {
      this.validarResposta(false, alt.texto);
    });
    label.on('pointerdown', () => {
      this.validarResposta(false, alt.texto);
    });

    // efeito visual de toque
    // botao.on('pointerover', () => botao.setFillStyle(0xffff99, 0.5));
    // botao.on('pointerout', () => botao.setFillStyle(0xffffff, 0.25));
  });

  // limpa timer anterior
  if (this.timerPergunta) this.timerPergunta.remove();

  // inicia timer (25s)
  this.timerPergunta = this.time.delayedCall(this.tempoResposta, () => {

    this.validarResposta(true); // tempo esgotado
  });
};

    //=== finalizar pergunta: chamado após validar resposta (acertou/errou) e inicia pausa de 15s ===
     this.finalizarPergunta = () => {
    // garante cancelar timer
      if (this.timerPergunta) {
        this.timerPergunta.remove();
        this.timerPergunta = null;
         // Limpa e esconde o input
      
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
  // =============================================== 
  //VERIFICA A RESPOSTA
  // ===============================================
  validarResposta(timedOut = false, respostaTexto = '') {
  if (!this.perguntaAtiva) return;
  this.perguntaAtiva = false;

  if (this.timerPergunta) {
    this.timerPergunta.remove();
    this.timerPergunta = null;
  }

  // remove os botões de alternativas
  if (this.opcoesGroup) this.opcoesGroup.clear(true, true);

  const corretaRaw = this.perguntas[this.perguntaAtual].a;
  const respostaRaw = (respostaTexto || '').toString().trim();

  let acertou = false;
  if (!timedOut) {
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
  // ===============================================
   //INICIO DE GERAR OBSTACULO
   // ===============================================
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
     velX = -Math.round(this.velocidadePista * 2 );

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
  // ===============================================
  // TRATAR COLISÃO COM OBSTÁCULO
  // ===============================================
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
    // this.invulneravel = true;

    

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

  }//FIM DE TRATAR COLISÃO
  // ===============================================
  //INICIO DE UPDATE//
  // ===============================================
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

  }// FIM DE UPDATE
  // ===============================================
  // VERIFICAÇÃO DA META DO JOGO
  // ===============================================
  verificarMeta() {
   if (this.venceu) return; // evita repetir

   if (this.pontuacao >= this.meta) {
    this.venceu = true;
    this.mostrarTelaVitoria();
  }
  // Exemplo de onde ocorre a verificação da pontuação
  }
  // ===============================================
  //ATUALIZAÇÃO DE PONTUAÇÃO
  // ===============================================
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
  // ===============================================
  //MOSTRA TELA DE VITÓRIA
  // ===============================================
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

} //=== FIM DA CENA===