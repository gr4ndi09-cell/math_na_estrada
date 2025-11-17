class CenaTitulo extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaTitulo' });
  }

  

  create() {

    // --- FULLSCREEN (opcional no PC) ---
    this.input.keyboard.on('keydown-F', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    });

    // ============================
    //     SEQUÊNCIA DE IMAGENS
    // ============================

    this.tituloIndex = 1;

    // adiciona primeira imagem
    this.bgImage = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      `titulo_${this.tituloIndex}`
    ).setOrigin(0.5)
     .setDisplaySize(this.scale.width, this.scale.height)
     .setDepth(-1)
     .setAlpha(0);

    // começa animação de transição
    this.animarSequenciaTitulo();

    // ============================
    // TEXTO PISCANTE "TOQUE PARA INICIAR"
    // ============================

    const startText = this.add.text(
      this.scale.width / 2,
      this.scale.height * 0.9,
      'TOQUE NA TELA OU PRESSIONE ENTER PARA INICIAR',
      {
        fontSize: '48px',
        color: '#fcba05',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 8,
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // ============================
    //     CONTROLE DE ENTRADA
    // ============================

    this.input.keyboard.on('keydown-ENTER', () => this.iniciarJogo());
    this.input.on('pointerdown', () => this.iniciarJogo());
  }

  // =======================================
  //     FUNÇÃO DA ANIMAÇÃO DE SEQUÊNCIA
  // =======================================
  animarSequenciaTitulo() {

    this.tweens.add({
      targets: this.bgImage,
      alpha: 1,
      duration: 1500,
      ease: 'Sine.easeInOut',
      onComplete: () => {

        // após 2s mostrando a imagem, fade-out
        this.time.delayedCall(5000, () => {

          this.tweens.add({
            targets: this.bgImage,
            alpha: 0,
            duration: 1500,
            ease: 'Sine.easeInOut',

            onComplete: () => {
              // troca imagem
              this.tituloIndex++;

              if (this.tituloIndex > 6) {
                this.tituloIndex = 1; // reinicia ciclo
              }

              this.bgImage.setTexture(`titulo_${this.tituloIndex}`);

              // chama próxima imagem
              this.animarSequenciaTitulo();
            }
          });

        });

      }
    });
  }

  // ============================
  //    TROCA PARA A CENA DO JOGO
  // ============================
  iniciarJogo() {
    if (this.jogoIniciado) return;
    this.jogoIniciado = true;

    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      this.scene.start('MeuJogo');
    });
  }
}
