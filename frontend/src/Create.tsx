import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Container from "react-bootstrap/Container";
import AddEditTemplateForm from './AddEditTemplateForm';

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
      return (<AddEditTemplateForm/>);
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
        <Container>
            <h4>Create a new campaign</h4>
            (This is not implemented yet! Would you like to help??? Get in touch - david@whizziwig.com)
            <CreateForm />
        </Container>
    )
}