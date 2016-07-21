// Functions for User Name
// Checks to see if a user has set a name.
function whatsInAName() {
    var prompt = "Do you have a name?";

    if (localStorage) {
        if (localStorage.getItem("name") === null) {
            promptName();
        } else {
            $('#name').text(localStorage.getItem("name"));
        }
    }
}

// Allows user to change their name
function changeName() {
    if (localStorage) {
        $("#name").click(promptName);
    }
}

// Prompts for a name change
function promptName() {
    var row = $("<div></div>");
    var column = $("<div></div>");
    var form = $("<form action=# class=\"user-name form-inline\"><fieldset class=\"form-group\"></fieldset></form>")
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

    $("form.user-name").submit( function(e) {
        e.preventDefault();

        var name = $(this).find("input.name").val();

        if (name.length > 0) {
            $('#name').text(name);
            localStorage.setItem("name", name);
        } else {
            return;
        }

        $(".get-name").fadeOut(200, function() { $(this).remove(); });
    });
}




// Functions for Quiz
var allQuizzes = [];
var activeQuiz = '';
var recentScores = [];


/**
 *	Sets initial name of active quiz
 */
function setQuizName() {
	$(".quiz-name").text(activeQuiz.name);
}


/**
 *  Updates length of current quiz.
 */
function quizLength() {
    $('.total').text(activeQuiz.questions.length);
}


/**
 * Loads the five most recent scores from a user.
 */
function loadRecentScores() {
    if (localStorage) {
        if (localStorage.getItem("recentScores")) {
            recentScores = JSON.parse(localStorage.getItem("recentScores"));
            var listOfScores = $("#recent-scores").find("li");
            
            for (var i = 0; i < recentScores.length; i++) {
                var score = recentScores[i];
                var newRecord = $("<li></li>")
                    .attr({
                        "class": "list-group-item"
                    })
                    .text(score.name + " - " + score.time)
                    .append(
                        $("<span></span>")
                            .attr({"class": "label label-default label-pill pull-xs-right"})
                            .text(score.score + "%")
                    );

                newRecord.insertAfter(listOfScores.first());
            }
        } else {
            return false;
        }
    }
}


/**
 * Loads quizzes either from local storage or loads default quizzes
 */
function loadQuizzesToSelection() {
    if (localStorage) {
        // User has previously created quizzes, get these from local storage and turn them into the appropriate objects
        if (localStorage.getItem("quizzes")) {
            var previousQuizzes = JSON.parse(localStorage.getItem("quizzes"));

            previousQuizzes.forEach( function(quiz){
                var questions = [];

                // Question objects
                quiz.questions.forEach( function(question) {
                   questions.push(new Question(question.question, question.choices, question.correctAnswer));
                });

                // Adding Quiz object to allQuizzes array
                allQuizzes.push(new Quiz(quiz.name, questions));
            });
        } else {
            loadDefault();
        }

        /**
         * Creating quiz listings
         */
        for (var i = 0; i < allQuizzes.length; i++) {
            createQuizListing(allQuizzes[i], i);
        }

    } else {
        loadDefault();
    }

    $("body").on("click", "li.more a", function(e) {
        e.preventDefault();
        $("#quizzes").find("li.hidden").slideToggle(200);
        $(this).text() === "More" ? $(this).text("Less") : $(this).text("More");
    });


    function loadDefault() {
        var quiz1 = new Quiz("Default Quiz", []);
        quiz1.addQuestion(new Question("This is the first question?",["yes","no"],"yes"));

        quiz1.addQuestion(new Question("This is the second question?",["si","no","not sure"],"si"));
        quiz1.addQuestion(new Question("What is the air-speed velocity of an unladen swallow?",["african","european","african or european?","i don't know that"],"african or european?"));
        allQuizzes.push(quiz1);

        activeQuiz = allQuizzes[0];
    }
}


/**
 * Creates a quiz in the markup
 * @param {Quiz} quizObj - listing to be added
 * @param {number} index - Index of object in allQuizzes[]
 */
