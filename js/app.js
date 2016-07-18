var allQuizzes = [];
var activeQuiz = new Quiz("The New Quiz", []);

activeQuiz.addQuestion(new Question("This is the first question?",["yes","no"],"yes"));
activeQuiz.addQuestion(new Question("This is the second question?",["si","no","not sure"],"si"));

/**
 *	Sets initial name of active quiz
 */
var setQuizName = function() {
	$(".quiz-name").text(activeQuiz.name);
};

/**
 *  Updates length of current quiz.
 */
var quizLength = function() {
    $('.total').text(activeQuiz.questions.length);
};

var previousQuestion = function() {
	$(".btn.prev").click( function() {
		var currentQuestion = $("form").attr("data-question");
        if (currentQuestion === activeQuiz.questions.length !== 0) {
            loadQuestion(activeQuiz.questions[currentQuestion - 1], currentQuestion -1);
        } else {
            return false;
        }
	});
};

var nextQuestion = function() {
	$(".btn.next").click( function() {
		var currentQuestion = parseInt($("form").attr("data-question"));
        var warning = $(".answer.alert");

        if (questionAnswered() === false) {
            warning
                .text("Please select an answer")
                .fadeIn(200);
            return false;
        } else {

            if (currentQuestion === activeQuiz.questions.length - 1) {
                displayResults(activeQuiz.getScore());
            } else if (isNaN(currentQuestion)) {
                loadQuestion(activeQuiz.questions[0],0);
            } else {
                if (checkAnswer()) {
                    warning
                        .removeClass("alert-danger")
                        .addClass("alert-success")
                        .text("That's correct!")
                        .fadeIn(200);
                } else if (!checkAnswer()) {
                    warning
                        .text("That's incorrect...")
                        .fadeIn(200);
                }
                setTimeout(function() {loadQuestion(activeQuiz.questions[currentQuestion + 1], currentQuestion + 1)}, 800);
            }
        }

	});
};

/**
 * Checks to see if an answer has been selected
 * @returns {boolean} - whether an answer has been chosen
 */
var questionAnswered = function() {
    var answers = $("input[name=choice]");

    if (answers.length > 0) {
        return answers.is(":checked");
    }
};

/**
 * Checks if an answer is correct.
 * @returns {boolean}
 */
var checkAnswer = function() {
    var currentQuestion = activeQuiz.questions[parseInt($("form").attr("data-question"))];
    var chosenAnswer = $("input[name=choice]:checked").val();
    var correctAnswer = currentQuestion.correctAnswer;

    currentQuestion.setLastAnswer(chosenAnswer);

    return chosenAnswer === correctAnswer;
};



var displayResults = function(score) {
    var header = $(".card-header");
    var	body = $(".card-block");
    var prev = $(".btn.prev");
    var next = $(".btn.next");

    prev.add(next)
        .addClass("animating");

    header.fadeTo(400, 0, function() {
        $(this)
            .text("Finished!")
            .fadeTo(400, 1, function() {
                prev.add(next)
                    .removeClass("animating");
            });
    });

    body.fadeTo(400, 0, function() {
        $(this)
            .html("<h5>Your score: " + score + "%</h5>")
            .fadeTo(400, 1);
    });
};

/**
 *	Populates a question into the markup
 *	@param questionObj {Question} - the question to be posed
 *	@param index {number} - index in the array of activeQuiz
 */
var loadQuestion = function(questionObj, index) {
	var header = $(".card-header");
	var	body = $(".card-block");
	var form = $("<form action=\"#\" data-question=\"" + index + "\"><fieldset class=\"form-group\"></fieldset></form>");
    var warning = $("<div class=\"answer alert alert-danger\"></div>");
	var count = $(".current");
	var prev = $(".btn.prev");
    var next = $(".btn.next");

	var createOption = function(choices) {
		var htmlString = "";
        var checked = "";

		for (var i = 0; i < choices.length; i++) {
            if (questionObj.lastAnswer !== "" && questionObj.lastAnswer === choices[i]) {
                checked = "checked";
            }
			htmlString += "<div class=\"radio\"><label><input type=\"radio\" name=\"choice\" value=\"" + choices[i] + "\"" + checked + "\/>" + choices[i] + "</label></div>";
            checked = "";

		}

		return htmlString;
	};

	form.find('.form-group')
        .append(createOption(questionObj.choices));

	prev.attr("disabled",false);

	if (index === 0) {
		prev.attr("disabled",true);
	}

    prev.add(next)
        .addClass("animating");

	header.fadeTo(400, 0, function() {
		$(this).html("Question " + (index+1))
            .fadeTo(400, 1, function() {
                prev.add(next)
                    .removeClass("animating");
		    });
	});

	body.fadeTo(400, 0, function() {
		$(this)
            .html("<h5>" + questionObj.question + "</h5>")
            .append(form)
            .append(warning)
            .fadeTo(400, 1);
    });

	count.text(index+1);
};




// Checks to see if a user has set a name.
var whatsInAName = function() {
	var prompt = "Do you have a name?";

	if (localStorage) {
        if (localStorage.getItem("name") === null) {
            promptName();
        } else {
            $('#name').text(localStorage.getItem("name"));
        }
    }
};

// Allows user to change their name
var changeName = function() {
	if (localStorage) {
        $("#name").click(promptName);
    }
};

// Prompts for a name change
var promptName = function() {
	var row = $("<div></div>");
	var column = $("<div></div>");
	var form = $("<form action=# class=\"form-inline\"><fieldset class=\"form-group\"></fieldset></form>")
	var input = $("<input />");
	var btn = $("<button></button>");

	row
		.addClass("row get-name")
		.css("margin-bottom", "2rem");
	column.addClass("col-xs-12 col-md-8 col-md-offset-2");
	form.addClass("text-xs-center");
	input
		.addClass("name form-control")
		.attr("type","text")
		.attr("placeholder","What is your name?");
	btn
		.addClass("btn btn-secondary")
		.attr("type","submit")
		.text("Submit");

	row.append(column);
	column.append(form);
	form.append(input,btn);

	row
		.hide()
		.insertBefore(".row").first()
		.fadeIn(600);

	form.submit( function(e) {
		e.preventDefault();

		var name = $(input).val();

		if (name.length > 0) {
			$('#name').text(name);
			localStorage.setItem("name", name);
		} else {
			return;
		}

		row.fadeOut(200, function() { $(this).remove(); });
	});
};

$(document).ready(function(){
	setQuizName();
    quizLength();
    previousQuestion();
	nextQuestion();
	whatsInAName();
	changeName();


    $("body").on("click", "input[name=choice]", function () {
        checkAnswer();
    });
});