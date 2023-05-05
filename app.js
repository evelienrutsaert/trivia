// DOM Elements
const selectTag = document.querySelector("#category");
const selectDifficulty = document.querySelector("#difficulty");
const ulPossibleAnswers = document.querySelector(".possibleAnswers");
const divQuestion = document.querySelector(".question");

const btnNewQuestion = document.querySelector(".newQuestion");
const btnCheckAnswer = document.querySelector(".checkAnswer");
const startDifficulties = ["easy", "medium", "hard"];
const startTags = [
	"history",
	"music",
	"biology",
	"arts_and_literature",
	"capital_cities",
	"general_knowledge",
	"geography",
];
let currentTags = "";
let currentDifficulties = "";
let correctAnswer = "";

/**
 *
 * @param {Array} tags
 * @param {Array} difficulties
 * @returns {Promise} object of one question
 */
const getTrivia = async (tags, difficulties) => {
	const url = `https://the-trivia-api.com/v2/questions?limit=1&tags=${tags.join(
		","
	)}&difficulties=${difficulties.join(",")}`;
	const res = await fetch(url);
	const data = await res.json();
	return data;
};

/**
 *	Sests question and anwsers to screen
 * @param {Object} question
 */
const handleTrivia = (question) => {
	//set question
	divQuestion.innerHTML = question.question.text;
	//Get all possible anwsers
	let allAnswers = question.incorrectAnswers;
	correctAnswer = question.correctAnswer;
	allAnswers.push(question.correctAnswer);

	//Random sort all possible anwsers
	allAnswers.sort(() => Math.random() - 0.5);

	//Empty previous answers-list
	ulPossibleAnswers.innerHTML = "";

	//add all new anwsers
	allAnswers.forEach((answer) => {
		const li = document.createElement("li");
		li.innerHTML = answer;
		li.addEventListener("click", () => {
			let otherLi = document.querySelector(".selected");
			if (otherLi) otherLi.classList.toggle("selected");
			li.classList.toggle("selected");
		});
		ulPossibleAnswers.appendChild(li);
	});
};

//If tag selection changes, recreate fetch-url
selectTag.addEventListener("change", (event) => {
	currentTags = [event.target.value];
	let difficulties = !currentDifficulties
		? startDifficulties
		: currentDifficulties;
	getTrivia(currentTags, difficulties).then((res) => {
		res.forEach((question) => {
			handleTrivia(question);
		});
	});
});

//If difficulty selection changes, recreate fetch-url
selectDifficulty.addEventListener("change", (event) => {
	currentDifficulties = [event.target.value];
	let tags = !currentTags ? startTags : currentTags;
	getTrivia(tags, currentDifficulties).then((res) => {
		res.forEach((question) => {
			handleTrivia(question);
		});
	});
});

const init = () => {
	//fill dropdowns
	startTags.forEach((tag) => {
		const opt = document.createElement("option");
		opt.value = tag;
		opt.innerText = tag.charAt(0).toUpperCase() + tag.slice(1);
		selectTag.appendChild(opt);
	});
	startDifficulties.forEach((difficulty) => {
		const opt = document.createElement("option");
		opt.value = difficulty;
		opt.innerText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
		selectDifficulty.appendChild(opt);
	});

	//Generate new question
	btnNewQuestion.addEventListener("click", () => {
		let tags = !currentTags ? startTags : currentTags;
		let difficulties = !currentDifficulties
			? startDifficulties
			: currentDifficulties;
		getTrivia(tags, difficulties).then((res) => {
			res.forEach((question) => {
				handleTrivia(question);
			});
		});
	});
	//check if selected anwser is correct
	btnCheckAnswer.addEventListener("click", () => {
		const allLi = document.querySelectorAll("li");

		allLi.forEach((li) => {
			if (li.innerHTML == correctAnswer) li.classList.add("correctAnswer");
			if (li.classList.contains("selected")) {
				if (document.querySelector(".selected").innerHTML == correctAnswer) {
					li.style.backgroundColor = "green";
				} else {
					li.style.backgroundColor = "tomato";
				}
			}
			li.classList.add("noclicking");
		});
	});
	//Generate new question when page is loaded
	getTrivia(startTags, startDifficulties).then((res) => {
		res.forEach((question) => {
			handleTrivia(question);
		});
	});
};

init();