function createQuizListing (quizObj, index) {
    var title = quizObj.name;
    var quizList = $("#quizzes").find("li");
    var display = quizList.length >= 5 ? "display: none" : "display: block";
    var hiddenClass = quizList.length >= 5 ? "hidden" : "";
    var newQuiz = $("<li class=\"list-group-item " + hiddenClass + "\" style=\"" + display + "\"><a href=\"#\" data-index=\"" + index + "\">" + title + "</a></li>");

    if (quizList.length === 5) {
        $("<li class=\"list-group-item list-group-item-info more\"><a href=\"#\">More</a></li>").insertAfter(quizList.last());
    }

    newQuiz.insertAfter(quizList.not(".more").last());
}


/**
 * Loads a quiz from the allQuizzes array
 * @param {number} index - index of quiz to be loaded in allQuizzes[]
 */
function loadQuiz(index) {
    activeQuiz = allQuizzes[index];

    var header = $(".card-header");
    var	body = $(".card-block");
    var count = $(".current");

    $(".btn.next").prop("disabled",false);

    body.fadeTo(400, 0, function() {
        $(this)
            .html("<h5>Let's get started on: " + activeQuiz.name + "</h5>")
            .fadeTo(400, 1);
    });

    setQuizName();
    quizLength();
}

function previousQuestion() {
	$(".btn.prev").click( function() {
		var currentQuestion = $("form").attr("data-question");
        if (currentQuestion === activeQuiz.questions.length !== 0) {
            loadQuestion(activeQuiz.questions[currentQuestion - 1], currentQuestion -1);
        } else {
            return false;
        }
	});
}


function nextQuestion() {
	$(".btn.next").click( function() {
		var currentQuestion = parseInt($("form.quiz-question").attr("data-question"));
        var warning = $(".answer.alert");

        if (questionAnswered() === false) {
            warning
                .text("Please select an answer")
                .fadeIn(200);
            return false;
        } else {

            if (currentQuestion === activeQuiz.questions.length - 1) {
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

                setTimeout( function() {
                    displayResults(activeQuiz.getScore());
                    storeScore(activeQuiz.getScore());
                }, 800);
                
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
}


/**
 * Checks to see if an answer has been selected
 * @returns {boolean} - whether an answer has been chosen
 */
function questionAnswered() {
    var answers = $("input[name=choice]");

    if (answers.length > 0) {
        return answers.is(":checked");
    }
}


/**
 * Checks if an answer is correct.
 * @returns {boolean}
 */
function checkAnswer() {
    var currentQuestion = activeQuiz.questions[parseInt($("form.quiz-question").attr("data-question"))];
    var chosenAnswer = $("input[name=choice]:checked").val();
    var correctAnswer = currentQuestion.correctAnswer;

    currentQuestion.setLastAnswer(chosenAnswer);

    return chosenAnswer === correctAnswer;
}


/**
 * Displays the final quiz score
 * @param score - score calculated from user answers
 */
function displayResults(score) {
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
                    .removeClass("animating")
                    .attr("disabled",true);
            });
    });

    body.fadeTo(400, 0, function() {
        $(this)
            .html("<h5>Your score: " + score + "%</h5>")
            .fadeTo(400, 1);
    });
}


/**
 *	Populates a question into the markup
 *	@param questionObj {Question} - the question to be posed
 *	@param index {number} - index in the array of activeQuiz
 */
function loadQuestion(questionObj, index) {
	var header = $(".card-header");
	var	body = $(".card-block");
	var form =
        $("<form></form>")
        .attr({
            "action": "#",
            "class": "quiz-question",
            "data-question": index
        })
        .append(
            $("<fieldset></fieldset>").attr({"class": "form-group"})
        );
    var warning = $("<div></div>").attr({"class": "answer alert alert-danger"});
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
}


/**
 * Stores a score in an array + local storage and displays it in the markup with percent correct answers and date
 * @param score - final score
 */
