# PrimeTime
PrimeTime is an interactive numbers game that tests your ability to identify prime numbers within the allotted time.

### [Play Here](https://ttse23.github.io/primetime/)

### <a href="https://ttse23.github.io/primetime/" target="_blank">Play Here</a>

**Link to project:** https://ttse23.github.io/primetime/

![alt tag](http://placecorgi.com/1200/650)

## Features
* Countdown timer integration
* Modal windows for *How To Play* and *Statistics*
* Game statistics saved onto browser's local storage
* Responsive web design

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

In order to create this game, I broke down the content into three distinct parts: the actual game itself, and two separate modal windows (*How To Play* and *Statistics*).

The main gameplay functions include:
* `getNum` - selects a random number from 1 to n, inclusively *(Note: n is defaulted to 100)*
* `isPrime` - checks if a number is prime or not
* `checkAnswer` - checks user's answer, and gives explanation if incorrect

The logic of the game is as follows:
1. Random number is selected and displayed
2. User chooses *YES* or *NO*, identifying whether or not the displayed number is prime
3. Check user's response
    - If correct, score increases by one point, a new random number is selected and displayed, and the game continues from Step 1
    - If wrong, the game is over, see Step 4
4. Show explanation and final score

After getting the logic above to work as expected, I integrated a countdown timer to give the game a time limit to make it more exciting and replayable *(Note: timer is defaulted to 30 seconds)*. With the timer in place, the game now ends either once an incorrect response is given **OR** once the timer reaches 0 seconds.

<!-- For the actual gameplay, a random number from 1 to 100 (inclusive) is selected and displayed, and the user must identify it as prime or not. If the user identifies the number that is shown correctly, another number is then selected and displayed, and the game continues. By default, players have 30 seconds to correctly identify as many numbers as possible before the game ends. If an incorrect response is given at any time, the game ends immediately.

the allotted time for the game is 30 seconds, which is integrated through a *Timer* object.  -->

The game instructions are shown in the *How To Play* modal window, in addition to the shortcuts users may use. Keyboard users are able to use the **Left Arrow** *(NO)* and **Right Arrow** *(YES)* as well as the **Spacebar** *(START/PLAY AGAIN)* which is detected through the `keydown` event. Touchscreen users on the other hand are able to **Swipe Left** *(NO)* and **Swipe Right** *(YES)* which is detected by comparing the `touchend` event x-coordinate to the `touchstart` event x-coordinate.

The *Statistics* modal window shows user data on *Games Played*, *Average Score*, *High Score*, as well as a histogram visualizing the distribution of all the user's previous scores. This is made possible by saving stats to localStorage at the completion of each game.

Drawing inspiration from the popular online game Wordle's UI, I took a mobile-first approach while designing this game and made it responsive through the use of media queries.

<!-- Here's where you can go to town on how you actually built this thing. Write as much as you can here, it's totally fine if it's not too much just make sure you write *something*. If you don't have too much experience on your resume working on the front end that's totally fine. This is where you can really show off your passion and make up for that ten fold. -->

## Optimizations

I think the user experience for PrimeTime might be better if the game was more customizable. Here are some features that I would incorporate to do so:
* Modal window for *Settings* containing:
    - Toggle for **Hard Mode** *(only odd numbers are shown)*
    - Toggle for **High Contrast Mode** *(for improved color vision)*
    - User-defined maximum number *(instead of 100)*
    - User-defined time limit *(instead of 30 seconds)*

<!-- You don't have to include this section but interviewers *love* that you can not only deliver a final product that looks great but also functions efficiently. Did you write something then refactor it later and the result was 5x faster than the original implementation? Did you cache your assets? Things that you write in this section are **GREAT** to bring up in interviews and you can use this section as reference when studying for technical interviews! -->

## Lessons Learned:

In order to successfully create this game, I had to combine my existing knowledge of HTML, CSS, and JavaScript *(particularly on DOM manipulation and event listeners)* with my newfound knowledge of modals and localStorage attained through the MDN website and other various resources.

While integrating the countdown timer into the game, I encountered an issue where the timer was not counting down appropriately while the window was minimized. After some research, I learned that for inactive tabs, browsers automatically throttle timers to run every 1 second, regardless of the original delay specified in the setInterval *(which in my case is 1/10 second)*. In order to fix this issue, I specified the *endTime* property as a function of the *startTime* using JavaScript's *Date* object. By making this modification, the *endTime* property remains constant once the timer starts and allows the timer to behave as expected, regardless of whether or not the window is active.

<!-- No matter what your experience level, being an engineer means continuously learning. Every time you build something you always have those *whoa this is awesome* or *fuck yeah I did it!* moments. This is where you should share those moments! Recruiters and interviewers love to see that you're self-aware and passionate about growing.

## Examples:
Take a look at these couple examples that I have in my own portfolio:

**Palettable:** https://github.com/alecortega/palettable

**Twitter Battle:** https://github.com/alecortega/twitter-battle

**Patch Panel:** https://github.com/alecortega/patch-panel -->