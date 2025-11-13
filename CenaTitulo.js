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
    // Fundo com instruções / história
      // Adiciona animação de fundo depois do carregamento completo
   this.bgAnim = this.add.sprite(960, 540, 'bg_loading_anim').setOrigin(0.5).setDepth(-1);
    this.anims.create({
      key: 'bg_loop',
      frames: this.anims.generateFrameNumbers('bg_loading_anim'),
      frameRate: 0.2,
      repeat: 3
      
    });
    this.bgAnim.play('bg_loop');

    this.tweens.add({
      targets: this.bgAnim,
      alpha: { from: 0, to: 1 },
      duration: 2000,
      ease: 'Sine.easeInOut'
    });
  
      // Texto "Aperte Enter"
    const startText = this.add.text(960, 1000, 'APERTE ENTER OU CLIQUE NA TELA PARA INICIAR', {
      fontSize: '42px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0);

    // Animação suave piscando
    this.tweens.add({
      targets: startText,
      alpha: { from: 0, to: 1 },
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

    // ======== OPCIONAL: BOTÃO VISUAL "INICIAR" ========
    // const botaoIniciar = this.add.text(960, 820, '▶ INICIAR', {
    //   fontSize: '72px',
    //   fill: '#FFD700',
    //   fontFamily: 'Arial Black',
    //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //   padding: { x: 40, y: 20 }
    // }).setOrigin(0.5).setInteractive().setDepth(1);

    // botaoIniciar.on('pointerdown', () => {
    //   this.iniciarJogo();
    // });

    // botaoIniciar.on('pointerover', () => {
    //   botaoIniciar.setStyle({ fill: '#FFFFFF' });
    // });

    // botaoIniciar.on('pointerout', () => {
    //   botaoIniciar.setStyle({ fill: '#FFD700' });
    // });
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
