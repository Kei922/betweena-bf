const firebaseConfig = {
  apiKey: "AIzaSyBGEPi4gydD8Y6Y3krPr8d-KwtXl8PZeLU",
  authDomain: "between-b2bbe.firebaseapp.com",
  projectId: "between-b2bbe",
  storageBucket: "between-b2bbe.appspot.com",
  messagingSenderId: "249018301100",
  appId: "1:249018301100:web:979f5a6c5c8fa553343d09"
};

// Firebase SDKのモジュールをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc as firestoreDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var sockets = document.getElementsByClassName("homepageImg");

// 使用済みのインデックスを追跡するためのセット
var usedIndices = new Set();

// まだ使用されていないランダムなインデックスを取得する関数
function getRandomUnusedIndex(max) {
  let index;
  do {
    index = Math.floor(Math.random() * max);
  } while (usedIndices.has(index)); // 使用済みのインデックスは避ける
  return index;
}

async function getVoiceMemoDocumentIds() {
  const querySnapshot = await getDocs(collection(db, "between-data"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id);
    if (usedIndices.size < sockets.length) { // すべての画像が入れ替えられていない場合
      const randomIndex = getRandomUnusedIndex(sockets.length); // ランダムな未使用インデックスを取得
      usedIndices.add(randomIndex); // 取得したインデックスを使用済みに追加

      // 取得したランダムなインデックスの画像にデータを設定
      sockets[randomIndex].dataset.id = doc.id;
      console.log(doc.data().category);

      if (doc.data().category == "1") {
        sockets[randomIndex].src = "assets/orange_plug_small.png";
      } else if (doc.data().category == "2") {
        sockets[randomIndex].src = "assets/red_plug_small.png";
      } else if (doc.data().category == "3") {
        sockets[randomIndex].src = "assets/green_plug_small.png";
      } else if (doc.data().category == "4") {
        sockets[randomIndex].src = "assets/blue_plug_small.png";
      } else if (doc.data().category == "0") {
        sockets[randomIndex].src = "assets/blue_plug_small.png";
      }

      // 画像クリック時のイベントリスナーを追加
      sockets[randomIndex].addEventListener("click", async function () {
        const docId = this.dataset.id;
        console.log("Clicked image document ID: ", docId);

        const docRef = firestoreDoc(db, "between-data", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          document.getElementById("eachName").textContent = data.name || "NAME";
          document.getElementById("eachCity").textContent = data.city || "CITY";
          document.getElementById("eachTitle").textContent = data.title || "TITLE";
          document.getElementById("eachTime").textContent = new Date(data.timestamp.seconds * 1000).toLocaleString() || "TIME";
          document.getElementById("overlay").style.display = "block";

          // ドキュメントが画像データを持っている場合のみ画像を設定
          var imageElement = document.getElementById("eachPhoto");
          if (data.image) {
            var imageBase64 = data.image;
            imageElement.src = imageBase64;
          } else {
            // 画像データがない場合、オリジナルの画像を表示
            imageElement.src = ""; // オリジナル画像のパスに変更
          }
        } else {
          console.log("No such document!");
        }

      });
    }
  });
}

getVoiceMemoDocumentIds();

document.addEventListener('DOMContentLoaded', function () {
  // オーバレイを開閉する関数
  const overlay = document.getElementById('overlay');
  function overlayToggle() {
    overlay.classList.toggle('overlay-on');
    document.body.style.overflow = overlay.classList.contains('overlay-on') ? 'hidden' : '';

    // オーバーレイを閉じるときに画像をリセット
    if (!overlay.classList.contains('overlay-on')) {
      var imageElement = document.getElementById("eachPhoto");
      imageElement.src = ""; // オリジナル画像のパスに変更
    }
  }

  // 画像のパスを配列に格納
  const targetImages = ['orange_plug_small.png', 'blue_plug_small.png', 'red_plug_small.png', 'green_plug_small.png'];

  // 指定した要素に対して上記関数を実行するクリックイベントを設定
  const clickAreas = document.getElementsByClassName('homepageImg');
  for (let i = 0; i < clickAreas.length; i++) {
    clickAreas[i].addEventListener('click', function (event) {
      // クリックされた要素のsrc属性を取得してチェック
      const imgSrc = event.target.src.split('/').pop();
      if (targetImages.includes(imgSrc)) {
        overlayToggle();
      }
    }, false);
  }

  // オーバーレイをクリックするとオーバーレイが消える
  overlay.addEventListener('click', function () {
    overlay.classList.remove('overlay-on');
    document.body.style.overflow = '';

    // オーバーレイを閉じるときに画像をリセット
    var imageElement = document.getElementById("eachPhoto");
    imageElement.src = ""; // オリジナル画像のパスに変更
  }, false);

  // // オーバーレイ内部のクリックでイベントがバブリングしないようにする
  // const overlayInner = document.getElementById('mapPin');
  // overlayInner.addEventListener('click', function (event) {
  //   event.stopPropagation();
  // }, false);
});
