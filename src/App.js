import logo from './logo.svg';
import './App.css';
import './Bootstrap.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React, { useRef, useState } from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';


if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBr4ZyS49WfTR1bSMFiqAvirK4_y8lwlZU",
    authDomain: "discock-45855.firebaseapp.com",
    projectId: "discock-45855",
    storageBucket: "discock-45855.appspot.com",
    messagingSenderId: "192213052974",
    appId: "1:192213052974:web:7f9046631834ef04e4f9bf"
  })

}else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();





function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
      {user ? <DisCockChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return (
    <div>
    <header><h1>Welcome to Discorn</h1></header>
    <img src="https://media.tenor.com/images/c8bbc3ae3147084b692d91c5c756feff/tenor.gif"></img>
      <button className="btn btn-dark" onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
  )
}

function SignOut(){

  return auth.currentUser && (
    <button className="btn btn-danger"onClick={()=> auth.signOut()}>Sign Out</button>
  )

}

function getData(){
  const docRef = firestore.collection('messages').doc('yKf1FoJeJg4zqJhlTsqX');

  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

}

function DisCockChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue,setFormValue] = useState('');
 

  const sendMessage = async(e) =>{
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
  
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  


  return (
   <div>
     <SignOut />
  
     {messages && messages.map(msg => <DisCockChatMsg key={msg.id} message={msg} />)}
     <span ref={dummy}></span>
   <form onSubmit={sendMessage}>
    <input value={formValue}onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
     <button type="submit"  disabled={!formValue} > 🍆 </button>
   </form>
   </div>

   
  )
}

function DisCockChatMsg(props){

  
  const {text,id,photoURL,uid} = props.message;

    const buttonRender = uid === auth.currentUser.uid;
 
    return (
    <div>
        <span>
        <img src={photoURL || 'data:image/jpeg;base64,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'} />
        {buttonRender ?  <DeleteButton name="dennis"/> : null}
        </span>
        <p>{text}</p>

  </div>
  )

}

function DeleteButton(props){
  const {name} = props.name;
 //TO DO : Pass props and delete this fucker
  const deleteMessage=(e)=>{
    console.log(e);
  }
  return(
    <button onClick={deleteMessage}>Del </button>
  )
}


export default App;
