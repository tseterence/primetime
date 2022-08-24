// check if num is prime
function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false
    }
    return num > 1
}

// return random num from 1 to num, inclusive
function getNum(num = 200) {
    return Math.floor(Math.random() * num + 1)
}

function startScreen() {
    hideScreens('screen')
    toggleScreen('start-screen', true)
}

function startGame() {
    hideScreens('screen')
    toggleScreen('play-screen', true)

    console.log('game started')
    document.querySelector('#current-score').innerHTML = '0'
    document.querySelector('#number').innerHTML = `${getNum()}`

    startTimer()
}

document.querySelector('#no').addEventListener('click', checkPrime)
document.querySelector('#yes').addEventListener('click', checkPrime)
document.querySelector('#home').addEventListener('click', startScreen)
const countdownEl = document.getElementById('countdown')

function startTimer() {
    const startingSeconds = Number(document.getElementById('seconds').value)
    let time = startingSeconds * 10

    let t = setInterval(updateTimer, 100)
    function updateTimer() {
        if (time >= 0) {
            const seconds = Math.floor(time / 10)
            let deciseconds = time % 10
            countdownEl.innerHTML = `${seconds}.${deciseconds}`
            time--
        }
        if (time === 0) {
            clearInterval(t)
            endGame()
        }
    }
}


function checkPrime(e) {
    if ((e.target.id === 'no' && isPrime(Number(document.querySelector('#number').innerHTML))) || (e.target.id === 'yes' && !isPrime(Number(document.querySelector('#number').innerHTML)))) {
        // wrong choice - game over
        endGame()
    } else {
        // continue game
        document.querySelector('#current-score').innerHTML++
        document.querySelector('#number').innerHTML = `${getNum()}`
    }
}

function endGame() {
    hideScreens('screen')
    toggleScreen('end-screen', true)

    console.log('game ended')
    // show user why selection was wrong, divisor vs prime
    checkHighScore()
}

function displayResult() {
    // if prime, say prime
    // else show first whole factor
}

function checkHighScore() {
    if (document.querySelector('#current-score').innerHTML > document.querySelector('#high-score').innerHTML) {
        document.querySelector('#high-score').innerHTML = document.querySelector('#current-score').innerHTML
    }
}

function resetHighScore() {
    document.querySelector('#high-score').innerHTML = '0'
}

function showInfo() {
    hideScreens('screen')
    toggleScreen('info-screen', true)
    // stop timer (reset?)
}

function showSettings() {
    hideScreens('screen')
    toggleScreen('settings-screen', true)
    // stop timer (reset?)
}

function hideScreens(cl) {
    let elements = Array.from(document.getElementsByClassName(cl))
    elements.forEach(element => element.style.display = 'none')
}

function toggleScreen(id, toggle) {
    let element = document.getElementById(id)
    let display = (toggle) ? 'block' : 'none'
    element.style.display = display
}



// horizontal swiping ability for mobile?