//DOM
const main = document.getElementById("clues")

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

getBibleVerse("philippians", 1, 29).then(text=>{displayVerse(text);displayTimer()})
getBooks().then(array=>console.log(array))

async function getBooks() {
	const url = `${baseURL}${endPoints[3]}?`
  const arrayOfBooks =await fetch(url, options)
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
		return splitSpliceJoin(book,2)
	})
	const test2M = test2.map(book => {
		return splitSpliceJoin(book,3)
	})
	function splitSpliceJoin(word,numOfLetters)
	{
		word=word.split("")
		word.shift()
		word.splice(-numOfLetters,numOfLetters)

		return word.join("")
	}
	let lastBook = testament[testament.length - 1].split("")
	lastBook.shift()
	return [...test1M, ...test2M, lastBook.join("")]
}
//Gets any verse
async function getBibleVerse(book, chapter, verse) {
	const url = `${baseURL}${endPoints[0]}?Verse=${verse}&chapter=${chapter}&Book=${book}`
	const text=await fetch(url, options)
		.then(response => response.json())
		.then(verse => {
			return verse.Output
		})
		.catch(err => console.error(err))
		return text
}
//Display a verse
function displayVerse(verse) {
	let text = verse
	text = text.split(" ")
	const arrayOfTrs = createTrs(text.length)
	let i = 0, j = 0
	text.forEach(word => {
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

}

