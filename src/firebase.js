// firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyC3A3wCGJPOyWAz_1NHmuxzslTL8nkOR9o",
//   authDomain: "location-tracking-68a4e.firebaseapp.com",
//   databaseURL: "https://location-tracking-68a4e-default-rtdb.firebaseio.com",
//   projectId: "location-tracking-68a4e",
//   storageBucket: "location-tracking-68a4e.firebasestorage.app",
//   messagingSenderId: "801580557571",
//   appId: "1:801580557571:web:7dcfae8072c4bcf0d1b536",
//   measurementId: "G-PGH0EH8G4Y"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAvCqXtG0MqA75tOphQ-tz8xxd1ggxJ_Jk",
  authDomain: "dragon-56898.firebaseapp.com",
  projectId: "dragon-56898",
  storageBucket: "dragon-56898.firebasestorage.app",
  messagingSenderId: "600711030860",
  appId: "1:600711030860:web:cf7b171d725d0485036ce9",
  measurementId: "G-8SF8KRJGWT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup,  };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db, collection, addDoc };