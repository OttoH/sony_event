var socket = io.connect();
var person = {
  name: '',
  phone: ''
};
//which question it is now
var questionNumber = -1;

//page1 is login page.
//page2 is question page.
//page3 is exit page.
var pageNum = 1;

//question data
var selectionobj1 = ['0.6秒','0.03秒','0.9秒'];
var questionObj1 = {questionText:'請問Xperia Performance最新功能快啟快拍完成拍照需要幾秒?', selectiontexts: selectionobj1, answer: 1};
var selectionobj2 = ['只要長按住照相鍵即可', '只要長按住電源鍵', '只要長按住音量鍵'];
var questionObj2 = {questionText:'承上請問剛剛在體驗區所體驗到的0.6秒快啟快拍,我們要如何啟動?',selectiontexts:selectionobj2,answer: 1};
var selectionobj3 = ['Qnovo智慧充電+球體', '預測追焦對焦+球體', '防水防塵+小汽車'];
var questionObj3 = {questionText: '請問您 Xperia Performance怎麼動都能拍得清晰銳利是哪種功能?又拍到哪種物體?', selectiontexts: selectionobj3, answer: 2};
var selectionobj4 = ['OwO開心玩手機', 'Qoo有種果汁真好喝', 'Qnovo智慧充電技術'];
var questionObj4 = {questionText:'請問, Sony Xperia X系列，哪個技術能分析電池狀況與使用行為,給予最適當的充電方式,讓電池壽命長達兩倍?', selectiontexts: selectionobj4, answer: 3};
var selectionobj5 = ['500萬', '800萬', '1300萬'];
var questionObj5 = {questionText: '請問,Xperia X Performance低光源自拍相機的畫素是?', selectiontexts: selectionobj5, answer: 3};
// var selectionobj6 = ["Sony G鏡與Sony Alpha相機技術 ","Sony Kit鏡與Sony Cybershot相機技術","Sony G鏡與Sony Cybershot Cybershot相機技術"];
// var questionObj6 = {questionText:"請問, Xperia X Performance搭載 Android手機中最高畫素的2300萬素是採用Sony那個鏡頭及哪種相機技術? ",selectiontexts:selectionobj6,answer:1};
var AllquestionObjs = [questionObj1, questionObj2, questionObj3, questionObj4, questionObj5];


// listen register feedback
socket.on('check_register', function(data) {
	if(data.isValid) {
        $('.hinttext-login').hide();
		
        pageNum = 2;
  		questionPageAnimation();

  	} else {
        $('.hinttext-login').html("您已做過問卷，請等待抽獎喔");
        $('.hinttext-login').show();
  		// error handeling
  	}
});

$('.enterContent').on('click', function(e) {
	var valid = false;
  	var name = document.querySelector('#username').value;
  	var phone = document.querySelector('#userphoneNum').value;
  
  	if (name && phone) {
		person.name = name;
		person.phone = phone;
		socket.emit('register', person);
  	} else {
        $('.hinttext-login').html("請輸入姓名或電話");
        $('.hinttext-login').show();
 		// erro handling
  	}
});

//show questions
function createQuestion(){
  var i;
  var idname;
  //reset the proceed
//  $('#proceed').html("");
  //document.getElementById("questionTitles").innerHTML = questionObj.questionText;
  $('.questionTitles').html("Q: " + AllquestionObjs[questionNumber].questionText);
  for(i = 1; i<=3; i++){
	  idname = "selection"+ i;
	  document.getElementById(idname).innerHTML =
	  AllquestionObjs[questionNumber].selectiontexts[i-1];
	  //"<div id=selection"+ i +" class=qOptions> ("+i+") "+ AllquestionObjs[questionNumber].selectiontexts[i-1] +"</div>";
  }

  //reset hinttext item
  $('.hinttext').html("不是這個答案喔，麻煩您重新選擇！");
  $('.hinttext').hide();

  //add eventhandler
  $('.qOptions').on('click', checkAnswer);

}

function questionPageAnimation(){
  if(pageNum == 2){
	var percentage;
	$('.qOptions').css('background-color','transparent');
	// console.log("loading...question");
	$('.loginPage').hide();

	questionNumber++;
	createQuestion();

	percentage = Number((questionNumber/5)*100).toFixed(1);
	$('.progressPercentage').html(percentage + '%');
	$('.barPercentage').css('width', percentage + '%');

	$('.contentPage').show();
  }
}

function ToExitPage(){
  if(pageNum == 3){
	$('.contentPage').hide();
	$('.exitPage').show();
  }
}

//show result when user click any selection
function checkAnswer(){
  event.preventDefault();
  $('.qOptions').css('background-color','transparent');
  $('#' + event.target.id).css('background-color','#000'); //set selected color.
  //console.log(event.target.id);
  if(event.target.id == ("selection"+AllquestionObjs[questionNumber].answer)){
	//hide hint
	$('.hinttext').hide();

	//$('#proceed').html("<button id=correct>correct, next to...</button>");
	//remove eventhandler
	$('.qOptions').off();
	if(questionNumber==AllquestionObjs.length-1){
	  console.log("id:"+event.target.id);
	  //$('#proceed').html("<div id=next class=\"fade-in blue\">Correct! All questions are completed.</div>");
	  $('.hinttext').css('color','blue');
	  $('.hinttext').html("正確答案!全部作答完畢");
	  $('.hinttext').show();
	  //$('#gotonext').show();
	  pageNum = 3;
	  setTimeout(ToExitPage, 1000);
	}
	else{
	  //$('#proceed').html("<button id=next class=fade-in>correct, go to next.</button>");
	  $('.hinttext').css('color','blue');
	  $('.hinttext').html("正確答案!");
	  $('.hinttext').show();
	  //$('#gotonext').show();
	  setTimeout(questionPageAnimation, 600);
	  //$('#gotonext').on('click', questionPageAnimation);
	}
  }
  else{
	//$('#proceed').html("<div class=fade-in style=color:red;>incorrect, hint:("+AllquestionObjs[questionNumber].answer+")</div>");
	$('.hinttext').css('color','red');
	$('.hinttext').show();
	//$('#gotonext').hide();
  }
}

// handle exit btn
socket.on('confirm_pass', function (data) {
	if (data.isValid) {
        location.reload();
		
	} else {
        console.log('confirm pass error');
		//error handling
	}
});

$('#exit-btn').on('click', function(e) {
	socket.emit('pass', person);
});


