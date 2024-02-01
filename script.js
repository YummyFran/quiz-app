const categoriesNode = document.querySelector('.categories')
const introNode = document.querySelector('.intro')
const quizNode = document.querySelector('.quiz')
const loaderNode = document.querySelector('.loader')
const questionNode = document.querySelector('.question')
const optionsNode = document.querySelector('.options')
const progessNode = document.querySelector('.scorer')
const scoreNode = document.querySelector('.score')
const levelNode = document.querySelector('.level')
const finalScoreNode = document.querySelector('.final-score')
const gameOverNode = document.querySelector('.game-over')

const categories = [
    "Random Quiz",
    "General Knowledge",
    "Entertainment:  Books",
    "Entertainment:  Film",
    "Entertainment:  Music",
    "Entertainment:  Musicals & Theaters",
    "Entertainment:  Television",
    "Entertainment:  Video Games",
    "Entertainment:  Board Games",
    "Science & Nature",
    "Science: Computer",
    "Science: Mathematics",
    "Mythodology",
    "Sports",
    "Geography",
    "History",
    "Politics",
    "Art",
    "Celebrities",
    "Animals",
    "Vehicles",
    "Entertainment: Comics",
    "Science: Gadgets",
    "Entertainment: Japanese Anime & Manga",
    "Entertainment: Cartoon & Animation"
]

let questions = []
let currentQuestion = 0
let score = 0

function init() {
    currentQuestion = 0
    score = 0
    questions.length = 0

    updateSize()

    hide(gameOverNode)
    show(introNode)

    categories.forEach((cat, i) => {
        const category = document.createElement('div')
    
        category.classList.add("category")
        category.dataset.categoryId = i == 0 ? 0 : i + 8
        category.innerText = cat
    
        category.onclick = () => startQuiz(category.dataset.categoryId)
    
        categoriesNode.appendChild(category)
    })
}

async function startQuiz(category) {
    document.title = categories[category - 8]

    hide(introNode)
    show(loaderNode)

    await generateQuestion(5, category, 'easy').then((data) => {
        data.forEach(el => questions.push(el))
    })

    await wait(5000)

    await generateQuestion(5, category, 'medium').then((data) => {
        data.forEach(el => questions.push(el))
    })

    await wait(5000)

    await generateQuestion(5, category, 'hard').then((data) => {
        data.forEach(el => questions.push(el))
    })

    hide(loaderNode)
    show(quizNode)
    updateSize()    
    loadQuestion()
}

async function generateQuestion(amount, category, difficulty) {
    const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`)
    const data = await res.json()
    
    return data.results
}

function loadQuestion() {
    if(currentQuestion >= 15) {
        finalScoreNode.innerText = `Final Score: ${score}`
        hide(quizNode)
        show(gameOverNode)
        return
    }

    const question = questions[currentQuestion]
    questionNode.innerText = question.question

    const opt1 = document.createElement('button')
    const opt2 = document.createElement('button')
    const opt3 = document.createElement('button')
    const opt4 = document.createElement('button')

    const randomizer = Math.random()
    let count = 0

    opt1.innerHTML =  randomizer < 0.25 ? question.correct_answer : question.incorrect_answers[count++]
    opt2.innerHTML =  randomizer < 0.50 && randomizer > 0.25 ? question.correct_answer : question.incorrect_answers[count++]
    opt3.innerHTML =  randomizer < 0.75 && randomizer > 0.50 ? question.correct_answer : question.incorrect_answers[count++]
    opt4.innerHTML =  randomizer < 1 && randomizer > 0.75? question.correct_answer : question.incorrect_answers[count++]

    opt1.onclick = () => checkAnswer(opt1, question)
    opt2.onclick = () => checkAnswer(opt2, question)
    opt3.onclick = () => checkAnswer(opt3, question)
    opt4.onclick = () => checkAnswer(opt4, question)

    optionsNode.appendChild(opt1)
    optionsNode.appendChild(opt2)
    optionsNode.appendChild(opt3)
    optionsNode.appendChild(opt4)

    console.log(questions)
}

function checkAnswer(choice, question) {
    if(choice.innerHTML == question.correct_answer) {
        score++
        scoreNode.style.width = `${(score/questions.length) * 100}%`
    } else {
        choice.style.background = 'red'
    }
    
    currentQuestion++
    levelNode.style.width  = `${(currentQuestion / questions.length) * 100}%`
    optionsNode.childNodes.forEach(opt => {
        if(opt.innerHTML == question.correct_answer) {
            opt.style.background = 'green'
        }
    })
    setTimeout(() => {
        while(optionsNode.hasChildNodes()) {
            optionsNode.removeChild(optionsNode.firstChild)
        }
        loadQuestion()
    }, 1000)
}

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const show = (node) => node.style.display = 'flex'
const hide = (node) => node.style.display = 'none'

const updateSize = () => {
    scoreNode.style.backgroundSize = `${progessNode.clientWidth}px`
}

addEventListener('resize', updateSize)
init()