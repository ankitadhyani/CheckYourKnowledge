$(document).ready(function(){

    //*********** DEFINING VARIABLES AND FUNCTIONS ********************** */

    // prevents the clock from being sped up unnecessarily
    var clockRunning = false;

    //  Variable that will hold our setInterval that runs the stopwatch
    var intervalId;

    //For each quiz assign time as 60 seconds
    var $timeRemaining = 10;
    $("#timeRemaining").text($timeRemaining);

    //Counter that tracks the question number
    var questionNo = 0;

    //Variable that stores the number of correct answers
    var correctAnsCount = 0;

    //Object that stores all the questions and their answers
    var questionsObj = [
        {
            question: "Q. Which country's flag is this?",
            image: "assets/images/GermanyFlag.png",
            options: ["Germany" , "Belgium" , "Andorra" , "Monaco"],
            correctAns: "Germany"
        }, { 
            question: "Q. Which country's flag is this?",
            image: "assets/images/UnitedKingdomFlag.png",
            options: ["Tonga" , "United Kingdom" , "Australia" , "United States of America"],
            correctAns: "United Kingdom"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/IndiaFlag.jpg",
            options: ["Republic of Ireland" , "India" , "United Kingdom" , "Australia"],
            correctAns: "India"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/RussiaFlag.jpg",
            options: ["Netherlands" , "Slovakia" , "India" , "Russia"],
            correctAns: "Russia"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/NorwayFlag.jpg",
            options: ["Sweden" , "Norway" , "Iceland" , "Finland"],
            correctAns: "Norway"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/Poland.jpg",
            options: ["Poland" , "Indonesia" , "Canada" , "Monaco"],
            correctAns: "Poland"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/ArgentinaFlag.jpg",
            options: ["El Salvador" , "Poland" , "Argentina" , "Sri Lanka"],
            correctAns: "Argentina"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/EgyptFlag.jpg",
            options: ["Iraq" , "Egypt" , "Sudan" , "Yemen"],
            correctAns: "Egypt"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/ItalyFlag.jpg",
            options: ["Ivory Coast" , "Italy" , "Mexico" , "Ireland"],
            correctAns: "Italy"
        }, {
            question: "Q. Which country's flag is this?",
            image: "assets/images/GreeceFlag.jpg",
            options: ["Uruguay" , "Puerto Rico" , "Greece" , "Cuba"],
            correctAns: "Greece"
    }];


    //Function definition to generate each Question from questionObj[]---------------------------
    function generateQuestions() {

        //If user has completed last question then exit
        if(questionNo === questionsObj.length )
            return;

        // Create div to hold question
        var $question = $("<div>").addClass("form-group m-3");

        //Adding question to div
        var $label = $("<h4>")
        .text(questionsObj[questionNo].question)
        .appendTo($question); 

        //Adding question - image
        var $image = $("<img class='m-3'>");
        $image.attr("src", questionsObj[questionNo].image);
        $image.attr("width", 250);
        $question.append($image);
        

        // Shuffle options
        questionsObj[questionNo].options = questionsObj[questionNo].options.sort(function() {
            return .5 - Math.random();
        });


        // Create a loop to iterate through question's options and create radio buttons for each one
        for(var j=0 ; j<questionsObj[questionNo].options.length ; j++) {

            // Create a div for options and add bootstrap classes
            var $choice = $('<div>');
            $choice.addClass('form-check form-check-inline ml-3');

            
            // Create an input tag for the radio button
            var $radioInput = $('<input>');

            // Add attributes to provide the answer choice
            // the "name" attribute is super important, all radio buttons per question need to have the same "name" so they know which question it applies to
            $radioInput
                .attr({
                    type: "radio",
                    value: questionsObj[questionNo].options[j],
                    name: questionNo,
                    class: "form-check-input pl-3"
                })
                .appendTo($choice);


            // Create label to actually print the choice to the page
            var $choiceLabel = $('<label>');

            $choiceLabel
                .text(questionsObj[questionNo].options[j])
                .addClass('form-check-label pl-3')
                .appendTo($choice);

            // Add radio button choice to question
            $choice.appendTo($question);

        }

        //Appending all elements of the question to the respective div
        $("#question").append($question);

        $("#question").css('border-bottom', 'solid 3px grey');


        //Create "Submit" button
        $("#submit").append("<button type='button' class='btn btn-info btn-lg'><h3>Submit</h3></button>");

    }//End of generateQuestions()



    //*********** DEFINING ONCLICK FUNCTIONS ********************** */

    $("#start").on("click", start);
    $("#submit").on("click", onSubmit);
    $("#strtNewQuiz").on("click", startNewQuiz);


    function start() {

        //Reset 'result' and 'question' element
        $("#result").empty(); 
        $("#question").empty();

        //If all questions have been populated then call final results function
        if(questionNo === questionsObj.length) { 
            calculateCorrectAnswersAndStartQuizAgain();
            correctAnsCount = 0; //Reset count of correct ans
            return;
        }

        //Reset timer to 10 seconds each time new quiz starts
        $timeRemaining = 10;
        $("#timeRemaining").text($timeRemaining);

        //Use setInterval to start the count here and set the clock to running.
        if (!clockRunning) {

            clockRunning = true;

            //Remove "startUp" div from the page
            $("#startUp").empty();

            //Call function to generate question
            generateQuestions();

            intervalId = setInterval(calculateTimeRemaining, 1000);
        }
    }

    function calculateTimeRemaining() {

        //If time is up then do what submit button does
        if($timeRemaining === 0) {
            onSubmit();

            //Use clearInterval to stop the timeRemaining here and set the clock to not be running.
            clockRunning = false;
            clearInterval(intervalId);
            return;
        }
        //Decrement time remaining by 1 after every second and populate it on the page
        $timeRemaining--;
        $("#timeRemaining").text($timeRemaining);
        
    }



    function onSubmit() {
    
        console.log("Question Submitted...");

        $("#submit").empty(); //Remove the Submit button

        //Use clearInterval to stop the timeRemaining here and set the clock to not be running.
        clockRunning = false;
        clearInterval(intervalId);


        // Get question index out of "name" attribute so we know what question you answered
        var questionIndex = $("input").attr("name");
        console.log("Question no (from name attr): " + questionIndex + " ::  Question no: " + questionNo);


        // Get value out of radio button you selected
        var answer = $(`input[name=${questionIndex}]:checked`).val();
        console.log("Correct answer: " + questionsObj[questionNo].correctAns + " :: User answer: " + answer);


        //If user selected correct answer then display Answer is correct
        if(questionsObj[questionNo].correctAns === answer) {
            
            var res = $("<h5 class='m-3'>")
            .append("<strong>Your answer is Correct.</strong>")
            .attr("color", "green");

            $("#result").append(res); 

            correctAnsCount++; //Calculate number of correct answers
            console.log("correctAnsCount: " + correctAnsCount);
        }
        //If user answers incorrectly
        else {
            $("<h5 class='m-3'>")
            .append("<strong>Your answer is Incorrect.</strong>")
            .attr("color", "red")
            .appendTo($("#result")); 
        }

        //Increment questionNo count to populate next question on "start()"
        questionNo++;

        //After 2 seconds, Populate next question
        setTimeout(start, 2000);

    }

    //Function to print correct and incorrect answers and if user wants then start a new quiz
    function calculateCorrectAnswersAndStartQuizAgain() {

        console.log("correctAnsCount ->" + correctAnsCount);

        //Remove questions from the page
        $("#question").empty();

        //Remove submit button from the page
        $("#submit").empty();

        //Show Correct & Answers
        $("#result").append("<h5 class='m-5'>Correct Answers: " + correctAnsCount + "</h5>");
        $("#result").append("<h5 class='m-5'>Incorrect Answers: " + (questionsObj.length - correctAnsCount) + "</h5>");
        

        //Create "Start new quiz" button
        $("#strtNewQuiz").append("<button type='button' class='btn btn-info btn-lg mb-5'><h3>Start new Quiz</h3></button>");

    }

    //The quiz will start again when this button is pressed after 1st load of all questions
    //Also reset all the variable/counters/timers
    function startNewQuiz() { 

        console.log("New quiz started...");

        //Use clearInterval to stop the timeRemaining here and set the clock to not be running.
        clockRunning = false;
        clearInterval(intervalId);

        questionNo = 0;

        var correctAnsCount = 0;

        var $timeRemaining = 10;
        $("#timeRemaining").text($timeRemaining);

        $("#result").empty();
        $("#strtNewQuiz").empty();



        start();
    };


}); //End of $(document).ready(function(){