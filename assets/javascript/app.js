$(document).ready(function(){

    //*********** DEFINING VARIABLES AND FUNCTIONS ********************** */

    // prevents the clock from being sped up unnecessarily
    var clockRunning = false;

    //  Variable that will hold our setInterval that runs the stopwatch
    var intervalId;

    //For each quiz assign time as 60 seconds
    var $timeRemaining = 10;

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
        var $question = $("<div>").addClass("form-group mt-3 pt-3 pl-5");

        //Adding question to div
        $("<h4>")
            .text(questionsObj[questionNo].question)
            .appendTo($question); 

        //Adding question - image
        $("<img>")
            .addClass('m-3')
            .attr("src", questionsObj[questionNo].image)
            .attr("width", 250)
            .appendTo($question);
        

        // Shuffle options
        questionsObj[questionNo].options = questionsObj[questionNo].options.sort(function() {
            return .5 - Math.random();
        });
        console.log("Shuffle options: " + questionsObj[questionNo].options);

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

        //Create a border between question and 'Submit button'
        $("#question").css('border-bottom', 'solid 3px grey');


        //Create "Submit" button
        $("<button>")
            .attr("type", "button")
            .addClass("btn btn-info")
            .append(`<h3>Submit</h3>`)
            .appendTo($("#submit"));


    }//End of generateQuestions()



    //*********** DEFINING ONCLICK EVENTS ********************** */

    $("#start").on("click", start);
    $("#submit").on("click", onSubmit);
    $("#strtNewQuiz").on("click", startNewQuiz);


    //*********** DEFINING ONCLICK FUNCTIONS ********************** */

    function start() {

        //Reset 'result' and 'question' element
        $("#result").empty(); 
        $("#question").empty();
        $("#timeRemaining").empty();

        //If all questions have been populated then call final results function
        if(questionNo === questionsObj.length) { 
            calculateCorrectAnswersAndStartQuizAgain();
            correctAnsCount = 0; //Reset count of correct ans
            return;
        }

        //Reset timer to 10 seconds each time new quiz starts
        $timeRemaining = 10;
        $("#timeRemaining").text(`Time Remaining: ${$timeRemaining} seconds`);

        // Shuffle questions before calling generateQuestions() fun only when the quiz starts
        if(questionNo === 0) {
            
            questionsObj = questionsObj.sort(function() {
                return .5 - Math.random();
            });
            console.log("Shuffle question: " + questionsObj);
        }

        //Use setInterval to start the count here and set the clock to running.
        if (!clockRunning) {

            clockRunning = true;

            //Remove "startUp" div from the page
            $("#startUp").empty();

            //Call function to generate question
            generateQuestions();

            //Call setInterval() to run after every second and calculate remaining time
            intervalId = setInterval(calculateTimeRemaining, 1000);
        }
    }


    // Function that calculates the time remaining to asnswe the question 
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
        $("#timeRemaining").text(`Time Remaining: ${$timeRemaining} seconds`);
        
    }


    //Function executed when user clickes on 'Submit' button to submit the answer for a question
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
        var userAnswer = $(`input[name=${questionIndex}]:checked`).val();
        console.log("Correct answer: " + questionsObj[questionNo].correctAns + " :: User answer: " + userAnswer);


        //If user selected correct answer then display Answer is correct
        if(questionsObj[questionNo].correctAns === userAnswer) {
            
            $("<h5>")
            .addClass('btn btn-outline-success m-3')
            .append("<strong>Your answer is Correct.</strong>")
            .appendTo($("#result")); 


            correctAnsCount++; //Calculate number of correct answers
            console.log("correctAnsCount: " + correctAnsCount);
        }
        //If user answers incorrectly or time runs out
        else {

            //If user has not yet selected any option and timer runs out then display Time Up! with correct ans
            if($timeRemaining === 0) {

                $("<h5>")
                .addClass('btn btn-outline-primary m-3')
                .append(`Time Up!! Correct answer is <strong> ${questionsObj[questionNo].correctAns} </strong>`)
                .appendTo($("#result")); 
            }
            else {

                $("<h5>")
                .addClass('btn btn-outline-danger m-3')
                .append(`Nope! Correct answer is <strong> ${questionsObj[questionNo].correctAns} </strong>`)
                .appendTo($("#result")); 
            }
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
        $("<h5>")
            .addClass("m-5 d-flex justify-content-center")
            .text(`Correct Answers: ${correctAnsCount}`)
            .appendTo($("#result"));
        
        $("<h5>")
            .addClass("mt-3 d-flex justify-content-center")
            .text(`Incorrect Answers: ${(questionsObj.length - correctAnsCount)}`)
            .appendTo($("#result"));


        //Create "Start new quiz" button
        $("<button>")
            .attr("type", "button")
            .addClass("btn btn-info mb-5")
            .append(`<h3>Start Quiz Again</h3>`)
            .appendTo($("#strtNewQuiz"));

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
        $("#timeRemaining").text(`Time Remaining: ${$timeRemaining} seconds`);

        $("#result").empty();
        $("#strtNewQuiz").empty();



        start();
    };


}); //End of $(document).ready(function(){