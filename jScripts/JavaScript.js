
//דף התחברות//
var userObj;
var userType = 0;
var userName;
var userPassword;
var myName = "";
var myId = "";
var myGroupID, myProgramID, sAnsweredQuestionsSum, sAnsweredRightQuestionsSum, myCurrentQuestion;
var myPreviousQuestions = new Array();

//אם נכון - המשתמש עדיין לא ענה על חידת השבוע ואפשר להציג אותה, אם שגוי - הוא כבר ענה.
var newQuestionActive = true;

function systemLogin() {
    userType = $('input[name=userTypeChoice]:checked').val();
    userName = $('#userNamrTXT').val();
    userPassword = $('#userPasswordTXT').val();
    console.log("סוג משתמש: " + userType + ", שם משתמש: " + userName + ", סיסמא: " + userPassword);
    if (userName == "test") {
        testRun(userPassword);
        $(location).attr('href', "#homePage");
        homePageOnLoad();
    }
    else {
    $.get("Handler.ashx", {
        actionType: "login",
        userType: userType, 
        userName: userName,
        userPassword: userPassword
    },

        function (data, status) {

            if (status == "success") {

                console.log(data);

                //אם אין משתמש
                if (data == "no user") {
                    $('#loginFormFeedback').html("פרטי ההתחברות שגויים, נסו שוב");
                }
                //אם יש משתמש
                else {
                    //alert(data);
                    userObj = JSON.parse(data);
                    
                    myName = userObj[0]["myName"];
                    myId = userObj[0]["ID"];
                    console.log("משתמש התחבר, שם:" + myName + ", id: " + myId);
                    //אם זה חניך
                    if (userType == "1") {
                        //שאיבת נתונים רלוונטים וסידורם
                        myGroupID = userObj[0]["groupID"];
                        myProgramID = userObj[0]["programID"];
                        sAnsweredQuestionsSum = userObj[0]["sAnsweredQuestionsSum"];
                        sAnsweredRightQuestionsSum = userObj[0]["sAnsweredRightQuestionsSum"];
                        myCurrentQuestion = userObj[0]["groupCurrentQuestion"];

                        console.log("ID: " + myId + ";  Group ID: " + myGroupID + ";  Program ID: " + myProgramID + ";  Name: " + myName + ";  User Name: " + userName + ";  Password: " + userPassword + "; How much questions I answered: " + sAnsweredQuestionsSum + "; from that was true: " + sAnsweredRightQuestionsSum + ";  my current question is: " + myCurrentQuestion);

                        ////ארגון טבלת חידות עבר
                        getMyPreviousQuestions();
                        //alert(myPreviousQuestions[1]["answerdByUser"]);
                        //בדיקה האם יש חידה חדשה להציג
                       
                        //עדכון עמוד הפרופיל שלי
                        updateMyProfilePage();
                        //מעבר לדף הרלוונטי
                        $(location).attr('href', "#homePage");
                        homePageOnLoad();
                    }

                    //אם זה מדריך
                    else if (userType == "2") {
                        alert("כניסת מדריכים טרם קיימת")
                    }
                    else {
                        alert("תקלה עם בחירת סוג הכניסה");
                    }

                }
            }
            });
    }
}

function homePageOnLoad() {
    $("#userGreetingP").html("שלום לך " + myName);
}

////דף הבית//
////מעבר לדף הפרופיל שלי//
function goLoadMyProfile() {
    
    $(location).attr('href', "#myprofilePage");
}
function goLoadPreviousQuestions() {

    $(location).attr('href', "#previousQuestionsPage");
}

//מנגנון החידות//
var obj;
var rightAnsSTR;
var rightAns;
var openQRightAns=new Array();
var qType;
var distractorCount = 0;
var rightAnswerFeedbackText = "תשובה נכונה, כל הכבוד!";
var wrongAnswerFeedbackText = "תשובה שגויה, בואו נדבר בפעילות הבאה ונלמד מזה ";
var paritalAnswerFeedbackText = "תשובה חלקית";
var checkboxClickedCount = 0;
var TotalQuestionsCount = 3;

//משתנים לנתונים לאחר מענה
var responseTrue = "";
var responseValue = "";


var videoURL = "";


