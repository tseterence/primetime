// VARIABLES
const homeBtn = document.getElementById('home')
const startBtn = document.getElementById('start')
const restartBtn = document.getElementById('restart')
const noBtn = document.getElementById('no')
const yesBtn = document.getElementById('yes')
const currentNum = document.getElementById('number')
const currentScore = document.getElementById('current-score')

const helpContainer = document.getElementById('help-container');
const helpX = document.getElementById('help-modal-close-button');
const statsContainer = document.getElementById('stats-container');
const statsX = document.getElementById('stats-modal-close-button');
// 

// EVENT LISTENERS
noBtn.addEventListener('click', checkPrime)
yesBtn.addEventListener('click', checkPrime)
homeBtn.addEventListener('click', startScreen)

helpX.addEventListener('click', e => {
    helpContainer.classList.add('hidden');
    helpContainer.classList.remove('show');
})
statsX.addEventListener('click', e => {
    statsContainer.classList.add('hidden');
    statsContainer.classList.remove('show');
})
// 

// LOCAL STORAGE
function initLocalStorage() {
    if (!localStorage.getItem('statistics')) {
        const stats = {'numGames': 0, 'avgScore': 0, 'highScore': 0, 'gameScores': [], 'scoreDist': {'0': 0, '5': 0, '10': 0, '15': 0, '20': 0, '25': 0, '30': 0, '35': 0, '40': 0, '45': 0, '50': 0, '55': 0}};
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
    if (!localStorage.getItem('viewedTutorial')) {
        showHelpModal();
        localStorage.setItem('viewedTutorial', JSON.stringify(true));
    }
}

function updateStatistics(score) {
    const stats = JSON.parse(localStorage.getItem('statistics'));
    
    stats['numGames'] += 1;
    stats['gameScores'].push(score);
    if (score > stats['highScore']) stats['highScore'] = score;
    stats['avgScore'] = Math.round(stats['gameScores'].reduce((acc, curr) => acc + curr, 0) / stats['numGames'] * 10) / 10;
    stats['scoreDist'][String(Math.floor(score / 5) * 5)] += 1;

    localStorage.setItem('statistics', JSON.stringify(stats));
}

function populateStatistics() {
    const numGamesEl = document.getElementById('num_games').querySelector('.stats-num');
    const highScoreEl = document.getElementById('high_score').querySelector('.stats-num');
    const avgScoreEl = document.getElementById('avg_score').querySelector('.stats-num');

    const stats = JSON.parse(localStorage.getItem('statistics'));

    numGamesEl.innerHTML = stats['numGames'];
    highScoreEl.innerHTML = stats['highScore'];
    avgScoreEl.innerHTML = stats['avgScore'];

    const mostFreq = Math.max(...Object.values(stats['scoreDist']));
    const maxRange = 45;

    for (let i = 0; i <= maxRange; i += 5) {
        const barEl = document.getElementById('bar_' + String(i));
        const barHeight = 10 + 90 * (stats['scoreDist'][String(i)] / mostFreq);
        barEl.style.height = String(barHeight) + "%";

        const barLabelEl = document.getElementById('bar_' + String(i));
        barLabelEl.innerHTML = stats['scoreDist'][String(i)];
    }
}
//

// SHORTCUT FUNCTIONS
document.addEventListener('keydown', (e) => {
    if ((document.getElementById('start-screen').style.display === 'block') && !helpContainer.classList.contains('show') && !statsContainer.classList.contains('show') && e.code === 'Space') {
        startBtn.click();
    }
    if (document.getElementById('play-screen').style.display === 'block' && e.code === 'ArrowLeft') {
        noBtn.click();
    } else if (document.getElementById('play-screen').style.display === 'block' && e.code === 'ArrowRight') {
        yesBtn.click();
    }
    if ((document.getElementById('end-screen').style.display === 'block') && !helpContainer.classList.contains('show') && !statsContainer.classList.contains('show') && e.code === 'Space') {
        restartBtn.click();
    }
});

let touchstartX = 0;
let touchendX = 0;
document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
})
document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  checkDirection();
})
function checkDirection() {
    if (document.getElementById('play-screen').style.display === 'block') {
        if (touchendX < touchstartX) noBtn.click();
        if (touchendX > touchstartX) yesBtn.click();
    }
}
// 

// IN-GAME HELPER FUNCTIONS
// return random num from 1 to n, inclusive
function getNum(n) {
    return Math.floor((Math.random() * n) + 1);
}

// check if n is prime
function isPrime(n) {
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return n > 1;
}

