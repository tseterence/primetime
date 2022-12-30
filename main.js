// local storage data
    // total games played
    // avg score
    // high score
    // indiv game scores
    // score distribution by range
    // has viewed? -> triggers "How To Play" on page load 
    // dark theme?
    // hard mode enabled? (boolean)

    // display distribution of scores under statistics


// modals for help, stats, and settings
    // check active screen
        // if game is active OR home screen showing -> show home screen
        // if game over screen showing -> do nothing 
    // open corresponding modal
    
window.addEventListener('load', e => {
    initLocalStorage();
});

function initLocalStorage() {
    if (!localStorage.getItem('statistics')) {
        const stats = {'numGames': 0, 'avgScore': 0, 'highScore': 0, 'gameScores': [], 'scoreDist': {'0': 0, '5': 0, '10': 0, '15': 0, '20': 0, '25': 0, '30': 0, '35': 0, '40': 0, '45': 0, '50': 0, '55': 0}};
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
    if (!localStorage.getItem('viewedTutorial')) {
        showHelpModal();
        localStorage.setItem('viewedTutorial', JSON.stringify(true));
    }
    // if (!localStorage.getItem('hardMode')) {
    //     localStorage.setItem('hardMode', JSON.stringify(false));
    // }
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

    const maxRange = 45;

    let scoreDistList = [];
    for (let i = 0; i <= maxRange; i += 5) {
        scoreDistList.push(stats['scoreDist'][String(i)]);
    }

    const mostFreq = Math.max(...scoreDistList)
    for (let i = 0; i <= maxRange; i += 5) {
        const barEl = document.getElementById('bar_' + String(i));
        const barWidth = 8 + 92 * (stats['scoreDist'][String(i)] / mostFreq);
        barEl.style.width = String(barWidth) + "%";

        const barLabelEl = document.getElementById('bar_' + String(i)).querySelector('.num-range');
        barLabelEl.innerHTML = stats['scoreDist'][String(i)];
    }
}

// variables
const homeBtn = document.getElementById('home')
const startBtn = document.getElementById('start')
const restartBtn = document.getElementById('restart')
const noBtn = document.getElementById('no')
const yesBtn = document.getElementById('yes')
const currentNum = document.getElementById('number')
const currentScore = document.getElementById('current-score')

// event listeners
noBtn.addEventListener('click', checkPrime)
yesBtn.addEventListener('click', checkPrime)
homeBtn.addEventListener('click', startScreen)

// return random num from 1 to n, inclusive
function getNum(n) {
    let result = Math.floor(Math.random() * n + 1)
    return result
    // if (hardModeTogBtn.checked && result % 2 === 0) return getNum(n)
    // else return result
}

// check if n is prime
function isPrime(n) {
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false
    }
    return n > 1
}

// get prime factors of composite n
function primeFactors(n) {
    const factors = {}
    for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
            factors[i] ? factors[i]++ : factors[i] = 1
            n /= i
        }
    }
    const str = []
    for (const key in factors) {
        factors[key] > 1 ? str.push(`${key}<sup>${factors[key]}</sup>`) : str.push(`${key}`)
    }
    return str.join(' x ')
}

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





function checkPrime(e) {
    if ((e.target.id === 'no' && isPrime(Number(currentNum.innerHTML))) || (e.target.id === 'yes' && !isPrime(Number(currentNum.innerHTML)))) {
        // wrong answer - game over
        t.stop()
        endGame()

        if (e.target.id === 'no') {
            document.getElementById('reason').innerHTML = `${currentNum.innerHTML} is prime`
        } else if (e.target.id === 'yes') {
            if (currentNum.innerHTML === '1') {
                document.getElementById('reason').innerHTML = `By definition, 1 is not prime`
            } else {
                let factors = primeFactors(Number(currentNum.innerHTML))
                document.getElementById('reason').innerHTML = `${currentNum.innerHTML} = ${factors}`
            }
        }
    } else {
        // right answer - continue game
        currentScore.innerHTML++
        checkHighScore()
        currentNum.innerHTML = `${getNum(100)}`
    }
}

function endGame() {
    hideScreens('screen')
    toggleScreen('end-screen', true)

    document.getElementById('high-score-2').innerHTML = document.getElementById('high-score-1').innerHTML

    displayResult();
    updateStatistics(Number(currentScore.innerHTML));
}

function displayResult() {
    // if prime, say prime
    // else show first whole factor
    document.getElementById('final-score').innerHTML = `${currentScore.innerHTML}`
}

function checkHighScore() {
    if (Number(currentScore.innerHTML) > Number(document.getElementById('high-score-1').innerHTML)) {
        document.getElementById('high-score-1').innerHTML = currentScore.innerHTML
    }
}

// function resetHighScore() {
//     document.querySelector('#high-score').innerHTML = '0'
// }

// function showHelp() {
//     hideScreens('screen')
//     toggleScreen('about-screen', true)

//     t.stop()
// }

// function showSettings() {
//     hideScreens('screen')
//     toggleScreen('settings-screen', true)

//     t.stop()
// }

// function showStatistics() {
//     hideScreens('screen')
//     toggleScreen('statistics-screen', true)

//     t.stop()

//     populateStatistics();
// }

// hide all divs with class as input
function hideScreens(cl) {
    let elements = Array.from(document.getElementsByClassName(cl))
    elements.forEach(element => element.style.display = 'none')
}

