class CenaTitulo extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaTitulo' });
  }

  create() {
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
  
    // Música da tela de título
    //this.audioTitulo = this.sound.add('audio2', { loop: true, volume: 0.6 });
    //this.audioTitulo.play();

    // Texto "Aperte Enter"
    const startText = this.add.text(960, 1000, 'APERTE ENTER PARA INICIAR', {
      fontSize: '42px',
      fill: '#fdfafaff',
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

    // Transição para o jogo
    this.input.keyboard.once('keydown-ENTER', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(1000, () => {
       // this.audioTitulo.stop();
        this.scene.start('MeuJogo');
      });
    });
  }
}
