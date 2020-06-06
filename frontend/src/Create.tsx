import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


const uiConfig = {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
};

const logout = () => {
    firebase.auth().signOut();
};

function CreateForm() {
    const auth = firebase.auth();
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }
    if (user) {
      return (
        <div>
          <p>Current User: {user.email}</p>
          <button onClick={logout}>Log out</button>
        </div>
      );
    }
    return (
        <div>
            <p>You must sign in to create a campaign</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </div>
    );
}
export default function Create() {

    return (
        <div>
            <h4>Create a new campaign</h4>
            <CreateForm />
        </div>
    )
}