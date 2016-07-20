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
};