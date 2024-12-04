// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGEPi4gydD8Y6Y3krPr8d-KwtXl8PZeLU",
    authDomain: "between-b2bbe.firebaseapp.com",
    projectId: "between-b2bbe",
    storageBucket: "between-b2bbe.appspot.com",
    messagingSenderId: "249018301100",
    appId: "1:249018301100:web:979f5a6c5c8fa553343d09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const customMapStyle = [
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#57cb5f"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#faffad"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "color": "#5ba6ec"
        }
      ]
    }
  ];

// Google Maps initialization function
window.initMap = async function() {
    const mapElement = document.getElementById("map");
    const mapOptions = {
        center: { lat: 51.53639099437795, lng: -0.124572772629417 }, // Tokyo coordinates
        zoom: 12, // Zoom level
        mapTypeControl: false, // マップタイプ切り替えコントロールを非表示にする
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        gestureHandling: 'greedy',
        styles: customMapStyle
    };
    const map = new google.maps.Map(mapElement, mapOptions);

    // Fetch markers from Firebase
    try {
        const querySnapshot = await getDocs(collection(db, "between-data"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.map && typeof data.map.latitude === 'number' && typeof data.map.longitude === 'number') {
                const latitude = data.map.latitude;
                const longitude = data.map.longitude;

                // Determine the marker icon based on the category
                let iconUrl;
                switch (data.category) {
                    case "1":
                        iconUrl = "assets/orange_plug_small.png";
                        break;
                    case "2":
                        iconUrl = "assets/red_plug_small.png";
                        break;
                    case "3":
                        iconUrl = "assets/green_plug_small.png";
                        break;
                    case "4":
                        iconUrl = "assets/blue_plug_small.png";
                        break;
                    default:
                        iconUrl = "assets/blue_plug_small.png"; // Default icon if category doesn't match
                        break;
                }
                
                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: "Your custom marker title",
                    icon: {
                        url: iconUrl, // Path to your custom pin image
                        scaledSize: new google.maps.Size(50, 50) // Set the size of the marker (width, height)
                    }
                    
                });
                

                // create info winodw
                let formattedTimestamp = "N/A";
                if (data.timestamp && data.timestamp.toDate) {
                    const timestamp = data.timestamp.toDate();
                    formattedTimestamp = timestamp.toLocaleString();
                }
    
                // 情報ウィンドウのコンテンツを作成
                const contentString = `
                <div>
                   
                    <h1 class="mapInfo">${data.name}</h1>
                    <p class="mapInfo">${data.city}</p>

                    <p class="mapInfo">${data.title}</p>
                    <p class="mapInfo">${formattedTimestamp}</p>
                    <div id="maptextBack">
                    <div id="innerBorder">
                    <p class="mapInfo" id="mapText">After all, unfortunately, we can't tell you about it here. Maybe the story can only be experienced where the story happened.</p>
                 
                   
                    <a id="goMap" href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}" target="_blank" class="mapInfo">＞ GO TO FIND THIS STICKER</a>
                    </div>
                    </div>
                    <br> <br>
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            // マーカーがクリックされたときに情報ウィンドウを開くリスナーを追加
            const openInfoWindow = () => {
                event.preventDefault(); // デフォルトのタッチ動作を防止
                infoWindow.open(map, marker);
            };
            
            marker.addListener('click', openInfoWindow);
            marker.addListener('mousedown', openInfoWindow);
            marker.addListener('touchstart', openInfoWindow);
            marker.addListener('touchend', openInfoWindow);

            } else {
                // Log a message for missing or invalid coordinates, but do not throw an error
                console.log(`Skipping document ID: ${doc.id} due to missing or invalid coordinates.`);
            }
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

function loadGoogleMapsScript() {
    if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCH5pbBSSlcXO2iB_5Lm7iS0D1WoSlPcFo&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = function() {
            console.error("Error loading Google Maps script.");
        };
        document.head.appendChild(script);
    } else {
        // Google Maps API script is already loaded
        if (typeof window.initMap === 'function') {
            window.initMap();
        }
    }
}




document.addEventListener('DOMContentLoaded', loadGoogleMapsScript);
