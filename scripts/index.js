//DOM
const main = document.getElementById("clues")
const form = document.querySelector(".form")
const input = document.getElementById("verse-field")
const scores = document.getElementById("scores")
const answer1 = document.getElementById("answer1")
const answer2 = document.getElementById("answer2")
const answer3 = document.getElementById("answer3")
const head1 = document.getElementById("book")
const head2 = document.getElementById("chap")
const head3 = document.getElementById("ver")
const loadNext = document.getElementById("load-next")
const count = document.querySelector(".count")
const countDown = document.getElementById("count-down")
const hey = document.querySelector(".hey")
//Fetch
const baseURL = 'https://ajith-holy-bible.p.rapidapi.com/'
const endPoints = ['GetVerseOfaChapter', 'GetVerses', 'GetChapter', 'GetBooks']
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6720fd1680msh24bd9fc4828fef4p1799f1jsnd932a9177f39',
		'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
	}
}
const colors = ['5ebec4', 'f92c85', '2568fb', '1a2238', 'ff6a3d', '394f8a', '4056a1', '490b3d', 'bd1e51'
	, 'f1b814', '00abe1', '161f6d', 'fb8122', '1d2228', 'e40c2b', '1d1d2c', '3cbcc3', '438945', 'eba63f', '000000',
	'181818', 'e60576', '562264', 'facd3d', 'ef0d50', '0b4141', 'ff6864', '150734', '0f2557', 'fa255e', '9e15bf',
	'3f6844', '01345b', '5ce0d8', 'ffcf43', '141824', 'ffb60', '0049ff',]
const chapters = [
	50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22,
	25, 29, 36, 10, 13, 10, 42, 150, 31, 12,
	8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4,
	28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4,
	3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22
]

async function getChapter(book, chapterNum) {
	const url = `${baseURL}${endPoints[2]}?chapter=${chapterNum}&Book=${book}`
	const chapter = await fetch(url, options)
		.then(response => response.json()).catch(err => console(`${err}, chapter not found`))
	return [book, chapterNum, chapter]
}
function numberOfVerses(chapterString) {
	chapterString = chapterString.split(" ")
	for (let i = chapterString.length - 1; i > 0; i--) {
		let num = parseInt(chapterString[i], 10)
		if (num) return num
	}
}
function scoreManager(reference, input) {
	let score = 0
	let scoreMultiplier = Math.floor(parseInt(countDown.innerText, 10) / 3) + 1
	input = input.split(":")
	let boo = input[0].toUpperCase() == reference[0].toUpperCase()
	let chap = input[1] == reference[1]
	let ver = input[2] == reference[2]
	const heyImage = document.createElement("img")
		heyImage.className = "heyImage"
	function createRightWrong(right) {
		if (right) {
			const right = document.createElement("img")
			right.src = "./images/right.jpeg"
			right.className = "right-wrong"
			return right
		}
		else {
			const wrong = document.createElement("img")
			wrong.src = "./images/wrong.png"
			wrong.className = "right-wrong"
			return wrong
		}
	}


	if (boo) {
		score += 20 * scoreMultiplier
		head1.append(createRightWrong(true))
	}
	else {
		head1.append(createRightWrong(false))
	}
	if (boo && !chap && !ver) {
		heyImage.src = "./images/nada.png"

	}
	if (boo && chap) {
		score += 80 * scoreMultiplier
		head2.append(createRightWrong(true))
	}
	else {
		head2.append(createRightWrong(false))
	}
	if (boo && chap && !ver) {
		heyImage.src = "./images/two.png"
	}
	if (boo && chap && ver) {
		score += 150 * scoreMultiplier
		heyImage.src = "./images/wow.png"
		head3.append(createRightWrong(true))
	}
	else {
		head3.append(createRightWrong(false))
	}
	if (!boo && !chap && !ver) {
		heyImage.src = "./images/hmm.png"
	}
	hey.append(heyImage)
	scoreText = scores.innerText.split(":")
	scores.innerText = `Score: ${parseInt(scoreText[1], 10) + score}`
	answer1.innerText = `${reference[0]} `
	answer2.innerText = ` ${reference[1]}:`
	answer3.innerText = `${reference[2]}`
}

