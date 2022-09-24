import firebase from "../config/firebase";

const db = firebase.firestore();

export function dataFromSnapshot(snapshot) {
    if (!snapshot.exists) return undefined;
    const data = snapshot.data();

    // convert firestore timestamp to JavaScript date object
    for (const prop in data) {
        if (data.hasOwnProperty(prop)) {
            if (data[prop] instanceof firebase.firestore.Timestamp) {
                data[prop] = data[prop].toDate();
            }
        }
    }

    // grep the id field from the firestore return data
    return {
        ...data,
        id: snapshot.id
    }
}

export function listenToAccountsFromFirestore() {
    return db.collection('accounts');
}

export function listenToAccountFromFirestore(accountId) {
    return db.collection('accounts').doc(accountId);
}

export function addAccountToFirestore(account) {
    return db.collection('accounts').add({
        ...account
    });
}

export function updateAccountInFirestore(account) {
    return db.collection('accounts').doc(account.id).update(account);
}

export function deleteAccountInFirestore(accountId) {
    return db.collection('accounts').doc(accountId).delete();
}

export function setUserProfileData(user, creds) {
    return db.collection('users').doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        twitterAccount: creds.twitterAccount,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

export function getUserProfile(userId) {
    return db.collection('users').doc(userId);
}