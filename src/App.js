import './App.css';
import Homepage from './components/Homepage.js';
import './Typing.css'; // import css

// config to connect to firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { initializeApp } from "firebase/app";

// firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyBoFv8NLpdCrsMvYPbhlJXP4_NMMaFYm0U",
  authDomain: "typeracer-no-fail.firebaseapp.com",
  projectId: "typeracer-no-fail",
  storageBucket: "typeracer-no-fail.appspot.com",
  messagingSenderId: "1021740562247",
  appId: "1:1021740562247:web:699ac17a10f8b488c2fe62",
  measurementId: "G-J8Y0PTG2YS"
};

firebase.initializeApp({
  apiKey: "AIzaSyBoFv8NLpdCrsMvYPbhlJXP4_NMMaFYm0U",
  authDomain: "typeracer-no-fail.firebaseapp.com",
  projectId: "typeracer-no-fail",
  storageBucket: "typeracer-no-fail.appspot.com",
  messagingSenderId: "1021740562247",
  appId: "1:1021740562247:web:699ac17a10f8b488c2fe62",
  measurementId: "G-J8Y0PTG2YS"
})

const auth = firebase.auth();

const app = initializeApp(firebaseConfig);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: "#ffce47", borderRadius: '0' }}>
        {/* .display(logged in ? homepage + sign-out button : sign-in button) */}
        {user ? (
          <div>
            <Homepage />
            <div style={{ height: 50 }} />
            <SignOut />
          </div>
        ) : (
          <SignIn />
        )}
      </header>
    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="btn btn-primary btn-block" style={{ borderRadius: '15px', fontSize: '25px' }} onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="btn btn-danger btn-block" style={{ borderRadius: '15px', padding: '8px 15px 8px 15px' }} onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