async function getBooks() {
	const url = `${baseURL}${endPoints[3]}?`
	const arrayOfBooks = await fetch(url, options)
		.then(response => response.json())
		.then(books => {
			return [...prepBooksData(books.The_Old_Testament),
			...prepBooksData(books.The_New_Testament)]
		})
	return arrayOfBooks
}
//removes spaces and numbering from the string and returns an array of books
function prepBooksData(testament) {
	testament = testament.split(".")
	testament.shift()
	let test1 = testament.slice(0, 8)
	let test2 = testament.slice(8, testament.length - 1)
	const test1M = test1.map(book => {
		return splitSpliceJoin(book, 2)
	})
	const test2M = test2.map(book => {
		return splitSpliceJoin(book, 3)
	})
	function splitSpliceJoin(word, numOfLetters) {
		word = word.split("")
		word.shift()
		word.splice(-numOfLetters, numOfLetters)

		return word.join("")
	}
	let lastBook = testament[testament.length - 1].split("")
	lastBook.shift()
	return [...test1M, ...test2M, lastBook.join("")]
}
//Gets any verse
async function getBibleVerse(book, chapter, verse) {
	const url = `${baseURL}${endPoints[0]}?Verse=${verse}&chapter=${chapter}&Book=${book}`
	const text = await fetch(url, options)
		.then(response => response.json())
		.then(verse => {
			return verse.Output
		})
		.catch(err => console.error(err))
	return [[book, chapter, verse], text]
}
//Display a verse
function displayVerse(verse) {
	const timeId = displayTimer()
	verse = verse.split(" ")
	const arrayOfTrs = createTrs(verse.length)
	let i = 0, j = 0
	verse.forEach(word => {
		const h2 = document.createElement("h2")
		h2.style.fontSize = `${(Math.floor(Math.random() * 100 + 20) / 30)}em`
		const randomColor = colors[Math.floor(Math.random() * colors.length)]
		//Math.floor(Math.random() * 16777215).toString(16)
		h2.style.color = "#" + randomColor
		h2.className = "verse-h2"

		i++
		if (i > 7) {
			j += 1
			i = 0
		}

		h2.textContent = word + " "
		arrayOfTrs[j].append(h2)
	})
	return timeId
}
function createTrs(wordLength) {
	main.innerHTML = ""
	const tdNum = Math.ceil(wordLength / 7)
	let arrayOfTrs = []
	let i = 0
	while (i < tdNum) {
		let tr = document.createElement("tr")
		tr.className = "row"
		main.append(tr)
		arrayOfTrs.push(tr)
		i++
	}
	return arrayOfTrs
}
function displayTimer() {
	const timeId = setInterval(() => {
		countDown.innerText = parseInt(countDown.innerText, 10) - 1
		if (countDown.innerText == 0) {
			clearTimeout(timeId)
		}
	}, 1000)
	return timeId
}
//autocomplete
function autoComplete(inputElement, arrayOfBooks) {
	const autoCompleteDiv = document.querySelector(".autocomplete")
	inputElement.addEventListener("input", e => {
		const val = e.target.value
		closeAllLists()
		if (!val) return false
		const itemsDiv = document.createElement("div")
		itemsDiv.id = "autocomplete-list"
		itemsDiv.className = "autocomplete-items"
		autoCompleteDiv.append(itemsDiv)

		arrayOfBooks.forEach(book => {
			if (book.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				const item = document.createElement("div")
				item.innerHTML = "<strong>" + book.substr(0, val.length) + "</strong>"
				item.innerHTML += book.substr(val.length)
				item.innerHTML += "<input type='hidden' class='hidden' value='" + book + "'>"

				item.addEventListener('click', () => {
					inputElement.value = item.getElementsByClassName('hidden')[0].value + ":"
					closeAllLists()
				})
				itemsDiv.append(item)
			}
		})
	})
	inputElement.addEventListener('keydown', e => {
		let items = document.getElementById("autocomplete-list")
		if (items) items = items.getElementsByTagName("div")
		if (e.keyCode == 13) {
			e.preventDefault()
			if (items) { items[0].click() }
		}
	})
	function closeAllLists() {
		const items = document.getElementsByClassName("autocomplete-items")
		for (let i = 0; i < items.length; i++) {
			if (true) {
				items[i].parentNode.removeChild(items[i])
			}
		}
	}
	document.addEventListener('click', e => {
		closeAllLists()
	})
}

////Callses
//get a random verse and display 
loadVerse()
function loadVerse() {
	getBooks().then(data => {
		const bible = {}
		for (let i = 0; i < data.length; i++) {
			bible[data[i]] = chapters[i]
		}
		const randomBook = data[Math.floor(Math.random() * data.length)]
		return ([randomBook, Math.ceil(Math.random() * bible[randomBook])])
	})
		.then(randomBC => {
			getChapter(...randomBC)
				.then(chapter => {
					const verse = Math.ceil(Math.random() * numberOfVerses(chapter[2].Output))
					return [chapter[0], chapter[1], verse]
				})
				.then(reference => {
					getBibleVerse(...reference)
						.then(refAndVerse => {
							input.focus()
							const timeId = displayVerse(refAndVerse[1])
							form.addEventListener('submit', formListener)
							function formListener(e) {
								e.preventDefault()
								clearInterval(timeId)
								scoreManager(refAndVerse[0], input.value)
								input.value = ""
								loadNext.style.display = "block"
								form.removeEventListener("submit", formListener)
								form.style.display = "none"
								main.style.marginTop = "40px"
							}
						})
				})
		})
}

//start autocomplete for the form
getBooks().then(books => {
	autoComplete(input, books)
})
//load the next verse

loadNext.addEventListener("click", () => {
	console.log("I am here")
	loadVerse()
	hey.innerHTML = ""
	countDown.innerText = "60"
	loadNext.style.display = "none"
	answer1.innerText = ''
	answer2.innerText = ''
	answer3.innerText = ''
	head1.innerText=''
	head2.innerText=''
	head3.innerText=''
	form.style.display = "block"
	main.style.marginTop = "0px"
})
 