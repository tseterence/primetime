// check if num is prime
function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false
    }
    return num > 1
}

// return random num from 1 to num, inclusive
function getNum(num) {
    return Math.floor(Math.random() * num + 1)
}

function startScreen() {
    hideScreens('screen')
    toggleScreen('start-screen', true)
    t.stop()
}

function startGame() {
    hideScreens('screen')
    toggleScreen('play-screen', true)

    console.log('game started')
    document.querySelector('#current-score').innerHTML = '0'
    document.querySelector('#number').innerHTML = `${getNum(Number(document.getElementById('inputMaximum').value))}`
    
    t.start()
}

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
        }, 1);
        
        //
        // this.remainingSeconds = Number(document.getElementById('inputSeconds').value) * 10

        // if (this.remainingSeconds === 0) return;

        // this.interval = setInterval(() => {
        //     this.remainingSeconds--
        //     this.updateTimer()
      
        //     if (this.remainingSeconds === 0) {
        //         this.stop()
        //         document.getElementById('reason').innerHTML = `Time's up!`
        //         endGame()
        //     }
        // }, 100);
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
    }
}

const t = new Timer()


document.querySelector('#no').addEventListener('click', checkPrime)
document.querySelector('#yes').addEventListener('click', checkPrime)
document.querySelector('#home').addEventListener('click', startScreen)


function checkPrime(e) {
    if ((e.target.id === 'no' && isPrime(Number(document.querySelector('#number').innerHTML))) || (e.target.id === 'yes' && !isPrime(Number(document.querySelector('#number').innerHTML)))) {
        // wrong choice - game over
        t.stop()
        endGame()
        if (e.target.id === 'no') {
            document.getElementById('reason').innerHTML = `${document.querySelector('#number').innerHTML} is prime`
        } else if (e.target.id === 'yes') {
            let factors = getFactors(Number(document.querySelector('#number').innerHTML))
            document.getElementById('reason').innerHTML = `${factors[0]} x ${factors[1]} = ${document.querySelector('#number').innerHTML}`
        }
    } else {
        // continue game
        document.querySelector('#current-score').innerHTML++
        document.querySelector('#number').innerHTML = `${getNum(Number(document.getElementById('inputMaximum').value))}`
    }
}

// get factors of num
function getFactors(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return [i, num / i]
    }
}

function endGame() {
    hideScreens('screen')
    toggleScreen('end-screen', true)

    console.log('game ended')

    displayResult()
    checkHighScore()
}

function displayResult() {
    // if prime, say prime
    // else show first whole factor
    document.getElementById('final-score').innerHTML = `${document.getElementById('current-score').innerHTML}`
}

function checkHighScore() {
    if (document.querySelector('#current-score').innerHTML > document.querySelector('#high-score').innerHTML) {
        document.querySelector('#high-score').innerHTML = document.querySelector('#current-score').innerHTML
    }
}

function resetHighScore() {
    document.querySelector('#high-score').innerHTML = '0'
}

function showAbout() {
    hideScreens('screen')
    toggleScreen('about-screen', true)
    t.stop()
}

function showSettings() {
    hideScreens('screen')
    toggleScreen('settings-screen', true)
    t.stop()
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


// only whole integers greater than 0 allowed in input
document.querySelector('#subOne').addEventListener('click', () => {
    if (document.getElementById('inputMaximum').value > 1) {
        document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value--
    }
})
document.querySelector('#addOne').addEventListener('click', () => document.getElementById('inputMaximum').innerHTML = document.getElementById('inputMaximum').value++)

document.querySelector('#subSec').addEventListener('click', () => {
    if (document.getElementById('inputSeconds').value > 1) {
        document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value--
    }
})
document.querySelector('#addSec').addEventListener('click', () => document.getElementById('inputSeconds').innerHTML = document.getElementById('inputSeconds').value++)



// horizontal swiping ability for mobile?
// not allow < 1 for max and time in settings window


// function startTimer() {
//     const countdownEl = document.getElementById('countdown')
//     const startingSeconds = Number(document.getElementById('seconds').value)
//     let time = startingSeconds * 10

//     let t = setInterval(updateTimer, 100)
//     function updateTimer() {
//         if (time >= 0) {
//             const seconds = Math.floor(time / 10)
//             let deciseconds = time % 10
//             countdownEl.innerHTML = `${seconds}.${deciseconds}`
//             time--
//         }
//         if (time === 0) {
//             // clearInterval(t)
//             endGame()
//         }
//     }
// }