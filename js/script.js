/**
 * Jogo de Futebol 2D - Versão Refatorada e Responsiva
 */

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    if (!this.canvas) {
      console.error('Canvas não encontrado!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Não foi possível obter o contexto 2D do canvas!');
      return;
    }
    
    // Configurações do jogo
    this.config = {
      friction: 0.85,
      accel: 0.5,
      maxSpeed: 5,
      ballSpeed: 7,
      ballFriction: 0.99,
      aiSpeed: 0.05
    };

    // Estado do jogo
    this.score = { red: 0, blue: 0 };
    this.mode = 'single';
    this.selectedTeam = 'red';
    this.keys = {};

    // Inicializar elementos
    this.initUI();
    this.initCanvas();
    this.initPlayers();
    this.initBall();
    this.initGoals();
    this.initEventListeners();
    
    // Garantir que as posições estejam corretas após inicialização
    this.updateGamePositions();
    
    // Iniciar loop do jogo
    this.resetGame();
    this.gameLoop();
  }

  initUI() {
    this.ui = {
      mode: document.getElementById('mode'),
      team: document.getElementById('team'),
      reset: document.getElementById('reset'),
      score: document.getElementById('score')
    };
    
    // Verificar se todos os elementos UI foram encontrados
    if (!this.ui.mode || !this.ui.team || !this.ui.reset || !this.ui.score) {
      console.error('Alguns elementos da UI não foram encontrados!');
    }
  }

  initCanvas() {
    // Configurar tamanho inicial do canvas
    this.resizeCanvas();
    
    // Redimensionar quando a janela mudar de tamanho
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const maxWidth = 1200;
    const maxHeight = 675;
    const aspectRatio = 16 / 9;
    const minWidth = 320;
    const minHeight = 180;
    
    let width = Math.max(minWidth, window.innerWidth - 40);
    let height = Math.max(minHeight, window.innerHeight - 120);

    // Manter proporção
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    // Limitar tamanho máximo
    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);

    // Garantir valores válidos
    width = Math.max(minWidth, width);
    height = Math.max(minHeight, height);

    // Aplicar tamanho ao canvas
    this.canvas.width = width;
    this.canvas.height = height;

    // Atualizar posições dos elementos do jogo (se já existirem)
    if (this.player && this.opponent && this.ball) {
      this.updateGamePositions();
    }
  }

  updateGamePositions() {
    // Reposicionar jogadores
    if (this.player) {
      this.player.x = this.canvas.width * 0.15;
      this.player.y = this.canvas.height / 2;
    }
    
    if (this.opponent) {
      this.opponent.x = this.canvas.width * 0.85;
      this.opponent.y = this.canvas.height / 2;
    }

    // Reposicionar bola
    if (this.ball) {
      this.ball.x = this.canvas.width / 2;
      this.ball.y = this.canvas.height / 2;
    }

    // Reposicionar gols
    const goalHeight = Math.min(120, this.canvas.height * 0.27);
    this.goalL = {
      x: 0,
      y: this.canvas.height / 2 - goalHeight / 2,
      w: 10,
      h: goalHeight
    };
    
    this.goalR = {
      x: this.canvas.width - 10,
      y: this.canvas.height / 2 - goalHeight / 2,
      w: 10,
      h: goalHeight
    };
  }

  initPlayers() {
    this.player = new Player(
      this.canvas.width * 0.15,
      this.canvas.height / 2,
      'red',
      { up: 'w', down: 's', left: 'a', right: 'd' }
    );

    this.opponent = new Player(
      this.canvas.width * 0.85,
      this.canvas.height / 2,
      'blue',
      { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
    );
  }

  initBall() {
    this.ball = new Ball(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.config.ballSpeed,
      this.config.ballFriction
    );
  }

  initGoals() {
    const goalHeight = Math.min(120, this.canvas.height * 0.27);
    this.goalL = {
      x: 0,
      y: this.canvas.height / 2 - goalHeight / 2,
      w: 10,
      h: goalHeight
    };
    
    this.goalR = {
      x: this.canvas.width - 10,
      y: this.canvas.height / 2 - goalHeight / 2,
      w: 10,
      h: goalHeight
    };
  }

  initEventListeners() {
    // Teclado
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // UI
    this.ui.mode.addEventListener('change', () => {
      this.mode = this.ui.mode.value;
      this.resetGame();
    });

    this.ui.team.addEventListener('change', () => {
      this.selectedTeam = this.ui.team.value;
      this.player.color = this.selectedTeam;
      this.opponent.color = this.selectedTeam === 'red' ? 'blue' : 'red';
      this.resetGame();
    });

    this.ui.reset.addEventListener('click', () => this.resetGame());
  }

  resetGame() {
    this.score = { red: 0, blue: 0 };
    this.updateScore();
    this.resetBall();
  }

  resetBall() {
    if (this.ball && this.canvas) {
      this.ball.x = this.canvas.width / 2;
      this.ball.y = this.canvas.height / 2;
      this.ball.vx = 0;
      this.ball.vy = 0;
    }
  }

  updateScore() {
    this.ui.score.textContent = `${this.score.red} – ${this.score.blue}`;
  }

  update() {
    // Atualizar jogador
    this.player.update(this.keys, this.config, this.canvas);

    // Atualizar oponente (IA ou multiplayer)
    if (this.mode === 'multi') {
      this.opponent.update(this.keys, this.config, this.canvas);
    } else {
      this.opponent.updateAI(this.ball, this.config, this.canvas);
    }

    // Atualizar bola
    this.ball.update(this.canvas);

    // Colisões entre jogadores e bola
    this.checkPlayerBallCollisions();

    // Colisões da bola com as bordas
    this.checkBallBoundaries();

    // Verificar gols
    this.checkGoals();
  }

  checkPlayerBallCollisions() {
    [this.player, this.opponent].forEach(player => {
      const dx = this.ball.x - player.x;
      const dy = this.ball.y - player.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.ball.r + player.r) {
        const angle = Math.atan2(dy, dx);
        this.ball.vx = Math.cos(angle) * this.config.ballSpeed;
        this.ball.vy = Math.sin(angle) * this.config.ballSpeed;
      }
    });
  }

  checkBallBoundaries() {
    // Topo e fundo
    if (this.ball.y < this.ball.r || this.ball.y > this.canvas.height - this.ball.r) {
      this.ball.vy *= -1;
      this.ball.y = Math.max(this.ball.r, Math.min(this.canvas.height - this.ball.r, this.ball.y));
    }

    // Laterais (exceto gols)
    if (this.ball.x - this.ball.r < 0) {
      if (this.ball.y < this.goalL.y || this.ball.y > this.goalL.y + this.goalL.h) {
        this.ball.vx *= -1;
        this.ball.x = this.ball.r;
      }
    } else if (this.ball.x + this.ball.r > this.canvas.width) {
      if (this.ball.y < this.goalR.y || this.ball.y > this.goalR.y + this.goalR.h) {
        this.ball.vx *= -1;
        this.ball.x = this.canvas.width - this.ball.r;
      }
    }
  }

  checkGoals() {
    // Gol esquerdo
    if (this.ball.x - this.ball.r < this.goalL.x + this.goalL.w &&
        this.ball.y > this.goalL.y &&
        this.ball.y < this.goalL.y + this.goalL.h) {
      this.score[this.opponent.color]++;
      this.updateScore();
      this.resetBall();
      return;
    }

    // Gol direito
    if (this.ball.x + this.ball.r > this.goalR.x &&
        this.ball.y > this.goalR.y &&
        this.ball.y < this.goalR.y + this.goalR.h) {
      this.score[this.player.color]++;
      this.updateScore();
      this.resetBall();
      return;
    }
  }

  draw() {
    // Campo
    this.ctx.fillStyle = '#3a7d44';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Linhas do campo
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;

    // Linha central
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();

    // Círculo central
    const centerRadius = Math.min(70, this.canvas.width * 0.0875);
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, centerRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Gols
    this.ctx.fillStyle = '#a00';
    this.ctx.fillRect(this.goalL.x, this.goalL.y, this.goalL.w, this.goalL.h);

    this.ctx.fillStyle = '#00a';
    this.ctx.fillRect(this.goalR.x, this.goalR.y, this.goalR.w, this.goalR.h);

    // Jogadores
    this.player.draw(this.ctx);
    this.opponent.draw(this.ctx);

    // Bola
    this.ball.draw(this.ctx);
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

class Player {
  constructor(x, y, color, keys) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = 15;
    this.color = color;
    this.keys = keys;
  }

  update(keys, config, canvas) {
    let dx = 0, dy = 0;

    if (keys[this.keys.up]) dy -= 1;
    if (keys[this.keys.down]) dy += 1;
    if (keys[this.keys.left]) dx -= 1;
    if (keys[this.keys.right]) dx += 1;

    if (dx || dy) {
      this.vx += dx * config.accel;
      this.vy += dy * config.accel;
    }

    // Limitar velocidade
    this.vx = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, this.vx));
    this.vy = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, this.vy));

    // Atualizar posição
    this.x += this.vx;
    this.y += this.vy;

    // Aplicar fricção
    this.vx *= config.friction;
    this.vy *= config.friction;

    // Limites do campo
    this.x = Math.max(this.r, Math.min(canvas.width - this.r, this.x));
    this.y = Math.max(this.r, Math.min(canvas.height - this.r, this.y));
  }

  updateAI(ball, config, canvas) {
    // IA simples: seguir a bola no eixo Y
    const targetY = ball.y;
    const dy = targetY - this.y;
    
    this.vy += Math.sign(dy) * config.accel * 0.5;
    this.vy = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, this.vy));
    
    this.y += this.vy;
    this.vy *= config.friction;
    
    // Manter dentro dos limites
    this.y = Math.max(this.r, Math.min(canvas.height - this.r, this.y));
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Ball {
  constructor(x, y, speed, friction) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = 10;
    this.speed = speed;
    this.friction = friction;
  }

  update(canvas) {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
  }

  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Inicializar jogo quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Game());
} else {
  new Game();
}