function storeScore(score) {
    var time = new Date();
    var quizResult = {name: activeQuiz.name, score: score, time: time.toLocaleDateString() + " " + time.toLocaleTimeString()};
    var newRecord =
        $("<li></li>")
            .attr({
                "class": "list-group-item"
            })
            .text(quizResult.name + " - " + quizResult.time)
            .append(
                $("<span></span>")
                    .attr({"class": "label label-default label-pill pull-xs-right"})
                    .text(quizResult.score + "%")
            );
    var listOfScores = $("#recent-scores").find("li");

    if (recentScores.length >= 5) {
        recentScores.splice(0, 1);
        recentScores.push(quizResult);
    } else {
        recentScores.push(quizResult);
    }

    if (localStorage) {
        localStorage.setItem("recentScores", JSON.stringify(recentScores));
    }

    if (listOfScores.length > 5) {
        listOfScores.last().remove();
    }

    newRecord.insertAfter(listOfScores.first());
}


/**
 * Loads a new quiz form from AJAX into a modal, adds interactivity
 */
function newQuiz() {
    $(".add-quiz").click( function(e) {
        e.preventDefault();

        var url = $(this).attr("href");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "html",
            success: function(html) {
                var container = $("<div class=\"modal-block\"></div>");
                var background = $("<div class=\"modal-background\"></div>");
                var row = $("<div class=\"row\"></div>");
                var quizForm = $("form.new-quiz");

                container.append(html);

                container.add(background)
                    .prependTo($("body"))
                    .fadeIn();

                container.on("click", ".btn", function(e) {
                    e.preventDefault();
                });

                $("#quiz-name").focusout( function() {
                    if ($(this).val().length === 0) {
                        if ($(this).siblings(".alert").length > 0) {
                            return;
                        }

                        $("<div class=\"alert alert-danger\">Please enter a quiz name.</div>")
                            .insertAfter($(this))
                            .fadeIn(200);
                    } else {
                        $(this).siblings(".alert")
                            .fadeOut(200, function() {
                                $(this).remove();
                            });
                    }
                });

                container.on("click", ".add-answers", function() {
                    var question = $(this).closest("formset");
                    var questionNumber = question.attr("data-question");
                    var lastAnswerNumber = parseInt(question.find(".question").last().attr("data-answer"));
                    var newAnswerNumbers = [lastAnswerNumber + 1, lastAnswerNumber + 2];
                    var newRow =  $("<div class=\"row\"></div>");

                    // Creating new answer inputs
                    for (var i = 0; i < newAnswerNumbers.length; i++) {
                        var inputName = "q" + questionNumber + "a" + newAnswerNumbers[i];

                        newRow.append($("<div class=\"col-xs-12 col-sm-6 question\" data-answer=\"" + newAnswerNumbers[i] + "\"><input type=\"text\" class=\"form-control question-answer\" id=\"" + inputName + "\" name=\"" + inputName + "\" placeholder=\"Enter an answer\" /><small><label>Correct Answer? <input type=\"radio\" name=\"q" + questionNumber + "-correctAnswer\" value=\"" + inputName + "\" /></label></small></div>"));
                    }

                    newRow
                        .hide()
                        .insertBefore($(this).closest(".row.controls"))
                        .fadeIn(200);

                    backgroundSize();
                });

                container.on("click", ".add-question", function() {
                    var lastQuestion = $(".modal-block").find("formset").last();
                    var newQuestionNumber = parseInt(lastQuestion.attr("data-question")) + 1;
                    
                    var newFormset = $("<formset></formset>").attr({
                        "class":"form-group new quiz-question",
                        "data-question":newQuestionNumber
                    });

                    newFormset.html("<div class=\"row\"></div><div class=\"row\"></div>");

                    var formsetRows = newFormset.find(".row");

                    var containerOne = $("<div></div>").attr({"class":"col-xs-12"}); 
                    var newLabel = $("<label></label>")
                        .attr({"for":"question-"+newQuestionNumber})
                        .text("Question " + newQuestionNumber);
                    var newInput = $("<input />").attr({
                        "type":"text",
                        "class":"form-control question-text",
                        "id":"question-"+newQuestionNumber,
                        "name":"question-"+newQuestionNumber,
                        "placeholder":"Enter a Question"
                    });

                    containerOne.append(newLabel,newInput);
                    formsetRows.first().append(containerOne);

                    for (var i = 1; i <= 2; i++) {
                        var containerTwo = $("<div></div>").attr({
                            "class":"col-xs-12 col-sm-6 question",
                            "data-answer":i
                        });
                        var input = $("<input />").attr({
                            "type":"text",
                            "class":"form-control question-answer",
                            "id":"q" + newQuestionNumber + "a" + i,
                            "name":"q" + newQuestionNumber + "a" + i,
                            "placeholder":"Enter an answer"
                        });
                        var defaultLabel = $("<small><label><span>Correct Answer\? </span><label></small>");
                        var defaultRadio = $("<input />").attr({
                            "type":"radio",
                            "name":"q" + newQuestionNumber + "-correctAnswer",
                            "value":"q" + newQuestionNumber + "a" + i
                        });

                        defaultLabel.append(defaultRadio);
                        containerTwo.append(input, defaultLabel);

                        formsetRows.last().append(containerTwo);
                    }

                    newFormset.append($("<div class=\"row controls\"><div class=\"col-xs-12\"><button class=\"btn btn-primary add-answers\">Add Answers</button></div></div>"));

                    newFormset
                        .hide()
                        .insertAfter(lastQuestion)
                        .fadeIn(1000);
                    $("<hr />").insertAfter(lastQuestion);

                    backgroundSize();
                });

                $(".btn.exit").click( function() {
                    $(".modal-block, .modal-background").fadeOut( function() {
                        $(this).remove();
                    });
                });

                $(".btn.save").click( function() {
                    console.log("enter");
                    var warning = $("<div class=\"alert alert-danger\"></div>");
                    var quizName = $("#quiz-name").val();
                    var questions = $(".new.quiz-question");
                    var questionArray = [];
                    var content = $(".modal-block .card-block");

                    content.children(".alert")
                        .remove();

                    if (quizName.length === 0) {
                        warning
                            .text("Please enter a quiz name.")
                            .appendTo(content)
                            .fadeIn(200);

                        return;
                    }

                    // Adding questions and choices to questionArray in form of Question object
                    questions.each( function() {
                        var questionText = $(this).find(".question-text").val();
                        var answers = [];
                        var correctAnswer = "#" + $(this).find("input[type=radio]:checked").val();

                        if (questionText.length === 0) {
                            // do nothing
                        } else {
                            $(this).find(".question-answer").each( function() {
                                var answerText = ($(this)).val();
                                if (answerText.length === 0) {
                                    // do nothing
                                } else {
                                    answers.push(answerText);
                                }
                            });

                            correctAnswer = $(correctAnswer).val();

                            questionArray.push(new Question(questionText, answers, correctAnswer));
                        }
                    });

                    allQuizzes.push(new Quiz(quizName, questionArray));

                    if (localStorage) {
                        localStorage.setItem("quizzes",JSON.stringify(allQuizzes));
                    }

                    createQuizListing(allQuizzes[allQuizzes.length - 1], allQuizzes.length - 1);

                    $(".modal-block, .modal-background").fadeOut( function() {
                        $(this).remove();
                    });
                });


                var backgroundSize = function() {
                    $(".modal-background").css({"height":$(document).height()});
                }

            }
        })
    });
}


$(document).ready(function(){
    loadQuizzesToSelection();
    loadRecentScores();
    previousQuestion();
	nextQuestion();
	whatsInAName();
	changeName();
    newQuiz();


    $("body").on("click", "input[name=choice]", function () {
        checkAnswer();
    });

    $("#quizzes").on("click", "a", function() {
        if ($(this).hasClass("add-quiz")) { return; }
        else if ($(this).parent().hasClass("more")) { return; }
        loadQuiz(parseInt($(this).attr("data-index")));
    });
});