/**
 *	An object representing a question used in the quiz
 *	@param question {string} - The question to be asked
 *	@param choices {Array} - an array of strings with the possible choices
 * 	@param correctAnswer {string} - the correct answer
 */
function Question (question, choices, correctAnswer) {
	this.question = question;
	this.choices = choices;
	this.correctAnswer = correctAnswer;
    this.lastAnswer = "";
    this.lastAnswerCorrect = false;
}

Question.prototype.changeQuestion = function(question) {
	this.question = question;
};

Question.prototype.addAnswer = function(answer) {
	this.choices.push(answer);
};

Question.prototype.removeAnswer = function(answer) {
	var removeIndex = this.choices.indexOf(answer);

	if (removeIndex > -1) {
		this.choices.splice(removeIndex, 1);
	} else {
		console.log("this is not an existing question");
	}};

Question.prototype.changeCorrectAnswer = function(correctAnswer) {
	this.correctAnswer = correctAnswer;
};

Question.prototype.setLastAnswer = function(lastAnswer) {
    this.lastAnswer = lastAnswer;

    if (this.lastAnswer === this.correctAnswer) {
        this.lastAnswerCorrect = true;
    } else {
        this.lastAnswerCorrect = false;
    }
};

/**
 *	A full quiz, this holds questions
 *	@param name {string} - Name of the quiz
 *	@param questions {Array} - Array of question objects
 */
function Quiz (name, questions) {
	this.name = name;
	this.questions = questions;
}

Quiz.prototype.changeName = function (name) {
	this.name = name;
};

Quiz.prototype.addQuestion = function (question) {
	this.questions.push(question);
};

Quiz.prototype.removeQuestion = function (questionText) {
	var removeIndex = -1;
	
	for (var i = 0; i < this.questions.length; i++) {
		if (this.questions[i].question === questionText) {
			removeIndex = i;
		}
	}

    if (removeIndex > -1) {
        this.questions.splice(removeIndex, 1);
    } else {
        console.log("this question isn't in the quiz!");
    }
};

Quiz.prototype.getScore = function() {
    var correctAnswers = 0;
    var totalQuestions = this.questions.length;

    for (var i = 0; i < totalQuestions; i++) {
        console.log(this.questions[i].lastAnswerCorrect)
        if (this.questions[i].lastAnswerCorrect) {
            correctAnswers++;
        }
    }

    return (correctAnswers/ totalQuestions).toFixed(2) * 100;

};