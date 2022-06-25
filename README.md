# phase-1-project-aimkeys-Bible-Trivia
It's time for us to remind ourselves some Bible verses! You like that?
Bible Trivia is an app that displays a random verse from any book in the Bible
and allows you to guess the verse. See what score you can get to!!
![image](https://github.com/Aimkeys-Sir/phase-1-project-aimkeys-Bible-Trivia/blob/final/images/screenshot2.png?raw=true)

## Features
The app contains:
1. A section a random Bible verse is displayed.
2. A form for inputting the guess
3. A timer
4. A score-board
5. Score animations

## Code
The app is single page and uses  html, javascript and css.

## API
The project utilize the Bible API from [rapidApi.com](https://rapidapi.com/ajith/api/holy-bible/) by Ajith Joseph.

## Javascript
The index.js file contains several functions which will be discussed in summary below.
### Variables in the DOM
We declare the variables in the DOM. This allows us to do all the manipulation in the DOM. 
### Fetch
We declare the baseURl, the endpoints and the options.
```js
const baseURL = 'https://ajith-holy-bible.p.rapidapi.com/'
const endPoints = ['GetVerseOfaChapter', 'GetVerses', 'GetChapter', 'GetBooks']
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6720fd1680msh24bd9fc4828fef4p1799f1jsnd932a9177f39',
		'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
	}
}
```
### Other declarations
The colors array helps us to give the verse we display random colors.It's kind of cool.
The chapters array helps us to create an object that has all the Books of the Bible as keys and the
number of chapters as the values. This object allows us to know the reach of the chapters per book so
that we can get a random chapter.

### getChapter()
It takes a book `string` and a chapter number as parameters. It fetches the chapter and returns
an array of containing the chapter and book passed and the response from fetch.
```js
async function getChapter(book, chapterNum) {
	const url = `${baseURL}${endPoints[2]}?chapter=${chapterNum}&Book=${book}`
	const chapter = await fetch(url, options)
		.then(response => response.json()).catch(err => console(`${err}, chapter not found`))
	return [book, chapterNum, chapter]
  }
  ```
  ### numberOfVerses()
  To get a random verse that exists, we need to know how many verses each verse contains.
  `numberOfVerses(chapter)` a chapter and returns the number of verses in it. The chapter, as fetched
  from the `api` contains verses which are number at the beginning of each. `numberOfVerses` words from the end and gets
  the number of the last verse.
  ```js
  function numberOfVerses(chapterString) {
	chapterString = chapterString.split(" ")
	for (let i = chapterString.length - 1; i > 0; i--) {
		let num = parseInt(chapterString[i], 10)
		if (num) return num
	}
}
```
### getbooks() and prepBooksData()
`getbooks()` function fetches a  `string` of books in the old  and new testament. `prepBooksData` prepares the data from from each testament, i.e removes 
white spaces and numberings then returns an `array` of books in the testament.  `getbooks()` joins these two arrays and `returns a response of an `array` of all the books in the Bible.
```js
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
```
### getBibleVerse()
This function takes in the reference of a verse(book,chapter,verse) and fetches the verse. It returns the `response` of that verse and the reference as an array.
```js
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
```
### displayVerse(), displayTimer(), and createTrs()
`displayVerse` function takes in the verse text and displays it. The text is added to table rows created by `createTrs` function. `createTrs` takes in the
numbers of words and makes rows such that each contains atmost 7 words.
```js
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
```
`displayVerse` also calls the `displayTimer` function so that the timer starts once the the verse is displayer. Both `return` the `timer Id`.
```js
function displayTimer() {
	const timeId = setInterval(() => {
		countDown.innerText = parseInt(countDown.innerText, 10) - 1
		if (countDown.innerText == 0) {
			clearTimeout(timeId)
		}
	}, 1000)
	return timeId
}
```
`displayTimer` counts-down from 60 seconds.

### autoComplete
This function takes in the `input` element that will be added the functionality and an array of books that will be the source of the autocomplete data.
It adds an event listener of type `'input'`. Upon input, we loop through the `arrayOfBooks` and find all books that begin with the text entered. We add this books' `string` to a `div`  of lists below the input. Each `div` in the list contains a hidden input whose value is the "book".
```js
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
//if a book is clicked, the value of the hidden input is added to the main input.
				item.addEventListener('click', () => {
					inputElement.value = item.getElementsByClassName('hidden')[0].value + ":"
					closeAllLists()
				})
				itemsDiv.append(item)
			}
		})
	})
  //upon `enter` the value of the first item's hidden input is added to the main input by simulating a click event declared above.
	inputElement.addEventListener('keydown', e => {
		let items = document.getElementById("autocomplete-list")
		if (items) items = items.getElementsByTagName("div")
		if (e.keyCode == 13) {
			e.preventDefault()
			if (items) { items[0].click() }
		}
	})
  //Clears lists when a new input is entered, the keydown button is pressed, one presses out of the list(in the document) or there's no input on the main input.
	function closeAllLists() {
		const items = document.getElementsByClassName("autocomplete-items")
		for (let i = 0; i < items.length; i++) {
			if (true) {
				items[i].parentNode.removeChild(items[i])
			}
		}
	}
  //the listener allows us to clear lists if one clicks out
	document.addEventListener('click', e => {
		closeAllLists()
	})
}
```
### scoresManager
It:
1. Calculates scores. Compares the input with the reference and gives scores accordingly. It also factors in the time taken and calculates a `scoreMultiplier`.
2. Adds animation images according to the score achieved.
```js
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
```
### LoadVerse function
This is  a function that brings it all together. 
1. getBooks()-- fetch an array of all books and calculate a random book and chapter(return them)
2. getChapter() -- fetch the random chapter and get a random verse from each. Return a full reference
3. getBibleVerse() -- fetch the verse from the reference.
4. dispayVerse() -- display and start timer
5. form -- add `submit` listener. on submit, call the scoreManager, update score.

### load the next verse
A button loads the next verse onclick.

## License
*MoringaSchool*
copyright (c) **kelvin ngugi**
This app is a availed as a response to the Phase-1 project challenge of the Software Development Course at Moringa School. Permission is hereby granted to any person who want to make a copy of the project to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
