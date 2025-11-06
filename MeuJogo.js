class MeuJogo extends Phaser.Scene {
  constructor() {
    super({key: 'MeuJogo'});
    
    // ...

   
    this.bgMusic = null;    // letiável para a Música de Fundo
    this.motorSound = null; // letiável para o Som do Motor
    this.isAudioEnabled = false; // Permanece para controle de clique inicial
  
  }

  
  // CARREGAMENTO DE IMAGENS E SOM 
  preload() {
  
    // --- 1. CONFIGURAÇÃO DA BARRA DE CARREGAMENTO ---
   let progressBar = this.add.graphics();
   let progressBox = this.add.graphics();
   progressBox.fillStyle(0xffffff, 0.8);
   progressBox.fillRect(470, 500, 980, 50);

   // ... código de texto e porcentagem ...
        
   this.load.on('progress', function (value) {// ... código de atualização da barra ...
    });
        
    this.load.on('complete', function () {   // ... código para destruir a barra ...
    });

    // --- 2. CARREGAMENTO DE ASSETS ---
        
    // IMAGENS DE CENÁRIO E HUD
    
    this.load.image('intro_bg', 'assets/intro_bg.png'); // Para a tela INTRO
    this.load.image('fundo', 'assets/fundo.png');
    this.load.image('paisagem', 'assets/faixa.png');
    this.load.image('estrada', 'assets/estrada.png');
    this.load.image('moldura', 'assets/moldura.png');
    this.load.image('lousa', 'assets/lousa.png');
    this.load.image('cerca', 'assets/cerca.png');
    this.load.image('gameover_screen', 'assets/gameover_screen.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('creditos', 'assets/creditos.png');
    this.load.image('tela_creditos', 'assets/banner.jpg');
    this.load.image('vitoria', 'assets/vitoria.png');
    this.load.image('pontos', 'assets/pontos.png');
    

    // SPRITESHEETS
   this.load.spritesheet('carro', 'assets/carro.png', {
    frameWidth: 476,
    frameHeight: 276
  });
   this.load.spritesheet('professor', 'assets/professor.png', {
    frameWidth: 450,
    frameHeight: 450
  });
    this.load.spritesheet('motorista', 'assets/moto.png', {
    frameWidth: 450,
    frameHeight: 450
  });
        
    // OBSTÁCULOS (10 TIPOS) - Usando suas chaves e nomes confirmados
    for (let i = 1; i <= 4; i++) {
    this.load.image(`obs_estatico${i}`, `assets/obstaculos/estatico${i}.png`);
    }
    for (let i = 1; i <= 3; i++) {
    this.load.image(`obs_dinamico${i}`, `assets/obstaculos/dinamico${i}.png`);
    this.load.image(`obs_retro${i}`, `assets/obstaculos/retro${i}.png`);
    }

    // ÁUDIOS DE FUNDO E SFX (Sem a lógica de 2s que causava o crash)
    this.load.audio('bgmusic', ['assets/audio/bgmusic.mp3', 'assets/audio/bgmusic.ogg']);
    this.load.audio('motorsound', ['assets/audio/motorsound.mp3', 'assets/audio/motorsound.ogg']);
    this.load.audio('sfx_acerto', ['assets/audio/sfx_acerto.mp3', 'assets/audio/sfx_acerto.ogg']); 
    this.load.audio('sfx_erro', ['assets/audio/sfx_erro.mp3', 'assets/audio/sfx_erro.ogg']);
    this.load.audio('sfx_colisao', ['assets/audio/sfx_colisao.mp3', 'assets/audio/sfx_colisao.ogg']);
    this.load.audio('audio_vitoria', ['assets/audio/audio_vitoria.mp3', 'assets/audio/audio_vitoria.ogg']);
    
    // FIM DO PRELOAD
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
      duration: 30000,
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
       
  toggleHUD = (mostrar) => {
   const alvoAlpha = mostrar ? 1 : 0;
   const targets = [this.hud, this.professor, this.motorista, this.vidaText, this.lousa, this.perguntaText, this.respostaText];
   const validTargets = targets.filter(t => t);
   this.tweens.add({ targets: validTargets, alpha: alvoAlpha, duration: 700, ease: 'Sine.easeInOut' });
  };

    
  //INICIO DO CREATE
  create() {

     this.jogoAtivo = true;
     this.score = 0;


    // === SISTEMA DE PONTUAÇÃO ===
     this.pontuacao = 0;
     this.meta = 800;
     this.venceu = false;
     this.combo = 0; // acertos consecutivos
     this.tempoSemColisao = 0;

    // // Exibe a pontuação no canto superior direito
    //  this.scoreText = this.add.text(1820, 40, 'Pontos: 0', {
    //  fontSize: '36px',
    //  color: '#ffffff',
    //  fontStyle: 'bold',
    //  stroke: '#000000',
    //  strokeThickness: 4
    // }).setOrigin(1, 0).setDepth(50);

    // === HUD DE PONTUAÇÃO ===

    // Fundo da pontuação
     this.pontosFundo = this.add.image(960, 85, 'pontos') // centralizado no topo
     .setOrigin(0.5)
     .setDepth(100); // acima da pista e do carro

   // Texto da pontuação sobre o fundo
     this.scoreText = this.add.text(960, 85, 'Pontos: 0', {
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
      backgroundColor: '#000000b0',
      padding: { x: 30, y: 30 },
      align: 'center'
    }).setOrigin(0.5).setDepth(23);

    // --- LISTA DE PEERGUNTAS ---
      this.perguntas = [
        // as perguntas adicionadas seguem esse padrão elementar ' {q: 'pergunta', a: 'resposta'}, '
      { q: 'Quanto vale, 5 + 3 = ?', a: '8' },
      { q: 'quanto vale, 4 x 4 = ?', a: '16'},
      { q: 'Quanto vale, 5 x 5 = ?', a: '25'},
      { q: 'Quanto vale, 6 x 6 = ?', a: '36'},
      { q: 'Quanto vale, 7 x 7 = ?', a: '49'},
      { q: 'Quanto vale, 8 x 8 = ?', a: '64'},
      { q: 'Quanto vale, 9 x 9 = ?', a: '81'},
      { q: 'Quanto vale, 3 x 3 = ?', a: '9'},
      { q: 'Quantos anagramas tem a palavra MATEMÁTICA ?', a: '7'},
      { q: 'Quanto vale 3! ?', a: '6'},
      { q: 'Quanto vale 5# ?', a: '30'},
      { q: 'Quanto vale a raiz quadrada de 36 ?', a: '6'},
      { q: 'Uma sacola com uma dúzia de laranjas, tem quanta laranjas no total?', a: '12'},
      { q: 'De quantas formas diferentes podemos organizar os anagramas da palavra: SAPO ?', a: '24'},
      { q: 'Se fosse possível pesar infinitas bolas grandes e pequenas, O que pesaria mais? ( 1 ) infinitas bolas grandes , ( 2 ) infinitas bolas pequenas , ( 3 ) teriam o mesmo peso', a: '3'},
      { q: 'Quanto vale, 10 - 4 = ?', a: '6' },
      { q: 'Quanto vale a soma dos ângulos internos de um triângulo qualquer ?', a: '180'},
      { q: 'Quanto vale a soma dos angulos externos adjacentes de um triângulo', a: '360'},
      { q: 'Qual a velocidade aproximada da luz em km / segundo ?', a: '300.000'},
      { q: 'Quanto vale, 7 x 2 = ?', a: '14' },
      { q: 'Quanto vale, 9 - 12 = ?', a: '-3' },
      { q: 'Quanto é log de 64 na base 8 ? Dica: leia como: Qual o expoente que transforma a base 8 em 64.', a: '2' },
      { q: 'Qual a raiz quadrada de 9 ?', a: '3' },
      { q: 'Quando eu tinha 4 anos meu irmão tinha o dobro da minha idade. Hoje meu irmão tem 20 anos, que idade eu tenho hoje?', a: '16' },
      { q: 'Uma compra custa 7,50. Você paga com 10 e a balconista pede 2,50 para facilitar. Quanto de troco você deve receber?', a: '5' }, // ajuste: caso queira 0 ou 0,00
      { q: 'O pai de Maria foi passear com 3 filhas: Joana, Sofia e Andrea. Quantas filhas tem o pai de Maria?', a: '4' },
      { q: 'Quanto é log10 ? dica: quando a base for omitida, base = 10).', a: '1' },
      { q: 'Quanto vale x na equação: x/3 + 6 = 10 ?', a: '12' },
      { q: 'Quando pedro nasceu seu pai tinha 33 anos, hoje o pai de Pedro tem 40. qual idade pedro tem hoje ?', a: '7'},
      { q: 'Qual é o inverso de 1/4 ?', a: '4' },
      { q: 'Quanto vale a Tangente de 45 graus ?', a: '1' },
      { q: 'Quando Diana tinha 15 anos sua tia tinhano dobro de sua idade. Hoje Diana tem 30 anos, que idade tem a tia de Diana? ', a: '45'},
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
     duration: 180,
     ease: 'Sine.easeInOut'
    });
    });


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

    // tecla F - fullscreen
     this.input.keyboard.on('keydown-F', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
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
     this.tempoResposta = 15000; // 15s para responder
     this.tempoPausa = 9000;    // 9s de pausa entre perguntas
     this.timerPergunta = null;
     this.perguntaAtiva = false;
     this.respostaAtual = '';

    // função que escolhe e mostra nova pergunta
      this.novaPergunta = () => {
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
      });
    };

    // finalizar pergunta: chamado após validar resposta (acertou/errou) e inicia pausa de 15s
     this.finalizarPergunta = () => {
    // garante cancelar timer
      if (this.timerPergunta) {
        this.timerPergunta.remove();
        this.timerPergunta = null;
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

     if (this.combo >= 3) {
     this.pontuacao += 55; // bônus de combo
    this.combo = 0; // reseta combo
    // Efeito visual do combo
     const comboText = this.add.text(960, 540, '+55 Combo!', {
     fontSize: '72px',
     color: '#ffff00',
     stroke: '#000',
     strokeThickness: 10
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
        this.perguntaText.setText(`⌛ Tempo esgotado! Resp.: ${corretaExibir}`);this.sound.play('sfx_erro', { volume: 2.0 });
      } else {
        this.perguntaText.setText(`❌ Errado (resp.: ${corretaExibir})`);this.sound.play('sfx_erro', { volume: 2.0 });
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
     scale: 1.05,
     duration: 450,
     ease: 'Sine.easeOut',
       onComplete: () => {
         this.professor.setFrame(novoFrame); // Atualiza Professor
         this.motorista.setFrame(novoFrame); // 🔥 ATUALIZA MOTORISTA 🔥
         this.tweens.add({
        targets: [this.professor, this.motorista],
          alpha: 1,
          scale: 1.0,
          duration: 500,
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
     fontSize: '64px',
     color: '#ffff00',
     stroke: '#000',
     strokeThickness: 10
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
     this.audioVitoria = this.sound.add('audio_vitoria', { volume: 5.0 });
     this.audioVitoria.play();

    // após 10 segundos, remove a tela e retoma o jogo
      this.time.delayedCall(10000, () => {
      this.tweens.add({
      targets: [telaVitoria, textoVitoria],
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        telaVitoria.destroy();
        textoVitoria.destroy();
        this.time.paused = false;
        this.venceu = false; // permite continuar jogando
      } 
    });
    });
  }

} // FIM DA CENA