// get prime factors of composite n
function primeFactors(n) {
    const factors = {};
    for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
            factors[i] ? factors[i]++ : factors[i] = 1;
            n /= i;
        }
    }
    const arr = []
    for (const key in factors) {
        factors[key] > 1 ? arr.push(`${key}<sup>${factors[key]}</sup>`) : arr.push(`${key}`);
    }
    return arr;
}

function checkPrime(e) {
    if ((e.target.id === 'no' && isPrime(Number(currentNum.innerHTML))) || (e.target.id === 'yes' && !isPrime(Number(currentNum.innerHTML)))) {
        // wrong answer - game over
        t.stop();
        endGame();

        if (e.target.id === 'no') {
            document.getElementById('reason').innerHTML = `${currentNum.innerHTML} is prime`;
        } else if (e.target.id === 'yes') {
            if (currentNum.innerHTML === '1') {
                document.getElementById('reason').innerHTML = `By definition, 1 is not prime`;
            } else {
                document.getElementById('reason').innerHTML = `${currentNum.innerHTML} = ${primeFactors(Number(currentNum.innerHTML)).join(' x ')}`;
            }
        }
    } else {
        // right answer - continue game
        currentScore.innerHTML++;
        currentNum.innerHTML = `${getNum(100)}`;
    }
}
// 

// HANDLE GAME AND SCREENS
function startScreen() {
    hideScreens('screen')
    toggleScreen('start-screen', true)

    t.stop()
}

function startGame() {
    hideScreens('screen')
    toggleScreen('play-screen', true)

    currentScore.innerHTML = '0'
    currentNum.innerHTML = `${getNum(100)}`
    
    t.start()
}

function endGame() {
    hideScreens('screen')
    toggleScreen('end-screen', true)

    updateStatistics(Number(currentScore.innerHTML));
    displayResult();
    document.getElementById('high-score').innerHTML = JSON.parse(localStorage.getItem('statistics'))['highScore'];
}

function displayResult() {
    document.getElementById('final-score').innerHTML = `${currentScore.innerHTML}`;
}

// hide all divs with class as input 'cl'
function hideScreens(cl) {
    let elements = Array.from(document.getElementsByClassName(cl));
    elements.forEach(element => element.style.display = 'none');
}

// toggle specific div with id as input
function toggleScreen(id, toggle) {
    const element = document.getElementById(id);
    const display = (toggle) ? 'block' : 'none';
    element.style.display = display;
}
// 

// TIMER
class Timer {
    constructor() {
        this.el = {
            seconds: document.getElementById('seconds'),
            tenthSeconds: document.getElementById('tenthSeconds'),
        }

        this.interval = null;
        this.remainingSeconds = 0;
        this.startTime = 0;
        this.endTime = 0;
    }

    updateTimer() {
        const seconds = Math.floor(this.remainingSeconds / 1000);
        const tenthSeconds = Math.floor((this.remainingSeconds % 1000) / 100);

        this.el.seconds.innerHTML = seconds.toString().padStart(2, "0");
        this.el.tenthSeconds.innerHTML = tenthSeconds;
    }

    start() {
        this.startTime = new Date().getTime();
        this.remainingSeconds = 30 * 1000;
        this.endTime = this.startTime + this.remainingSeconds;
        
        if (this.remainingSeconds === 0) return;

        this.interval = setInterval(() => {
            this.remainingSeconds = this.endTime - Date.now();
            this.updateTimer();
            if (this.remainingSeconds <= 0) {
                this.stop();
                document.getElementById('reason').innerHTML = `Time's up!`;
                endGame();
            }
        }, 1)
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }
}
//

// MODALS
// clicking on modal will: stop timer, show start screen, then show modal
function showHelpModal() {
    if (document.getElementById('play-screen').style.display === 'block') {
        startScreen();
    }
    helpContainer.classList.add('show');
    helpContainer.classList.remove('hidden');
}

function showStatsModal() {
    if (document.getElementById('play-screen').style.display === 'block') {
        startScreen();
    }
    populateStatistics();
    statsContainer.classList.add('show');
    statsContainer.classList.remove('hidden');
}

// clicking outside of modal closes it
window.addEventListener('click', e => {
    if (e.target === helpContainer) {
        helpContainer.classList.remove('show');
        helpContainer.classList.add('hidden');
    }
    if (e.target === statsContainer) {
        statsContainer.classList.remove('show');
        statsContainer.classList.add('hidden');
    }
})
//


window.addEventListener('load', e => {
    initLocalStorage();
});
const t = new Timer();