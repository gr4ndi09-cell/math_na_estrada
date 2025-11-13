class CenaTitulo extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaTitulo' });
  }

  create() {

     // tecla F - fullscreen
     this.input.keyboard.on('keydown-F', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    });
 // ======== FUNDO ANIMADO ========
    this.bgAnim = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'bg_loading_anim')
      .setOrigin(0.5)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(-1);

    this.anims.create({
      key: 'bg_loop',
      frames: this.anims.generateFrameNumbers('bg_loading_anim'),
      frameRate: 0.3,   // mais visível agora
      repeat: 3      // loop infinito
    });

    this.bgAnim.play('bg_loop');

    // ======== TEXTO PISCANTE ========
    const startText = this.add.text(this.scale.width / 2, this.scale.height * 0.9, 
      'TOQUE NA TELA OU PRESSIONE ENTER PARA INICIAR', {
      fontSize: '48px',
      color: '#fcba05ff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 9,
      align: 'center'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Som do título (loop)
    // this.musicaTitulo = this.sound.add('audio2', { loop: true, volume: 0.5 });
    // this.musicaTitulo.play();

    // ======== CONTROLE DE TECLADO ========
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on('down', () => {
      this.iniciarJogo();
    });

    // ======== CONTROLE DE TOQUE ========
    this.input.once('pointerdown', () => {
      this.iniciarJogo();
    });

   
  }

  iniciarJogo() {
    // Impede duplo acionamento
    if (this.jogoIniciado) return;
    this.jogoIniciado = true;

    // Faz um fade bonito
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      //this.musicaTitulo.stop();
      this.scene.start('MeuJogo');
    });
  }
}
