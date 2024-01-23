let move_speed = 3, gravity = 0.5;
let character = document.querySelector('.character');
let img = document.getElementById('character-Bird');

let birdProps = character.getBoundingClientRect();

let background = document.querySelector('.background').getBoundingClientRect();
let scoreValue = document.querySelector('.scoreValue');
let msg = document.querySelector('.msg');
let scoreTitle = document.querySelector('.scoreTitle');
let timeElapsed = 0;
let timerId;
let isPaused = false;
let deathCount = localStorage.getItem('deathCount') || 0;

let pauseMenu = document.getElementById('pause-menu');
let resumeButton = document.getElementById('resume-button');
let restartButton = document.getElementById('restart-button');

let gameState = 'Start';
img.style.display = 'none';
msg.classList.add('msgStyle');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && gameState != 'Play'){
        document.querySelectorAll(".pipe_sprite").forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        character.style.top = '40vh';
        gameState = "Play";
        msg.innerHTML ='';
        scoreTitle.innerHTML = 'Score : ';
        scoreValue.innerHTML = '0';
        msg.classList.remove("msgStyle");
        timeElapsed = 0;
        timerId = setInterval(updateTimer, 1000);
        play();
    }
    if (e.code === 'Enter') {
        document.querySelector('.timer').style.display = 'block';
        document.querySelector('.death').style.display = 'block';
      }
    if (e.key === 'Escape') {
        if (gameState === 'Play') {
            if (!isPaused) {
          gameState = 'Pause';
          pauseMenu.style.display = 'block';
          clearInterval(timerId); // Arrêtez le timer
          isPaused = true;
          }
        } else if (gameState === 'Pause') {
          gameState = 'Play';
          pauseMenu.style.display = 'none';
          timerId = setInterval(updateTimer, 1000);
          play();
          isPaused = false;
        }
      } 
});

resumeButton.addEventListener('click', () => {
    gameState = 'Play';
    pauseMenu.style.display = 'none';
    timerId = setInterval(updateTimer, 1000);
    play();
    isPaused = false;
  });
  
  restartButton.addEventListener('click', () => {
    window.location.reload();
  });

function play(){
    
    function move(){
        if(gameState != 'Play') return;
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            birdProps = character.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(birdProps.left < pipe_sprite_props.left + pipe_sprite_props.width && birdProps.left + birdProps.width > pipe_sprite_props.left && birdProps.top < pipe_sprite_props.top + pipe_sprite_props.height && birdProps.top + birdProps.height > pipe_sprite_props.top){
                    gameState = 'End';
                    clearInterval(timerId);
                    deathCount++; 
                    localStorage.setItem('deathCount', deathCount);
                    msg.innerHTML = 'Game Over'.fontcolor('red') + '<br>Score : ' + scoreValue.innerHTML + '<br>Press Enter To Restart';
                    msg.classList.add('msgStyle');
                    img.style.display = 'none';
                    return;
                }else{
                    if(pipe_sprite_props.right < birdProps.left && pipe_sprite_props.right + move_speed >= birdProps.left && element.increase_score == '1'){
                        scoreValue.innerHTML =+ scoreValue.innerHTML + 1;
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + "px";
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    document.getElementById('deathCount').innerHTML = deathCount;

    let character_dy = 0;
    function apply_gravity(){
        if(gameState != 'Play') return;
        character_dy = character_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = '/img/darkFlappyBird2.png';
                character_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = '/img/darkFlappyBird.png';
            }
        });

        if(birdProps.top <= 0 || birdProps.bottom >= background.bottom){
            gameState = 'End';
            msg.style.left = '28vw';
            window.location.reload();
            msg.classList.remove('msgStyle');
            return;
        }
        character.style.top = birdProps.top + character_dy + 'px';
        birdProps = character.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe(){
        if(gameState != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() *43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi -70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

function updateTimer() {
    if(gameState != 'Play') {
        document.getElementById('time').style.display = 'none';
        return;
    }
    timeElapsed++;
    document.getElementById('time').textContent = timeElapsed;
}