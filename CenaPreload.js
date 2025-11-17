class CenaPreload extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaPreload' });
  }

  preload() {
    // Fundo simples com o título
    //this.add.image(960, 540, 'titulo').setOrigin(0.5);

    // Barra de carregamento
    let progressBox = this.add.graphics();
    let progressBar = this.add.graphics();
    progressBox.fillStyle(0xffffff, 0.4);
    progressBox.fillRect(470, 950, 980, 50);

    let percentText = this.add.text(960, 970, '0%', {
      fontSize: '28px',
      fill: '#fff'
    }).setOrigin(0.5);

    // Atualiza porcentagem
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(480, 960, 960 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });

    // Quando terminar de carregar
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();

      // Fade para a próxima cena
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(1200, () => {
        this.scene.start('CenaTitulo');
      });
    });

    // === ASSETS DO JOGO ===

    
    this.load.image('fundo', 'assets/fundo.png');
    this.load.image('paisagem', 'assets/faixa.png');
    this.load.image('estrada', 'assets/estrada.png');
    this.load.image('moldura', 'assets/moldura.png');
    this.load.image('lousa', 'assets/lousa.png');
    this.load.image('cerca', 'assets/cerca.png');
    this.load.image('gameover_screen', 'assets/gameover_screen.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('creditos', 'assets/creditos.png');
    this.load.image('vitoria', 'assets/vitoria.png');
    this.load.image('pontos', 'assets/pontos.png');
    this.load.image('titulo_1', 'assets/titulo_1.png');
    this.load.image('titulo_2', 'assets/titulo_2.png');
    this.load.image('titulo_3', 'assets/titulo_3.png');
    this.load.image('titulo_4', 'assets/titulo_4.png');
    this.load.image('titulo_5', 'assets/titulo_5.png');
    this.load.image('titulo_6', 'assets/titulo_6.png');
    this.load.image('logoEscola', 'assets/logoEscola.png');
    this.load.image('logoEvento', 'assets/logoEvento.png');
    this.load.image('imgBotaoPadrao', 'assets/imgBotaoPadrao.png');
   
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
    }
     for (let i = 1; i <= 4; i++) {
    this.load.image(`obs_retro${i}`, `assets/obstaculos/retro${i}.png`);
    }

    // ÁUDIOS DE FUNDO E SFX (Sem a lógica de 2s que causava o crash)
    this.load.audio('bgmusic', ['assets/audio/bgmusic.mp3', 'assets/audio/bgmusic.ogg']);
    this.load.audio('motorsound', ['assets/audio/motorsound.mp3', 'assets/audio/motorsound.ogg']);
    this.load.audio('sfx_acerto', ['assets/audio/sfx_acerto.mp3', 'assets/audio/sfx_acerto.ogg']); 
    this.load.audio('sfx_erro', ['assets/audio/sfx_erro.mp3', 'assets/audio/sfx_erro.ogg']);
    this.load.audio('sfx_colisao', ['assets/audio/sfx_colisao.mp3', 'assets/audio/sfx_colisao.ogg']);
    this.load.audio('audio_vitoria', ['assets/audio/audio_vitoria.mp3', 'assets/audio/audio_vitoria.ogg']);

    // Quando terminar de carregar
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();

      // Fade para a próxima cena
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(1200, () => {
        this.scene.start('CenaTitulo');
      });
    });
  }
}
