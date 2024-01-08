import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import { getAuth } from "firebase/auth"
import { db } from "../firebaseconfigs";
import { collection, addDoc, doc, onSnapshot, DocumentSnapshot, setDoc, query, where, getDocs } from "firebase/firestore";

const animalNames = [
  "fox", "lion", "tiger", "mouse", "crab",
  "elephant", "giraffe", "zebra", "penguin", "koala",
  "dolphin", "panda", "cheetah", "parrot", "kangaroo",
  "octopus", "sloth", "owl", "rhinoceros", "polar bear",
  // Add more names as needed
];
const notes = [
  "ghoster", "boring", "weirdo", "sophomore", "math major",
  "adventurous", "creative", "optimistic", "introverted", "extroverted",
  "curious", "ambitious", "artistic", "tech-savvy", "bookworm",
  "go-getter", "easygoing", "energetic", "daydreamer", "foodie",
  // Add more notes as needed
];
const avatars = ["https://pfps.gg/assets/pfps/6826-yipeee.png", "https://picsum.photos/200"];

const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  // console.log(contacts)
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));

}

export async function createContact() {

  const auth = getAuth();
  const user = auth.currentUser.email; //email address of the current user

  const docRef = await addDoc(collection(db, "pairingroom"),
    {
      ID: user,
      pairedWith: "N/A",
      status: "active"
    }
  )

  const result = await waitingtopair(docRef);
  // console.log(result.pairedWith);

  //add data to pairing room
  // format: {ID:"", pairedWith:"N/A", status: "active"}

  //wait for automatic changes to happen in the same document
  //when there is a change to this document make pairedWith: as id

  //get data from network  - id and twiiter(other user)
  let id = result.pairedWith
  let twiiter = user
  let docref = docRef


  // let id = Math.random().toString(36).substring(2, 9); //creates ID
  const animalName = getRandomElement(animalNames);
  const note = getRandomElement(notes);
  const avatar = getRandomElement(avatars);
  let contact = {
    groupID: id,
    createdAt: Date.now(),
    first: "Anonymous",
    last: animalName,
    avatar: avatar,
    notes: note,
    favorite: false,
    user: user,
  }; //creates date
  // Add the updated contact to Firestore in the "groups" collection
  try {
    const docRef = await addDoc(collection(db, "groups"),
      contact
    )
  } catch (error) {
    console.error("Error adding contact to Firestore:", error);
    throw error; // Rethrow the error if needed
  }
  // let contacts = await getContacts(); // gets all the contacts that already exist
  // contacts.unshift(contact); // adds this contact to all the contacts
  // await set(contacts); // sets in the new contact
  return contact; // returns the details of the conatact
}

export async function getContact(groupID) {
  // await fakeNetwork(`contact:${groupID}`);
  // console.log(groupID);
  // let contacts = await localforage.getItem("contacts");
  // let contact = contacts.find(contact => contact.id === id);
  let contact = [];
  try {
    const groupsRef = collection(db, "groups")
    const q = query(groupsRef, where("groupID", "==", groupID));
    const querySnapshot = await getDocs(q);
    contact = querySnapshot.docs[0].data();
    // console.log(contact);
  }
  catch (error) {
    console.error('Error getting contact:', error);
    throw error; // You might want to handle or log the error appropriately
  }
  
  return contact;
}

export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  // Get the reference to the document in Firestore
  const contactRef = doc(db, "groups", contact.docref);
  // Add the updated contact to Firestore in the "groups" collection
  try {

    setDoc(contactRef, { capital: true }, { merge: true });
  } catch (error) {
    console.error("Error Updating contact to Firestore:", error);
    throw error; // Rethrow the error if needed
  }
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 1000);
  });
}

async function waitingtopair(docRef) {
  return new Promise((resolve) => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.status === "completed") {
          // Pairing is completed, resolve the promise with the document data
          unsubscribe(); // Stop listening for further changes
          resolve(data);
        }
      } else {
        // Document doesn't exist or has been deleted, resolve with null
        unsubscribe(); // Stop listening for further changes
        resolve(null);
      }
    });
  });
}