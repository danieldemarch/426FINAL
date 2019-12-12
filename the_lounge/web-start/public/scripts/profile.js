var idmap
// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
  }
  
  // Returns the map of display names to dorms.
async function getDormIDMap() {
    var docRef = await firebase.firestore().collection("DormIDs").doc("DormIDMap");
  
    docRef.get().then(function(doc) {
      if (doc.exists) {
          idmap = doc.data().ids
          return doc.data().ids
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          return null
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
}
  
  // Gets the dorm of the logged in user.
function getUserDorm() {
    return idmap[getUserName()]
}
  


async function saveProfileInformation() {
    console.log("woopwopwopwop")
    var bioInputField = document.getElementById('bioInput').value;
    var yearInputField = document.getElementById('yearInput').value;
    var dormInputField = document.getElementById('myInput').value;
    firebase.firestore().collection('profiles').add({
      name: getUserName(),
      bio: bioInputField,
      year: yearInputField
    }).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
    var currentIDMap = idmap;
    console.log(currentIDMap)
    currentIDMap[getUserName()] = dormInputField;
    console.log(currentIDMap)
    var dormDocRef = await firebase.firestore().collection("DormIDs").doc("DormIDMap");
    return dormDocRef.update({
      ids: currentIDMap
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

function returnToHome() {
    location.replace("index.html");
    console.log("woopwopwopwop")
}

async function deleteAccount() {
    var username = getUserName();
    console.log(username)
    var dormDocRef = await firebase.firestore().collection("DormIDs").doc("DormIDMap");
    var messages_query = firebase.firestore().collection("messages").where('name','==', username);
    messages_query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });    
    var profiles_query = firebase.firestore().collection("profiles").where('name','==', username);
    profiles_query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    }); 
    //idmap.delete(username)
    console.log(idmap)
    delete idmap[username]; 
    console.log(idmap)
    return dormDocRef.update({
        ids: idmap
      })
      .then(function() {
        console.log("fuck");
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

var submitProfileButtonElement = document.getElementById('subButton');
if(submitProfileButtonElement != null){
    submitProfileButtonElement.addEventListener('click', saveProfileInformation);
}
var backProfileButtonElement = document.getElementById('backButton');
if(backProfileButtonElement != null){
    backProfileButtonElement.addEventListener('click', returnToHome);
}
var deleteProfileButtonElement = document.getElementById('deleteButton');
if(deleteProfileButtonElement != null){
    deleteProfileButtonElement.addEventListener('click', deleteAccount);
}


idmap = getDormIDMap();
console.log(idmap)









