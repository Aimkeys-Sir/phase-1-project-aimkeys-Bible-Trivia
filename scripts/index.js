//DOM
const main = document.getElementById("clues")
const form = document.querySelector(".form")
const input = document.getElementById("verse-field")
const scores = document.getElementById("scores")
const answer=document.getElementById("answer")
//Fetch
const baseURL = 'https://ajith-holy-bible.p.rapidapi.com/'
const endPoints = ['GetVerseOfaChapter', 'GetVerses', 'GetChapter', 'GetBooks']
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6720fd1680msh24bd9fc4828fef4p1799f1jsnd932a9177f39',
		'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
	}
};
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
	input = input.split(":")
	let boo = input[0].toUpperCase() == reference[0].toUpperCase()
	let chap = input[1] == reference[1]
	let ver = input[2] == reference[2]
	if (boo) {
		score += 20
	}
	if (boo && chap) {
		score += 80
	}
	if (boo && chap && ver) {
		score += 150
	}
	return score
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
	verse = verse.split(" ")
	const arrayOfTrs = createTrs(verse.length)
	let i = 0, j = 0
	verse.forEach(word => {
		const h2 = document.createElement("h2")
		h2.style.fontSize = `${(Math.floor(Math.random() * 100 + 20) / 30)}em`
		const randomColor = Math.floor(Math.random() * 16777215).toString(16)
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

}
function createTrs(wordLength) {
	main.innerHTML=""
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
	const countDown = document.getElementById("countdown")
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
							displayVerse(refAndVerse[1])
							form.addEventListener('submit',formListener)
							function formListener(e) {
								e.preventDefault()
								scores.innerText = scoreManager(refAndVerse[0], input.value)
								form.removeEventListener("submit",formListener)
								loadVerse()
							}
						})
				})
		})
}

//start autocomplete for the form
getBooks().then(books => {
	autoComplete(input, books)
})



