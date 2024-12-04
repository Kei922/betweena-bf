const firebaseConfig = {
  apiKey: "AIzaSyBGEPi4gydD8Y6Y3krPr8d-KwtXl8PZeLU",
  authDomain: "between-b2bbe.firebaseapp.com",
  projectId: "between-b2bbe",
  storageBucket: "between-b2bbe.appspot.com",
  messagingSenderId: "249018301100",
  appId: "1:249018301100:web:979f5a6c5c8fa553343d09"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


async function uploadData() {
  const submitButton = document.getElementById("submitButton");
  const voiceRecorderImg = document.getElementById("voiceRecorderImg");
  const rerecordButton = document.getElementById("rerecordButton");
  const messageElement = document.createElement("div");
  messageElement.classList.add("submission-message");

  if (submitButton.dataset.state == 3) {
    console.log("TRY TO UPLOAD NOW!");

    const voiceMemoName = document.getElementById("voiceMemoName").value;
    const voiceMemoCity = document.getElementById("voiceMemoCity").value;
    const voiceMemoTitle = document.getElementById("voiceMemoTitle").value;
    const categoryBox = document.getElementById("categoryBox").value;
    const imageElement = document.getElementById("empty_image");
    const imageUrl = imageElement.src;
    const audioElement = document.getElementById("audioOutput"); // Get the audio element
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    // 送信中メッセージとボタンの非表示
    messageElement.textContent = "Sending...";
    document.body.appendChild(messageElement);
    submitButton.style.display = "none";
    if (voiceRecorderImg) {
      voiceRecorderImg.style.display = "none";
    }
    if (rerecordButton) {
      rerecordButton.style.display = "none";
    }

    try {
      const position = await getLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fetch the Blob from the audio element's src
      const response = await fetch(audioElement.src);
      const audioBlob = await response.blob();

      // Convert the Blob to a File
      const audioFile = new File([audioBlob], `${id}.wav`, { type: audioBlob.type });

      // Upload the audio file to Firebase Storage
      const audioRef = ref(storage, `audioFiles/${id}.wav`);
      await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioRef);

        // Get the image file from the input element or use default image
        const fileInput = document.getElementById("fileInput");
        let imageFile;
        if (fileInput.files.length > 0) {
            imageFile = fileInput.files[0];
        } else {
            // Use the default image (make sure 'a.png' is located in the same directory or provide the correct path)
            const response = await fetch('assets/Card_test_black-02.png');
            const imageBlob = await response.blob();
            imageFile = new File([imageBlob], 'assets/Card_test_black-02.png', { type: imageBlob.type });
        }

       // Upload the image file to Firebase Storage
       const imageRef = ref(storage, `imageFiles/${id}.${imageFile.name.split('.').pop()}`);
       await uploadBytes(imageRef, imageFile);
       const imageUrl = await getDownloadURL(imageRef);

      await setDoc(doc(db, "between-data", id), {
        name: voiceMemoName,
        city: voiceMemoCity,
        title: voiceMemoTitle,
        category: categoryBox,
        timestamp: serverTimestamp(),
        image: imageUrl, // 画像URLをデータベースに保存
        audio: audioUrl, // 音声ファイルのURLをデータベースに保存
        map: { // マップフィールドに緯度と経度を含める
          latitude: latitude,
          longitude: longitude
        }
      });

      console.log("Document successfully written!");

      // 送信完了メッセージを更新
      messageElement.textContent = "READY TO STICK IT！";
         // 3秒後にページをリロード
         setTimeout(() => {
          location.reload();
      }, 3000);

    } catch (e) {
      console.error("Error adding document: ", e);
      // エラーメッセージを表示
      messageElement.textContent = "Error uploading data, please try again.";
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", async function() {
    try {
      // 位置情報の許可を要求
      await getLocation();
      uploadData();
    } catch (error) {
      console.error("位置情報の取得に失敗しました: ", error);
      alert("位置情報の取得に失敗しました。位置情報を有効にしてください。");
    }
  });
});
