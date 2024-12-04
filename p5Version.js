


let mic, recorder, soundFile;
var rerecordButton = document.getElementById("rerecordButton");
function setup() {
  // userStartAudio();
  let canv = createCanvas(400, 400);
  canv.hide();

 
  // mic = new p5.AudioIn();
  // mic.start();


  // recorder = new p5.SoundRecorder();

  // recorder.setInput(mic);
}


  // query database with id
  // check if there is a document in the database with the id that we just got from the url



  // // IDが存在しない場合のみ新しいIDを追加
  // if (!id) {
  //     // ランダムなIDを生成
  //     var newID = Math.floor(Math.random() * 1000000); // 仮の範囲でのランダムなID生成
  //     // URLに新しいIDを追加
  //     url.searchParams.set('id', newID);
  //     // 新しいURLにリダイレクト
  //     window.location.href = url.toString();
  // }



// 開始時間
let startTime;
// 停止時間
let stopTime = 0;
// タイムアウトID
let timeoutID;

const time = document.getElementById('timeShow');

// 時間を表示する関数
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime);

  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const s = String(currentTime.getSeconds()).padStart(2, '0');
  

  timeShow.textContent = `${m}:${s}`;
  timeoutID = setTimeout(displayTime, 10);
}

document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("empty_image");
  const fileInput = document.getElementById("fileInput");

  image.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

function getAddressParameter() {
  
  const url = new URL(window.location.href);

 
  const params = new URLSearchParams(url.search);


  const address = params.get("address");

  // Decode the address to show it in a user-friendly format
  return decodeURIComponent(address);
}

console.log(getAddressParameter());
var address = getAddressParameter();
var locationHTML = document.getElementById("location");
locationHTML.innerText = address;
var state = 0;

var voiceRecorderImg =  document.getElementById("voiceRecorderImg");
var submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function () {

  // check state
  if (state === 0) {
    userStartAudio();
    mic = new p5.AudioIn();

    recorder = new p5.SoundRecorder();
    // connect the mic to the recorder
    recorder.setInput(mic);
    // users must manually enable their browser microphone for recording to work properly!
    mic.start();

    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile();
    // recorder.record(soundFile);
    mic.start(function () {
      console.log("starting audio");
      recorder.record(soundFile);
    });
    voiceRecorderImg.src =
      "assets/red_mic_small.png";

      startTime = Date.now();
      displayTime();
      timeShow.style.color = "black";
    // start recording audio
  } else if (state === 1) {
    console.log("stopping recorder");
    
    // recorder.stop();
    recorder.stop();
    mic.dispose();
    // setTimeout(function () {
    //   soundFile.play();
    // }, 100);

    
    timeShow.style.color = "white";
    timeShow.textContent = '00:00';
    let stopTime = 0; // stopTimeの初期化を追加

    document.getElementById("voiceRecorderImg").src =
      "assets/upload.png";

    rerecordButton.style.display = "block";

    clearTimeout(timeoutID);
    stopTime += (Date.now() - startTime);
    

    //recording voice with mic
  } else if (state === 2) {
    
    //add new image on homepage and move to there
    // soundFile.play(); // play the result!
    var currentBlob = soundFile.getBlob();
    console.log(currentBlob);
    var audioURL = URL.createObjectURL(currentBlob);
    // var newSoundFile  = saveSound(soundFile, "mySound.wav");
    // newSoundFile.load();  
    // create an audio 
    var audioOutput = document.getElementById("audioOutput");
    audioOutput.src = audioURL;
    
    audioOutput.load();
    // module.exports = { soundFile };
    // document.dataset.state = 3; 
    
  } else if (state === 3) {
    // upload to database
    
  }
  state = state + 1;
  if(state == 4){
    state = 0;
  }
  submitButton.dataset.state = state;
  console.log("the state is: ", state);

  // change image from microphone to pause sybol
});

rerecordButton.addEventListener("click", function () {
  state = 0;
  soundFile = new p5.SoundFile();
  mic.start(function () {
    console.log("starting audio");
    recorder.record(soundFile);
  });
  document.getElementById("voiceRecorderImg").src =
    "assets/mic_8bit.png";
  // start recording audio
  rerecordButton.style.display = "none";
  timeShow.style.color = "white";
  timeShow.textContent = '00:00';
  stopTime = 0;
});

document.getElementById('mainbarbox').addEventListener('click', function() {
  var homepageUi = document.getElementById('homepageUi');
  var inputPage = document.getElementById('inputPage');

  // homepageUiを表示
  homepageUi.style.display = 'block';

  // inputPageを非表示
  inputPage.style.display = 'none';
});