function findQuestion() {
   
    distractorCount = 0;
    //הסתרת כפתור השאלה הבאה
    $("#nextQuestionBTN").parent().hide(500);
    //הסתדרת דיב המשוב
    $("#feedbackDiv").hide();
    
    ////get game code
    //var questioncodeFromTxt = currentQ;

    //call to handler
    $.get("Handler.ashx", {
        questionCode: myCurrentQuestion, //sent game code
    },
     
    function (data, status) {

        if (status == "success" || userName=="test" ) {

            //console.log(data);
          
            //if game not found or not publish
            if (data == "לא נמצאה שאלה") {

                //printing the message to the screen
                $("#feedback").html(data);
            }
            else {
                //convert response to json format
                if (userName == "test") {
                    


                    switch (userPassword) {
                        case "1":
                            alert("h");
                            obj = JSON.parse('{ "qID": 1, "qProgramID": 1, "qName": "רוקחים בהיסטוריה", "qTypeID": 1, "qStem": "כבר אלפי שנים שאנחנו קיימים,\r\n מופיעים בהיסטוריה ובסיפורי עמים \r\nתמצאו אותנו אצל רוקחים ורופאים,\r\nאך גם אצל מכשפים או זקני שבט עתיקים.", "qResourceType": 2, "qResourceLink": "https://www.youtube.com/watch?v=Ttan4G4SpDg", "qOption1": "מלא ידע", "qOption2": "שיקויים", "qOption3": "קדרה עם זנב סלמנדרה", "qOption4": "וואלה אין לי מושג", "qOption5": "", "qOption6": "", "qCorrectAns": "2" }');
                            break;
                        case 2:
                            // code block
                            break;
                        case 3:
                            // code block
                            break;
                        default:
                            alert("סיסמא לא נכונה");
                    }
                }
                else {
                    obj = JSON.parse(data);
                    console.log(data);
                    
                }
               
                //הצגת שם השאלה ותוכן השאלה
                $("#q1Name").html(obj[0]["qName"]);
                $("#q1Stem").html(obj[0]["qStem"]);
                //בדיקת סוג השאלה - 1 לשאלת חד ברירה, 2 לשאלת רב ברירה, 3 לשאלה פתוחה עם תשובה קצרה
                qType = obj[0]["qTypeID"];
                //יצירת מערך עם המסיחים הנכונים
                if (qType != 3) {
                    rightAnsSTR = obj[0]["qCorrectAns"];
                    console.log("מערך המסיחים הנכונים ישר מהנתונים " + rightAnsSTR);
                    rightAns = rightAnsSTR.split(",");
                }
                else {
                    console.log("סוג שאלה: 3");
                }
                //חשיפת אזור השאלה     
                $("#mainQuestionDiv").css("opacity", "1");
                $("#mainQuestionDiv").slideDown()
               
               //ריקון אזור השאלה 
                $("#questionFieldset").empty();
                $("#feedbackP").html("");
                //יצירת המסיחים
                //סוג שאלה - חד ברירה
                if (qType == 1) {
                               
                    console.log("שאלת חד ברירה");
                    for (i = 1; i < 7; i++) {
                        console.log(obj[0]['qOption' + i]);
                        if (obj[0]['qOption' + i]) {
                            distractorCount++;
                            //הוספת אינפוט
                            var distraction = document.createElement('input');
                            distraction.type = "radio";
                            distraction.name = "radio-choice-w-6";
                            distraction.id = "radio-choice-w-6" + i;
                            distraction.value = i;
                            distraction.style = "opacity:0;";
                            $("#questionFieldset").append(distraction);
                            //הוספת לייבל

                            var mylabel = "<label name='radioLabelName' for='radio-choice-w-6" + i + "'>" + obj[0]['qOption' + i] + "</label>";
                            $("#questionFieldset").append(mylabel);
                           

                            $(document).on('click touchstart', 'label[for=radio-choice-w-6' + i + ']', function () {
                                console.log("אירוע לחיצה על מסיח");
                                if ($("#feedbackDiv").css("display") == "none") {
                                    $("#checkAnswerBTN").parent().fadeIn(500);
                                }
                                
                            });
                        }
                        else {
                           
                        }
                    }
                    $("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");

                  
                }
                    //סוג שאלה - רב ברירה
                else if (qType == 2) {
                    console.log("שאלת רב ברירה");
                    for (i = 1; i < 7; i++) {
                        console.log(obj[0]['qOption' + i]);
                        if (obj[0]['qOption' + i]) {
                            distractorCount++;
                            //הוספת אינפוט
                            var distraction = document.createElement('input');
                            distraction.type = "checkbox";
                            distraction.name = "checkbox-choice-w-6";
                            distraction.id = "checkbox-choice-w-6" + i;
                            distraction.value = i;
                            distraction.style = "opacity:0;";
                            $("#questionFieldset").append(distraction);
                            //הוספת לייבל

                            var mylabel = "<label for='checkbox-choice-w-6" + i + "'>" + obj[0]['qOption' + i] + "</label>";
                            $("#questionFieldset").append(mylabel);
                            //בלחיצה תהיה בדיקה האם נבחרו 2 מסיחים ואם כן כפתור ההגשה יחשף
                            //$(document).on('click touchstart', 'label[for=checkbox-choice-w-6' + i + ']', function () {
                            //    console.log("אירוע לחיצה על מסיח");
                            //    $("#checkAnswerBTN").parent().fadeIn(500);
                            //});




                            $(document).on('click touchstart', 'label[for=checkbox-choice-w-6' + i + ']', function () {
                                console.log("אירוע לחיצה על מסיח");
                                var ansChecked = $(this).hasClass("ui-checkbox-on");
                                
                                console.log("האם לחוץ?" + ansChecked);
                                if (ansChecked == false) {
                                      checkboxClickedCount++;
                                }
                                else {
                                    checkboxClickedCount--;
                                }
                               
                                if (checkboxClickedCount > 1) {
                                    if ($("#feedbackDiv").css("display") == "none") {
                                        $("#checkAnswerBTN").parent().fadeIn(200);
                                    }
                                     
                                    
                                }
                                else {
                                    $("#checkAnswerBTN").parent().fadeOut(200);
                                }

                                console.log("מספר מסיחים לחוצים"+checkboxClickedCount);
                            });
                        }
                        else {

                        }
                    }
                    $("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");

                }
                    //סוג שאלה - פתוחה תשובה קצרה
                else if (qType == 3) {
                    console.log("שאלה פתוחה תשובה קצרה");
                    //יצירת שדה טקסט להזנת התשובה
                    var labelAndTextInput = "<label for='text-3' style='margin-right:10px;'>רשמו את תשובתכם כאן:</label><input type='text' data-clear-btn='true' name='text-3' onkeydown='checkTextInputCharCount()' onchange='checkTextInputCharCount()' onpaste='checkTextInputCharCount()' id='text-3' class='textInputForQuestion' value='' style='direction:rtl; text-align:right; margin-right:10px;'>";
                    $("#questionFieldset").append(labelAndTextInput);
                    $("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");
                    
                    //מילוי מערך התשובות הנכנונות בתשובות הנכונות ממאגר הנתונים
                    for (i = 1; i < 7; i++) {
                        console.log("תשובה נכונה: "+obj[0]['qOption' + i]);
                        if (obj[0]['qOption' + i]) {
                            openQRightAns[i] = obj[0]['qOption' + i];
                        }
                        else {

                        }
                    }
                    console.log("מערך התשובות הנכונות: " + openQRightAns);

                   
                  
                    $("a[title='Clear text']").on("click", function () {
                       
                        $("#checkAnswerBTN").parent().fadeOut(200);
                    });
                }
                else {
                    alert("חסר סוג שאלה");
                }
                console.log("number of distractors: " + distractorCount);
                //טעינת התמונה במידה ויש
                if (obj[0]["qResourceType"] == 1) {
                    $("#qPic").show();
                    $("#qPic").attr("src", obj[0]["qResourceLink"]);
                    console.log("לינק תמונה " + obj[0]["qResourceLink"]);
                    $("#qPic").fadeIn(1100);
                }
                else {
                    $("#qPic").hide();
                    $("#qPic").attr("src", "");
                    $("#qPic").fadeOut(100);
                }
                //טעינת סרטון במידה ויש
                if (obj[0]["qResourceType"] == 2) {
                    $("#GiftPopupVideoIframe").fadeIn(500);
                    videoURL = obj[0]["qResourceLink"];
                    console.log("יש סרטון בחידה זו, בקישור: " + obj[0]["qResourceLink"]);
                    $("#GiftPopupVideoIframe").attr("src", "https://www.youtube.com/embed/" + videoURL.split('=')[1])+"?autoplay=1";
                }
                else {
                    $("#GiftPopupVideoIframe").hide();
                    $("#GiftPopupVideoIframe").attr("src", "");
                    
                }
                //טעינת קישור אתר  במידה ויש
                if (obj[0]["qResourceType"] == 3) {
                    $("#GiftPopupWebLinkIframe").fadeIn(500);
                    var weblinkURL = obj[0]["qResourceLink"];
                    console.log("יש קישור לאתר אינטרטנ חיצוני בחידה זו: " + weblinkURL);
                    $("#GiftPopupWebLinkIframe").attr("src",weblinkURL);
                }
                else {
                    $("#GiftPopupWebLinkIframe").hide();
                    $("#GiftPopupWebLinkIframe").attr("src", "");

                }
            }
        }
    });
    //החזרת כפתור הגשה
    $("#checkAnswerBTN").parent().fadeOut(200);
    //איפוס משתנה סופר קליקים שאלת רב ברירה
    checkboxClickedCount = 0;
    //שינוי נוסח הכפתור
    //החזרת הנחיה וכפתור משאב
    $("#qInstruction").fadeIn(150);
    $("#qGiftButton").css("top", "75%");
    $("#qGiftButton").css("width", "40px");
    $("#qGiftButton").css("height", "40px");

    $("#startBtn").parent().fadeOut(500);
    //העלמת אייקון השלמת חידה
    $("#whiteCrownIcon").css({"opacity": "0","right":"-16px"});
    $("#startBtn").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    $("#endQuizeBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    $("#nextQuestionBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });

    $("#checkAnswerBTN").parent().addClass("checkAnswerBTN");
    $("#nextQuestionBTN").parent().addClass("checkAnswerBTN");
}

//בדיקת כמות האותיות והאם יש לפחות 1 אז אפשר להראות את כפתור ההגשה
function checkTextInputCharCount() {
    $("#text-3").delay(500);
    var userTextEntry = $("#text-3").val();
    var userTextEntryCount = userTextEntry.length;
    console.log(userTextEntryCount);
    if (userTextEntryCount >= 0) {
        $("#checkAnswerBTN").parent().fadeIn(200);
    }
    else {
        $("#checkAnswerBTN").parent().fadeOut(200);
    }
    
}



//לחיצה על כפתור הגשה - בדיקת תשובה ומתן משוב
function checkAnswer() {
    $('input[name=radio-choice-w-6]').attr("disabled", "disabled");
    //העלמת ההנחייה והזזת כפתור המשאב
    $("#qInstruction").fadeOut(150);
    $("#qGiftButton").css("top", "0px");
    $("#qGiftButton").css("width", "30px");
    $("#qGiftButton").css("height", "30px");
    //חשיפת דיב המשוב
    $("#feedbackDiv").fadeIn();
   
    //if (currentQ == TotalQuestionsCount) {
    //    console.log("נגמרו השאלות");
    //    $("#endQuizeDiv").fadeIn();
    //}
    //else {
    //    console.log("יש עוד שאלות");
    //    $("#nextQuestionBTN").parent().show(500);
    //    console.log("מסיחים נכונים " + rightAnsSTR);
    //}
  
    //שאלת חד ברירה
    if (qType == 1) {
        var chosenAns = $('input[name=radio-choice-w-6]:checked').val();
        responseValue = chosenAns;
       //סימון בירוק את התשובה הנכונה
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').removeClass("ui-radio-off");
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').removeClass("ui-radio-on");
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').addClass("rightAnswerClass ui-icon-check");
        
        //בדיקת האם התשובה הנכונה והדפסת משוב
        console.log("בחרתי בתשובה" + chosenAns)
        if (chosenAns == rightAns[0]) {
            $("#feedbackP").html(rightAnswerFeedbackText);
            responseTrue = true;
        }
        else {
            $("#feedbackP").html(wrongAnswerFeedbackText);
            //$("#feedbackImg").attr("src", "img/mis.png");
            //שינוי העיצוב של התשובה הנבחרה השגויה
            $('label[for=radio-choice-w-6' + chosenAns + ']').removeClass("ui-radio-off");
            $('label[for=radio-choice-w-6' + chosenAns + ']').removeClass("ui-radio-on");
            $('label[for=radio-choice-w-6' + chosenAns + ']').addClass("wrongAnswerClass ui-icon-delete");
            responseTrue = false;

            
        }

    }
    //שאלת רב ברירה
    else if (qType == 2) {
        //השבתת המסיחים
        $('input[name=checkbox-choice-w-6]').attr("disabled", "disabled");
        //מערך שמראה האם כל מסיח נכון או שגוי
        var multipleRightAns = new Array();
        //מערך לתשובות שבחרתי בהן
        var multipleChosenAns = new Array();
        for (x = 0; x < distractorCount; x++) {
            //מילוי מערך המסיחים הנכנוים שגויים בשגויים
            multipleRightAns[x] = "false";
            //בדיקה האם המסיח הזה נבחר על ידי המשתמש או לא
            var ansChecked = $("#checkbox-choice-w-6" + (x + 1)).attr("data-cacheval");
            
            console.log(ansChecked);
            if (ansChecked == "false") {
                multipleChosenAns[x] = "true";
                responseValue += (x + 1) + ",";

                
            }
            else {
                multipleChosenAns[x] = "false";
            }
        }
        responseValue = responseValue.substring(0, responseValue.length - 1);
        console.log("rightAns" + rightAns);
        //לולאה שמסמנת במערך התשובות הנכונות, איזה מסיחים נכונים
        for (z = 0; z < rightAns.length; z++) {
            var correctAns = rightAns[z];
            console.log(rightAns[z]);
            multipleRightAns[correctAns - 1] = "true";
        }
        console.log("right answers array: " + multipleRightAns);
        console.log("chosen answers by the user array:  " + multipleChosenAns);

        //בדיקה כמה תשובות נכונות ושגויות ענה המשתמש
        var rightAnsCount = 0;
        var wrongAnsCount = 0;
        console.log("מספר מסיחים" + distractorCount);
        //משווה את 2 המערכים ובודק כמה תשובות נכונות ושגויות יש לי
        //מסיח שגוי שלא סומן על ידי המשתמש נחשב כתשובה נכונה
        for (i = 0; i < distractorCount; i++) {
          
            if (multipleChosenAns[i] == multipleRightAns[i]) {
                
                rightAnsCount++;
                if (multipleChosenAns[i] == "true") {
                    $('label[for=checkbox-choice-w-6' + (i+1) + ']').addClass("rightAnswerClass");
                }
            }
            else {
                wrongAnsCount++;
                if (multipleChosenAns[i] == "true" && multipleRightAns[i] =="false") {
                    $('label[for=checkbox-choice-w-6' + (i + 1) + ']').addClass("wrongAnswerClass ui-icon-delete");
                    $('label[for=checkbox-choice-w-6' + (i + 1) + ']').removeClass("ui-checkbox-off ui-checkbox-on");
               
                   
                }
            }
        }
        console.log("תשובות נכונות: " + rightAnsCount);
        console.log("תשובות שגויות" + wrongAnsCount);
        //מקרה בו המשתמשת סימנה רק את המסיחים הנכונים
        if (rightAnsCount == distractorCount && wrongAnsCount == 0) {
            $("#feedbackP").html(rightAnswerFeedbackText);
            responseTrue = true;
        }
            //מקרה בו המשתמשת סימנה רק את המסיחים השגויים
        else if (rightAnsCount == 0 && wrongAnsCount == distractorCount) {
            $("#feedbackP").html(wrongAnswerFeedbackText);
            responseTrue = false;
        }
            //מקרה של תשובה חלקית נכונה
        else {
            $("#feedbackP").html(paritalAnswerFeedbackText);
            responseTrue = false;
        }
       
    }
    //שאלה פתוחה תשובה קצרה
    else if (qType == 3) {
        //העלמת ההנחייה והשבתת שדה המענה
        
        $('label[for=text-3]').fadeOut(200);
        $('input[id=text-3]').attr("disabled", "disabled");
        $('input[id=text-3]').siblings("a").css("display", "none");
        var myAnswer = $('#text-3').val();
        responseValue = myAnswer;

        console.log("המשתמש הזין: " + myAnswer);
        if (myAnswer) {
            var openQIsCorrect = false;
            var x = 0;
           
            for (i = 0; i < openQRightAns.length; i++) {
                if (openQRightAns[i] == myAnswer) {
                    openQIsCorrect = true;
                }
               
            }
            if (openQIsCorrect == true) {
                $("#feedbackP").html(rightAnswerFeedbackText);
                console.log("תשובה נכונה");
                responseTrue = true;
            }
            else {
                $("#feedbackP").html(wrongAnswerFeedbackText + "<br/>התשובה הנכונה היא: " + openQRightAns[1]);
                console.log("תשובה שגויה");
                responseTrue = false;
            }

        }
        else {
            alert("יש להזין תשובה");
            $("#feedbackP").html("");
            console.log("לא הוזנה תשובה");
        }
        
    }
   
    $("#checkAnswerBTN").parent().fadeOut(200);
    newQuestionActive = false;
    updateNewQuestionSection();
    updateDbNewResponse();
      
}



$(document).ready(function () {
    //העלמת דיב אתחול משחק
    $("#endQuizeDiv").hide();
    ////אירוע הגדלת תמונה
    //$("#qImgOverDiv").click(function () {
       
    //    $("#imgContainerDiv").toggleClass("qPicImgZoom");
    //});

    //עיצוב כפתור התחלה
    //עיצוב כפתור אתחול
    
    //$("#startBtn").parent().css({"background-color":"#3388CC","color":"white","text-shadow":"none","font-family":"'Assistant', sans-serif !important"});
    //$("#endQuizeBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    //$("#nextQuestionBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    
    //$("#checkAnswerBTN").parent().addClass("checkAnswerBTN");
    //$("#nextQuestionBTN").parent().addClass("checkAnswerBTN");

 
    
});


//קוד של דיב אודות

// popup examples
$(document).on("pagecreate", function () {
    // The window width and height are decreased by 30 to take the tolerance of 15 pixels at each side into account
    function scale(width, height, padding, border) {
        var scrWidth = $(window).width() - 30,
        scrHeight = $(window).height() - 30,
        ifrPadding = 2 * padding,
        ifrBorder = 2 * border,
        ifrWidth = width + ifrPadding + ifrBorder,
        ifrHeight = height + ifrPadding + ifrBorder,
        h, w;
        if (ifrWidth < scrWidth && ifrHeight < scrHeight) {
            w = ifrWidth;
            h = ifrHeight;
        } else if ((ifrWidth / scrWidth) > (ifrHeight / scrHeight)) {
            w = scrWidth;
            h = (scrWidth / ifrWidth) * ifrHeight;
        } else {
            h = scrHeight;
            w = (scrHeight / ifrHeight) * ifrWidth;
        }
        return {
            'width': w - (ifrPadding + ifrBorder),
            'height': h - (ifrPadding + ifrBorder)
        };
    };
    $(".ui-popup iframe")
    .attr("width", 0)
    .attr("height", "auto");
    $("#infoPopUp").on({
        popupbeforeposition: function () {
            // call our custom function scale() to get the width and height
            var size = scale(497, 298, 15, 1),
            w = size.width,
            h = size.height;
            $("#infoPopUp iframe")
            .attr("width", w)
            .attr("height", h);
        },
        popupafterclose: function () {
            $("#popupVideo iframe")
            .attr("width", 0)
            .attr("height", 0);
        }
    });
});



function initialize() {
    var myLocation = new google.maps.LatLng(32.0485408, 34.8385317);
    //var mySouth = new google.maps.LatLng(31.2472396, 34.8045524);
    //var myNorth = new google.maps.LatLng(32.6068854, 35.3010357);



    var mapOptions = {
        center: myLocation,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };


    var map = new google.maps.Map(document.getElementById("myGoogleMap"), mapOptions);
    //marker 1
    var marker = new google.maps.Marker({
        position: myLocation,
        animation: google.maps.Animation.DROP,
    });
    marker.setMap(map);

    //information windom 1
    var infowindow = new google.maps.InfoWindow({
        content: "משרד הנהלה"
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });


}
google.maps.event.addDomListener(window, 'load', initialize);

//פונקציות של כפתור המשאב
function clickGiftPopUp(choice) {
    if (choice == "open") {
        $("#GiftPopup").fadeIn(500);
    }
    else if (choice == "close") {
        $("#GiftPopup").fadeOut(400);
        //$("#GiftPopupVideoIframe").attr("src", "https://www.youtube.com/embed/" + videoURL.split('=')[1]);
        //$('#GiftPopupVideoIframe').get(0).stopVideo();
        var videolink = $("#GiftPopupVideoIframe").attr("src");
        $("#GiftPopupVideoIframe").attr("src", "");
        $("#GiftPopupVideoIframe").attr("src", videolink);

    }
    else {
        console.log("התרחשה תקלה בלחיצת על כפתור המשאב");
    }
}

//פונקציה לעדכון מידע
function updateTry1() {
    console.log("updateTry1Click");

        $.get("Handler.ashx", {
            actionType: "updateTable",
            newData: "ttt"
            
        },

            function (data, status) {

                if (status == "success") {

                    console.log(data);

                    //אם אין משתמש
                    //if (data == "no user") {

                    //}
                    ////אם יש משתמש
                    //else {
                   
                    //}
                }
            });
    
}

//פונקציה לבדיקת איזה חידה להציג//

function getMyQuestions() {
    var myQuestion = "error";
    console.log("פונקציה לבדיקת מספר החידה הרלוונטי הופעלה");

    $.get("Handler.ashx", {
        actionType: "getMyQuestions",
        studentID: myId

    },

        function (data, status) {

            if (status == "success") {

                console.log(data);

                //אם אין משתמש
                //if (data == "no user") {

                //}
                ////אם יש משתמש
                //else {

                //}
            }
        });


    return myQuestion;
}

var previousQ;
//פונקציה להשמה במערכת של כל החידות מהעבר של הקבוצה של המשתמש
//פונקציה זו גם בודקת האם המשתמש כבר ענה על חידת השבוע
function getMyPreviousQuestions() {

    $.get("Handler.ashx", {
        actionType: "getMyPreviousQuestions",
        studentID: myId,
        groupID: myGroupID

    },

        function (data, status) {

            if (status == "success") {

                //alert(data);

                if (data == "no user") {
                    alert("תקלה");
                }
              
                else {
                    //previousQ = JSON.parse(data);
                    myPreviousQuestions = JSON.parse(data);
                   //previousQ = userObj[0]["answerdByUser"];

                    //בדיקת האם יש חידה חדשה שהמשתמשת לא ענתה עליה עדיין
                    console.log("אורך מערך החידות שפורסמו לקבוצה זן"+myPreviousQuestions.length);
                    for (z = 0; z < myPreviousQuestions.length; z++) {
                        if (myPreviousQuestions[z]["questionID"] == myCurrentQuestion) {
                            if (myPreviousQuestions[z]["answerdByUser"] == "true") {
                                newQuestionActive = false;
                            }
                            else {
                                newQuestionActive = true;
                            }
                        }
                    }
                    updateNewQuestionSection();

                   
                }
            }
        });
}


function updateMyProfilePage() {
    
  
    //alert("חידות שעניתי" + sAnsweredQuestionsSum);
    //alert("חידות שעניתי נכון" + sAnsweredRightQuestionsSum)
    if (sAnsweredQuestionsSum == 0) {
        $("#currentDoneP").html("עוד לא עניתי על חידה");
    }
    else if (sAnsweredQuestionsSum == 1) {
        $("#currentDoneP").html("עניתי על חידה אחת");
    }
    else {
        $("#currentDoneP").html("השתתפתי ב" + sAnsweredQuestionsSum + " חידות!");
    }

    var isAnsweredByClass = document.getElementsByClassName("achievement_isAnswer");
   
    for (i = 0; i < isAnsweredByClass.length; i++) {
        
        if (sAnsweredQuestionsSum >= isAnsweredByClass[i].innerHTML) {
            $(isAnsweredByClass[i]).addClass("indexDivOn");

        }
    }
    var isTruedByClass = document.getElementsByClassName("achievement_isTrue");
   
    for (i = 0; i < isTruedByClass.length; i++) {
        
        if (sAnsweredRightQuestionsSum >= isTruedByClass[i].innerHTML) {
            $(isTruedByClass[i]).addClass("indexDivOn");

        }
    }
}

//התאמת דף הבית להאם יש חידה חדשה להציג
//function loadThisWeekSection() {
 
//}

function updateNewQuestionSection() {
    console.log("עדכון חלק החידה חדשה לפי האם יש חידה חדשה שטרם התבצעה");
    //אם המשתמשת כבר ענתה על חידת השבוע
    if (newQuestionActive == false) {
        $("#thisWeekQuestionH3").html("אין חידה חדשה עדיין");
        $("#newQuestionA").attr("href", "#");

        $("#homePage_NewQuestionIcon").css("opacity", "0");
        $("#newQuestionA").css("color", "#646262 !important");
        $("#newQuestionA").css("background-color", "#dcdcdc");
        $("#newQuestionA").css("background-image", "none");
        $("#newQuestionA").css("cursor", "default");
    }
    //אם המשתמשת טרם ענתה על חידת השבוע
    else {

        $("#thisWeekQuestionH3").html("הגיעה חידה חדשה!");
        $("#newQuestionA").attr("href", "#firstPage");

        $("#newQuestionA").css("opacity", "1");
        $("#newQuestionA").css("color", "white !important");
        $("#newQuestionA").css("background-color", "none");
        $("#newQuestionA").css("background-image", " linear-gradient(to right top, #bd3e3e, #d5633d, #e7893f, #f4b048, #fad75a)");
        $("#newQuestionA").css("cursor", "pointer");
    }
}

//ברגע שעמוד חידת השבוע נטען, זה מריץ את הפונקציה להצגת החידה הרלוונטית.
$(document).on('pageinit', '#firstPage', function () {
    findQuestion();
});


$(document).on('pageinit', '#homePage', function () {
    updateNewQuestionSection();
});



//פונקציה לעדכון בסיס הנתונים לאחר מענה על חידה
function updateDbNewResponse() {
    
    //בדיקת התאריך של היום
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    //עדכון נתוני המענה בגאווה סקריפט ועדכון עמוד הפרופיל
    sAnsweredQuestionsSum++;
    if (responseTrue == "true") {
        sAnsweredRightQuestionsSum++;
    }    
    updateMyProfilePage();

    
    $.get("Handler.ashx", {
        actionType: "updateDbNewResponse",
        studentID: myId,
        groupID: myGroupID,
        questionID: myCurrentQuestion,
        responseDate: today,
        responseTrue: responseTrue,
        responseValue: responseValue

    },

        function (data, status) {

            if (status == "success") {

                //alert(data);

                if (data == "no user") {
                    alert("תקלה");
                }

                else {
                    
                    console.log(data);
                   


                }
            }
        });
}






function pq_close() {
    $("#pq_MainQuestionDiv").css("display", "none");
    $("#pq_showAnsA").css("opacity", "1");
}
//חידות קודמות - פונקציה להצגת פרטי החידה

function pq_showQuestion(qNum) {

    distractorCount = 0;
    
    $("#pq_MainQuestionDiv").css("display", "block");

    //call to handler
    $.get("Handler.ashx", {
        questionCode: qNum, //sent game code
    },

        function (data, status) {

            if (status == "success") {

                console.log(data);

                //if game not found or not publish
                if (data == "לא נמצאה שאלה") {

                    //printing the message to the screen
                   alert(data);
                }
                else {
                    //convert response to json format
                    obj = JSON.parse(data);
                    //הצגת שם השאלה ותוכן השאלה
                    $("#pq_q1Name").html(obj[0]["qName"]);
                    $("#pq_qStemP").html(obj[0]["qStem"]);
                    //בדיקת סוג השאלה - 1 לשאלת חד ברירה, 2 לשאלת רב ברירה, 3 לשאלה פתוחה עם תשובה קצרה
                    qType = obj[0]["qTypeID"];
                    //יצירת מערך עם המסיחים הנכונים
                    if (qType != 3) {
                        rightAnsSTR = obj[0]["qCorrectAns"];
                        console.log("מערך המסיחים הנכונים ישר מהנתונים " + rightAnsSTR);
                        rightAns = rightAnsSTR.split(",");
                    }
                    else {
                        console.log("סוג שאלה: 3");
                    }
                       
                  

                    //ריקון אזור השאלה 
                    $("#pq_questionFieldset").empty();
                  
                    //יצירת המסיחים
                    //סוג שאלה - חד ברירה
                    if (qType == 1) {

                        console.log("שאלת חד ברירה");
                        for (i = 1; i < 7; i++) {
                            console.log(obj[0]['qOption' + i]);
                            if (obj[0]['qOption' + i]) {
                                distractorCount++;
                                //הוספת אינפוט
                                var distraction = document.createElement('input');
                                distraction.type = "radio";
                                distraction.name = "radio-choice-w-6";
                                distraction.id = "radio-choice-w-6" + i;
                                distraction.value = i;
                                //distraction.disabled = "disabled";
                                distraction.style = "opacity:0;";
                                $("#pq_questionFieldset").append(distraction);
                                //הוספת לייבל

                                var mylabel = "<label name='radioLabelName' disabled = 'disabled' for='radio-choice-w-6" + i + "'>" + obj[0]['qOption' + i] + "</label>";
                                $("#pq_questionFieldset").append(mylabel);


                                //$(document).on('click touchstart', 'label[for=radio-choice-w-6' + i + ']', function () {
                                //    console.log("אירוע לחיצה על מסיח");
                                //    if ($("#feedbackDiv").css("display") == "none") {
                                //        $("#checkAnswerBTN").parent().fadeIn(500);
                                //    }

                                //});
                            }
                            else {

                            }
                        }
                        $("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");


                    }
                    //סוג שאלה - רב ברירה
                    else if (qType == 2) {
                        console.log("שאלת רב ברירה");
                        for (i = 1; i < 7; i++) {
                            console.log(obj[0]['qOption' + i]);
                            if (obj[0]['qOption' + i]) {
                                distractorCount++;
                                //הוספת אינפוט
                                var distraction = document.createElement('input');
                                distraction.type = "checkbox";
                                distraction.name = "checkbox-choice-w-6";
                                distraction.id = "checkbox-choice-w-6" + i;
                                distraction.value = i;
                                distraction.style = "opacity:0;";
                                $("#pq_questionFieldset").append(distraction);
                                //הוספת לייבל

                                var mylabel = "<label for='checkbox-choice-w-6" + i + "'>" + obj[0]['qOption' + i] + "</label>";
                                $("#pq_questionFieldset").append(mylabel);
                             




                                //$(document).on('click touchstart', 'label[for=checkbox-choice-w-6' + i + ']', function () {
                                //    console.log("אירוע לחיצה על מסיח");
                                //    var ansChecked = $(this).hasClass("ui-checkbox-on");

                                //    console.log("האם לחוץ?" + ansChecked);
                                //    if (ansChecked == false) {
                                //        checkboxClickedCount++;
                                //    }
                                //    else {
                                //        checkboxClickedCount--;
                                //    }

                                //    if (checkboxClickedCount > 1) {
                                //        if ($("#feedbackDiv").css("display") == "none") {
                                //            $("#checkAnswerBTN").parent().fadeIn(200);
                                //        }


                                //    }
                                //    else {
                                //        $("#checkAnswerBTN").parent().fadeOut(200);
                                //    }

                                //    console.log("מספר מסיחים לחוצים" + checkboxClickedCount);
                                //});
                            }
                            else {

                            }
                        }
                        $("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");

                    }
                    //סוג שאלה - פתוחה תשובה קצרה
                    else if (qType == 3) {
                        console.log("שאלה פתוחה תשובה קצרה");
                        ////יצירת שדה טקסט להזנת התשובה
                        //var labelAndTextInput = "<label for='text-3' style='margin-right:10px;'>רשמו את תשובתכם כאן:</label><input type='text' data-clear-btn='true' name='text-3' onkeydown='checkTextInputCharCount()' onchange='checkTextInputCharCount()' onpaste='checkTextInputCharCount()' id='text-3' class='textInputForQuestion' value='' style='direction:rtl; text-align:right; margin-right:10px;'>";
                        //$("#questionFieldset").append(labelAndTextInput);
                        //$("[data-role=controlgroup]").enhanceWithin().controlgroup("refresh");

                        //מילוי מערך התשובות הנכנונות בתשובות הנכונות ממאגר הנתונים
                        for (i = 1; i < 7; i++) {
                            console.log("תשובה נכונה: " + obj[0]['qOption' + i]);
                            if (obj[0]['qOption' + i]) {
                                openQRightAns[i] = obj[0]['qOption' + i];
                            }
                            else {

                            }
                        }
                        console.log("מערך התשובות הנכונות: " + openQRightAns);



                        //$("a[title='Clear text']").on("click", function () {

                        //    $("#checkAnswerBTN").parent().fadeOut(200);
                        //});
                    }
                    else {
                        alert("חסר סוג שאלה");
                    }
                    console.log("number of distractors: " + distractorCount);
                    //טעינת התמונה במידה ויש
                    if (obj[0]["qResourceType"] == 1) {
                        $("#qPic").show();
                        $("#qPic").attr("src", obj[0]["qResourceLink"]);
                        console.log("לינק תמונה " + obj[0]["qResourceLink"]);
                        $("#qPic").fadeIn(1100);
                    }
                    else {
                        $("#qPic").hide();
                        $("#qPic").attr("src", "");
                        $("#qPic").fadeOut(100);
                    }
                    //טעינת סרטון במידה ויש
                    if (obj[0]["qResourceType"] == 2) {
                        $("#GiftPopupVideoIframe").fadeIn(500);
                        videoURL = obj[0]["qResourceLink"];
                        console.log("יש סרטון בחידה זו, בקישור: " + obj[0]["qResourceLink"]);
                        $("#GiftPopupVideoIframe").attr("src", "https://www.youtube.com/embed/" + videoURL.split('=')[1]) + "?autoplay=1";
                    }
                    else {
                        $("#GiftPopupVideoIframe").hide();
                        $("#GiftPopupVideoIframe").attr("src", "");

                    }
                    //טעינת קישור אתר  במידה ויש
                    if (obj[0]["qResourceType"] == 3) {
                        $("#GiftPopupWebLinkIframe").fadeIn(500);
                        var weblinkURL = obj[0]["qResourceLink"];
                        console.log("יש קישור לאתר אינטרטנ חיצוני בחידה זו: " + weblinkURL);
                        $("#GiftPopupWebLinkIframe").attr("src", weblinkURL);
                    }
                    else {
                        $("#GiftPopupWebLinkIframe").hide();
                        $("#GiftPopupWebLinkIframe").attr("src", "");

                    }
                }
            }
        });
    $('input[name=radio-choice-w-6]').attr("disabled", "disabled");
    $('input[name=checkbox-choice-w-6]').attr("disabled", "disabled");
    //החזרת כפתור הגשה
    $("#checkAnswerBTN").parent().fadeOut(200);
    //איפוס משתנה סופר קליקים שאלת רב ברירה
    checkboxClickedCount = 0;
    //שינוי נוסח הכפתור
    //החזרת הנחיה וכפתור משאב
    $("#qInstruction").fadeIn(150);
    $("#qGiftButton").css("top", "75%");
    $("#qGiftButton").css("width", "40px");
    $("#qGiftButton").css("height", "40px");

    $("#startBtn").parent().fadeOut(500);
    //העלמת אייקון השלמת חידה
    $("#whiteCrownIcon").css({ "opacity": "0", "right": "-16px" });
    $("#startBtn").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    $("#endQuizeBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });
    $("#nextQuestionBTN").parent().css({ "background-color": "#3388CC", "color": "white", "text-shadow": "none", "font-family": "'Assistant', sans-serif !important" });

    //$("#checkAnswerBTN").parent().addClass("checkAnswerBTN");
    //$("#nextQuestionBTN").parent().addClass("checkAnswerBTN");
}


//חידות קודמות פונקציה להצגת התשובה הנכונה

function pq_checkAnswer() {
    $("#pq_showAnsA").css("opacity", "0");

    //שאלת חד ברירה
    if (qType == 1) {
        //var chosenAns = $('input[name=radio-choice-w-6]:checked').val();
        //responseValue = chosenAns;
        //סימון בירוק את התשובה הנכונה
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').removeClass("ui-radio-off");
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').removeClass("ui-radio-on");
        $('label[for=radio-choice-w-6' + rightAns[0] + ']').addClass("rightAnswerClass ui-icon-check");

        //בדיקת האם התשובה הנכונה והדפסת משוב
        //console.log("בחרתי בתשובה" + chosenAns)
        //if (chosenAns == rightAns[0]) {
        //    $("#feedbackP").html(rightAnswerFeedbackText);
        //    responseTrue = true;
        //}
        //else {
        //    //$("#feedbackP").html(wrongAnswerFeedbackText);
        //    //$("#feedbackImg").attr("src", "img/mis.png");
        //    //שינוי העיצוב של התשובה הנבחרה השגויה
        //    $('label[for=radio-choice-w-6' + chosenAns + ']').removeClass("ui-radio-off");
        //    $('label[for=radio-choice-w-6' + chosenAns + ']').removeClass("ui-radio-on");
        //    $('label[for=radio-choice-w-6' + chosenAns + ']').addClass("wrongAnswerClass ui-icon-delete");
        //    responseTrue = false;


        //}

    }
    //שאלת רב ברירה
    //else if (qType == 2) {
    //    //השבתת המסיחים
        
    //    //מערך שמראה האם כל מסיח נכון או שגוי
    //    var multipleRightAns = new Array();
    //    //מערך לתשובות שבחרתי בהן
    //    //var multipleChosenAns = new Array();
    //    //for (x = 0; x < distractorCount; x++) {
    //    //    //מילוי מערך המסיחים הנכנוים שגויים בשגויים
    //    //    multipleRightAns[x] = "false";
    //    //    //בדיקה האם המסיח הזה נבחר על ידי המשתמש או לא
    //    //    var ansChecked = $("#checkbox-choice-w-6" + (x + 1)).attr("data-cacheval");

    //    //    console.log(ansChecked);
    //    //    if (ansChecked == "false") {
    //    //        multipleChosenAns[x] = "true";
    //    //        responseValue += (x + 1) + ",";


    //    //    }
    //    //    else {
    //    //        multipleChosenAns[x] = "false";
    //    //    }
    //    //}
    //    //responseValue = responseValue.substring(0, responseValue.length - 1);
    //    //console.log("rightAns" + rightAns);
    //    //לולאה שמסמנת במערך התשובות הנכונות, איזה מסיחים נכונים
    //    for (z = 0; z < rightAns.length; z++) {
    //        var correctAns = rightAns[z];
    //        console.log(rightAns[z]);
    //        multipleRightAns[correctAns - 1] = "true";
    //    }
    //    console.log("right answers array: " + multipleRightAns);
    //    console.log("chosen answers by the user array:  " + multipleChosenAns);

    //    //בדיקה כמה תשובות נכונות ושגויות ענה המשתמש
    //    var rightAnsCount = 0;
    //    var wrongAnsCount = 0;
    //    console.log("מספר מסיחים" + distractorCount);
    //    //משווה את 2 המערכים ובודק כמה תשובות נכונות ושגויות יש לי
    //    //מסיח שגוי שלא סומן על ידי המשתמש נחשב כתשובה נכונה
    //    for (i = 0; i < distractorCount; i++) {

    //        if (multipleChosenAns[i] == multipleRightAns[i]) {

    //            rightAnsCount++;
    //            if (multipleChosenAns[i] == "true") {
    //                $('label[for=checkbox-choice-w-6' + (i + 1) + ']').addClass("rightAnswerClass");
    //            }
    //        }
    //        else {
    //            wrongAnsCount++;
    //            if (multipleChosenAns[i] == "true" && multipleRightAns[i] == "false") {
    //                $('label[for=checkbox-choice-w-6' + (i + 1) + ']').addClass("wrongAnswerClass ui-icon-delete");
    //                $('label[for=checkbox-choice-w-6' + (i + 1) + ']').removeClass("ui-checkbox-off ui-checkbox-on");


    //            }
    //        }
    //    }
    //    console.log("תשובות נכונות: " + rightAnsCount);
    //    console.log("תשובות שגויות" + wrongAnsCount);
    //    //מקרה בו המשתמשת סימנה רק את המסיחים הנכונים
    //    if (rightAnsCount == distractorCount && wrongAnsCount == 0) {
    //        $("#feedbackP").html(rightAnswerFeedbackText);
    //        responseTrue = true;
    //    }
    //    //מקרה בו המשתמשת סימנה רק את המסיחים השגויים
    //    else if (rightAnsCount == 0 && wrongAnsCount == distractorCount) {
    //        $("#feedbackP").html(wrongAnswerFeedbackText);
    //        responseTrue = false;
    //    }
    //    //מקרה של תשובה חלקית נכונה
    //    else {
    //        $("#feedbackP").html(paritalAnswerFeedbackText);
    //        responseTrue = false;
    //    }

    //}
    //שאלה פתוחה תשובה קצרה
    //else if (qType == 3) {
    //    //העלמת ההנחייה והשבתת שדה המענה

    //    //$('label[for=text-3]').fadeOut(200);
    //    //$('input[id=text-3]').attr("disabled", "disabled");
    //    //$('input[id=text-3]').siblings("a").css("display", "none");
    //    //var myAnswer = $('#text-3').val();
    //    //responseValue = myAnswer;

    //    //console.log("המשתמש הזין: " + myAnswer);
    //    if (myAnswer) {
    //        var openQIsCorrect = false;
    //        var x = 0;

    //        for (i = 0; i < openQRightAns.length; i++) {
    //            if (openQRightAns[i] == myAnswer) {
    //                openQIsCorrect = true;
    //            }

    //        }
    //        if (openQIsCorrect == true) {
    //            $("#feedbackP").html(rightAnswerFeedbackText);
    //            console.log("תשובה נכונה");
    //            responseTrue = true;
    //        }
    //        else {
    //            $("#feedbackP").html(wrongAnswerFeedbackText + "<br/>התשובה הנכונה היא: " + openQRightAns[1]);
    //            console.log("תשובה שגויה");
    //            responseTrue = false;
    //        }

    //    }
    //    else {
    //        alert("יש להזין תשובה");
    //        $("#feedbackP").html("");
    //        console.log("לא הוזנה תשובה");
    //    }

    //}

    

}

function testRun(qNum) {
    myName = "test";
    myId = "0";
    sAnsweredQuestionsSum = 0;
    sAnsweredRightQuestionsSum = 0;
}