// toggle specific div with id as input
function toggleScreen(id, toggle) {
    const element = document.getElementById(id)
    const display = (toggle) ? 'block' : 'none'
    element.style.display = display
}

// document.querySelector('#subOne').addEventListener('click', () => {
//     if (document.getElementById('inputMaximum').value > 1) {
//         document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value--
//     }
// })
// document.querySelector('#addOne').addEventListener('click', () => {
//     if (document.getElementById('inputMaximum').value < 200) {
//         document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value++
//     }
// })

// document.querySelector('#subSec').addEventListener('click', () => {
//     if (document.getElementById('inputSeconds').value > 1) {
//         document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value--
//     }
// })
// document.querySelector('#addSec').addEventListener('click', () => {
//     if (document.getElementById('inputSeconds').value < 60) {
//         document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value++
//     }
// })


class Timer {
    constructor() {
        this.el = {
            seconds: document.getElementById('seconds'),
            tenthSeconds: document.getElementById('tenthSeconds'),
        }

        this.interval = null
        this.remainingSeconds = 0
        this.startTime = 0
        this.endTime = 0
    }

    updateTimer() {
        const seconds = Math.floor(this.remainingSeconds / 1000)
        const tenthSeconds = Math.floor((this.remainingSeconds % 1000) / 100)

        this.el.seconds.innerHTML = seconds.toString().padStart(2, "0")
        this.el.tenthSeconds.innerHTML = tenthSeconds
    }

    start() {
        this.startTime = new Date().getTime()
        this.remainingSeconds = 30 * 1000
        this.endTime = this.startTime + this.remainingSeconds
        
        if (this.remainingSeconds === 0) return;

        this.interval = setInterval(() => {
            this.remainingSeconds = this.endTime - Date.now()
            this.updateTimer()
            if (this.remainingSeconds <= 0) {
                this.stop()
                document.getElementById('reason').innerHTML = `Time's up!`
                endGame()
            }
        }, 1)
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
    }
}

const t = new Timer()


// difficult mode
const hardModeTogBtn = document.getElementById('hardModeTogBtn')
// console.log(togBtn.checked)

// use arrows on keyboard (only works when game has started)
document.addEventListener('keydown', (e) => {
    if ((document.getElementById('start-screen').style.display === 'block') && e.code === 'Space') {
        startBtn.click();
    }
    if (document.getElementById('play-screen').style.display === 'block' && e.code === 'ArrowLeft') {
        noBtn.click();
    } else if (document.getElementById('play-screen').style.display === 'block' && e.code === 'ArrowRight') {
        yesBtn.click();
    }
    if ((document.getElementById('end-screen').style.display === 'block') && e.code === 'Space') {
        restartBtn.click();
    }
});


// use swipe on touchscreen (only works when game has started)
let touchstartX = 0
let touchendX = 0
    
function checkDirection() {
    if (document.getElementById('play-screen').style.display === 'block') {
        if (touchendX < touchstartX) noBtn.click()
        if (touchendX > touchstartX) yesBtn.click()
    }
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})

// help modal
    // stop timer, show start screen, then show modal
const helpContainer = document.getElementById('help-container');
function showHelpModal() {
    if (document.getElementById('play-screen').style.display === 'block') {
        startScreen();
    }

    helpContainer.classList.add('show');
    helpContainer.classList.remove('hidden');

    // statsContainer.classList.add('hidden');
}
const helpX = document.getElementById('help-modal-close-button');
helpX.addEventListener('click', e => {
    helpContainer.classList.add('hidden');
    helpContainer.classList.remove('show');
})

// stats modal
    // stop timer, show start screen, then show modal
const statsContainer = document.getElementById('stats-container');
function showStatsModal() {
    if (document.getElementById('play-screen').style.display === 'block') {
        startScreen();
    }

    populateStatistics();
    statsContainer.classList.add('show');
    statsContainer.classList.remove('hidden');

    // helpContainer.classList.add('hidden');
}
const statsX = document.getElementById('stats-modal-close-button');
statsX.addEventListener('click', e => {
    statsContainer.classList.add('hidden');
    statsContainer.classList.remove('show');
})

// settings modal
    // stop timer, show start screen, then show modal
// const settingsContainer = document.getElementById('settings-container');
// function showSettingsModal() {
//     settingsContainer.classList.add('show');
//     settingsContainer.classList.remove('hidden');
// }
// const settingsX = document.getElementById('settings-modal-close-button');
// settingsX.addEventListener('click', e => {
//     settingsContainer.classList.add('hidden');
//     settingsContainer.classList.remove('show');
// })

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
    // if (e.target === settingsContainer) {
    //     settingsContainer.classList.remove('show');
    //     settingsContainer.classList.add('hidden');
    // }
})


// should statistics populate everytime "game over" instead of only after clicking on graph icon??
// with keyboard: left arrow = no, right arrow = yes, spacebar = start game/play again
// with touchscreen (Swipe): left = no, right = yes, up = start game/play again
// table format for shortcuts under help modal?

// if timer < 5s, font/background turns red
// Jean's recs:
    // apply color & size theory
    // use color to highlight current score, when running out of time
    // less formal font choice
    // icons on top kinda big
// push and hold feature in settings buttons
// add/subtract time based on right/wrong answers

// width of game window expands slightly when score increases from 9 to 10