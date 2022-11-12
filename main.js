// return random num from 1 to n, inclusive
function getNum(n) {
    let result = Math.floor(Math.random() * n + 1)
    if (togBtn.checked && result % 2 === 0) return getNum(n)
    else return result
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

    document.querySelector('#current-score').innerHTML = '0'
    document.querySelector('#number').innerHTML = `${getNum(Number(document.getElementById('inputMaximum').value))}`
    
    t.start()
}


document.querySelector('#no').addEventListener('click', checkPrime)
document.querySelector('#yes').addEventListener('click', checkPrime)
document.querySelector('#home').addEventListener('click', startScreen)


function checkPrime(e) {
    if ((e.target.id === 'no' && isPrime(Number(document.querySelector('#number').innerHTML))) || (e.target.id === 'yes' && !isPrime(Number(document.querySelector('#number').innerHTML)))) {
        // wrong answer - game over
        t.stop()
        endGame()

        if (e.target.id === 'no') {
            document.getElementById('reason').innerHTML = `${document.querySelector('#number').innerHTML} is prime`
        } else if (e.target.id === 'yes') {
            if (document.querySelector('#number').innerHTML === '1') {
                document.getElementById('reason').innerHTML = `By definition, 1 is not prime`
            } else {
                let factors = primeFactors(Number(document.querySelector('#number').innerHTML))
                document.getElementById('reason').innerHTML = `${document.querySelector ('#number').innerHTML} = ${factors}`
            }
        }
    } else {
        // right answer - continue game
        document.getElementById('current-score').innerHTML++
        checkHighScore()
        document.querySelector('#number').innerHTML = `${getNum(Number(document.getElementById('inputMaximum').value))}`
    }
}

function endGame() {
    hideScreens('screen')
    toggleScreen('end-screen', true)

    displayResult()
}

function displayResult() {
    // if prime, say prime
    // else show first whole factor
    document.getElementById('final-score').innerHTML = `${document.getElementById('current-score').innerHTML}`
}

function checkHighScore() {
    if (Number(document.getElementById('current-score').innerHTML) > Number(document.getElementById('high-score').innerHTML)) {
        document.getElementById('high-score').innerHTML = document.getElementById('current-score').innerHTML
    }
}

function resetHighScore() {
    document.querySelector('#high-score').innerHTML = '0'
}

function showHelp() {
    hideScreens('screen')
    toggleScreen('about-screen', true)

    t.stop()
}

function showSettings() {
    hideScreens('screen')
    toggleScreen('settings-screen', true)

    t.stop()
}

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

document.querySelector('#subOne').addEventListener('click', () => {
    if (document.getElementById('inputMaximum').value > 1) {
        document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value--
    }
})
document.querySelector('#addOne').addEventListener('click', () => {
    if (document.getElementById('inputMaximum').value < 1000) {
        document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value++
    }
})

document.querySelector('#subSec').addEventListener('click', () => {
    if (document.getElementById('inputSeconds').value > 1) {
        document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value--
    }
})
document.querySelector('#addSec').addEventListener('click', () => {
    if (document.getElementById('inputSeconds').value < 300) {
        document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value++
    }
})


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
        this.remainingSeconds = Number(document.getElementById('inputSeconds').value * 1000)
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
const togBtn = document.getElementById('togBtn')
console.log(togBtn.checked)


// swipe function
let touchstartX = 0
let touchendX = 0
    
function checkDirection() {
    if (document.getElementById('play-screen').style.display === 'block') {
        if (touchendX < touchstartX) document.getElementById('no').click()
        if (touchendX > touchstartX) document.getElementById('yes').click()
    }
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})

// use localstorage for high score
// with keyboard: left arrow = no, right arrow = yes
// if timer < 5s, turn font red
// credit icons
// Jean's recs:
    // apply color & size theory
    // use color to highlight current score, when running out of time
    // less formal font choice
    // icons on top kinda big
// push and hold feature in settings buttons