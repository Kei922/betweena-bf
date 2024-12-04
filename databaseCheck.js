const firebaseConfig = {
  apiKey: "AIzaSyBGEPi4gydD8Y6Y3krPr8d-KwtXl8PZeLU",
  authDomain: "between-b2bbe.firebaseapp.com",
  projectId: "between-b2bbe",
  storageBucket: "between-b2bbe.appspot.com",
  messagingSenderId: "249018301100",
  appId: "1:249018301100:web:979f5a6c5c8fa553343d09"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ページ読み込み時に実行される関数
window.onload = async function() {
  // URLからIDを取得
  var url = new URL(window.location.href);
  var id = url.searchParams.get('id');
  console.log("id is ", id);

  const docRef = doc(db, "between-data", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      const inputPage = document.getElementById("inputPage");
      const dataPage = document.getElementById("dataPage");
      
      if (inputPage) {
          inputPage.style.display = "none";
      } else {
          console.error('inputPage element not found');
      }
      
      if (dataPage) {
          dataPage.style.display = "block";
      } else {
          console.error('dataPage element not found');
      }
      
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      
      const eachName = document.getElementById("eachName");
      eachName.innerText = data["name"];
      const eachCity = document.getElementById("eachCity");
      eachCity.innerText = data["city"];
      const eachTitle = document.getElementById("eachTitle");
      eachTitle.innerText = data["title"];
      const eachTime = document.getElementById("eachTime");
      const timestamp = data["timestamp"];
      const date = new Date(timestamp.seconds * 1000); // 秒をミリ秒に変換してDateオブジェクトを作成
      const formattedTime = date.toLocaleString(); // ローカルの時間形式にフォーマット

      eachTime.innerText = formattedTime; // フォーマットされた時間を表示
      
      // Show image
      const imageBase64 = data["image"];
      const imageElement = document.getElementById("alt_image");
      if (imageBase64) {
          imageElement.src = imageBase64;
      }
      
      // Fetch and display audio
      const audioUrl = data["audio"];
      if (audioUrl) {
          let audioElement = document.getElementById("audioOutput");
          if (!audioElement) {
              // If audioElement does not exist, create it
              audioElement = document.createElement("audio");
              audioElement.id = "audioOutput";
              audioElement.controls = true;
              dataPage.appendChild(audioElement);
          }
          audioElement.src = audioUrl;
          const playButton = document.getElementById("mapPin");
          if (playButton) {
            playButton.addEventListener("click", () => {
                if (audioElement.paused) {
                    audioElement.play();
                    playButton.src = 'assets/recording_posing.png'; // 再生中のボタン画像
                } else {
                    audioElement.pause();
                    // playButton.src = 'assets/play.png'; // 一時停止中のボタン画像
                }
            });
              audioElement.addEventListener("ended", () => {
                playButton.src = 'assets/reload_8bit.png'; // 再生終了後のボタン画像
            });
          } else {
              console.error('playButton element not found');
          }
      }
  } else {
      console.log("No such document!");
      // Keep your input html
  }
};
