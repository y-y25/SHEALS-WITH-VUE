import { createStore } from 'vuex'
import router from '../router'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {doc, setDoc, getDoc} from 'firebase/firestore'

  const store = createStore({
  state: {//Indicates the states of properties like users
    user:null,
    authIsReady:false
  },
  mutations: {// functions here mutates the properties of state's properties

    SET_USER (state, user) {
      state.user = user
    },
    CLEAR_USER (state){
      state.user = null
    },
    SET_AUTHREADY (state, payload){
      state.authIsReady = payload
    }

  },
  actions: { // various functions that could COMMIT different functions in the mutations

    //checking of login before committing and changing user state
    async login ({commit}, details){
      const {email, password} = details
      try {
        // needs to await auth(declared data storage inside), as well as checking of email and password
        await signInWithEmailAndPassword(auth, email, password)
      } catch(error) {
        // Triggers various types which are alerted out
        switch(error.code){
          case 'auth/invalid-login-credentials':
            alert("Invalid login credentials")
            break
          default:
            alert("Something went wrong")
        }
        //return used here since the commit sentence later is when user successfully login
        return 
      }
      commit('SET_USER', auth.currentUser)
      const user_data = await getDoc(doc(db,"users",auth.currentUser.uid))
      const user_rec = user_data.data()
      
      localStorage.setItem('userID', auth.currentUser.uid)
      localStorage.setItem('userType', user_rec.type)
      localStorage.setItem('userEmail', user_rec.email)
      localStorage.setItem('homeAddress', user_rec.homeaddress)

      if (user_rec.type === "consumer"){
        if (user_rec.address == "" || user_rec.catpref == "" || user_rec.dealpref ==""){
          router.push('/questionaire')
        } else {
          router.push("/") 
        }
      } else {
        localStorage.setItem('storeName', user_rec.storename)
        router.push("/storehome")
      }

    },

    //checking of register before committing and changing user state
    async register ({commit}, details){
      const { email, password} = details
      try {
        await createUserWithEmailAndPassword(auth, email, password)
      } catch(error) {
        switch(error.code){
          case 'auth/email-already-in-use':
            alert("Email already in use")
            break
          case 'auth/invalid-email':
            alert("Invalid Email")
            break
          case 'auth/operation-not-allowed':
            alert("Operation not allowed")
            break
          case 'auth/weak-password':
            alert("Weak password")
            break
          default:
            alert("Something went wrong")
        }
        return 
      }
      await setDoc(doc(db, "users", auth.currentUser.uid),{
        email: auth.currentUser.email,
        type: 'consumer',
        homeaddress: '',
        catpref: '',
        dealpref: '',
        like:[],
        cart:[]
      })
      commit('SET_USER', auth.currentUser)

      const user_data = await getDoc(doc(db,"users",auth.currentUser.uid))
      const user_rec = user_data.data()

      localStorage.setItem('userID', auth.currentUser.uid)
      localStorage.setItem('userType', user_rec.type)
      localStorage.setItem('userEmail', user_rec.email)
      localStorage.setItem('homeAddress', user_rec.homeaddress)
      
      if (user_rec.type === "consumer"){
        if (user_rec.address == "" || user_rec.catpref == "" || user_rec.dealpref ==""){
          router.push('/questionaire')
        } else {
          router.push("/home")
        }
      } else {
        router.push("/storehome")
      }

    },

    async addPreference ({commit}, details){
      const { address, categories, dealTypes} = details

        try {
          const userDoc = doc(db, 'users', auth.currentUser.uid);
          const userData = await getDoc(userDoc);
      
          if (userData.exists()) {
            // User document already exists, update it
            await setDoc(userDoc, {
              homeaddress: address,
              catpref: categories,
              dealpref: dealTypes,
            }, { merge: true }); // Use merge to update only specified fields
          }}
        catch(error) {
          console.log(error)
        }
      
      commit('SET_USER', auth.currentUser)

      const user_data = await getDoc(doc(db,"users",auth.currentUser.uid))
      const user_rec = user_data.data()

      if (user_rec.type === "consumer"){
        console.log(user_rec.homeaddress)
        console.log(user_rec.catpref)
        console.log(user_rec.dealpref)
        const messages = [];
        if (user_rec.homeaddress == "") {
          messages.push("Please enter your home address.");
        }
        if (user_rec.catpref == "") {
          messages.push("Please enter product category preference.");
        }
        if (user_rec.dealpref == "") {
          messages.push("Please enter preferred deals.");
        }
        if (messages.length === 0) {
          router.push("/");
        } 
        else {
          alert(messages.join("\n"));
        }
      } 
      
    },

    async logout({commit}){
      await signOut(auth)
      localStorage.removeItem('userID');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('homeAddress');
      if(localStorage.getItem('storeName')){
        localStorage.removeItem('storeName');
      }
      commit('CLEAR_USER') 
      router.push('/')
    },

  }
})

const onsub = onAuthStateChanged(auth,(user) =>{
  store.commit('SET_AUTHREADY', true)
  if(user === null){
    store.commit('CLEAR_USER')
  } else {
    store.commit ('SET_USER', user)
  }
  onsub()
}) 

//export
export default store
