var firebaseConfig = {
    apiKey: "AIzaSyAIk98EPcJ9UchYegXBmdDuP1qL-uRqizs",
    authDomain: "ar-js-593c2.firebaseapp.com",
    databaseURL: "https://ar-js-593c2-default-rtdb.firebaseio.com",
    projectId: "ar-js-593c2",
    storageBucket: "ar-js-593c2.appspot.com",
    messagingSenderId: "1019624518025",
    appId: "1:1019624518025:web:3d1e5daee2df38a594b158",
    measurementId: "G-VFYKWC5P2N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
const uploader = document.getElementById("uploader");
var user_id = 0;
var typing_text = document.getElementById('text_input');
var project_name = document.getElementById('projectname');
var uploadBtn = document.getElementById("uploadBtn");
var msg = document.getElementById("msg");
var name = "";
var nameArray = [];
const nameMap = new Map();

//step 1
function getprojectname(){

  name = project_name.value;
  if(name == ""){
    alert("plz enter projectname first");
  }else{
   console.log("projectname: "+name);
  }
}

//step 2
ar_pic.addEventListener("change", event =>{
  var file = event.target.files[0];
  var path = file.name;
  var storageReference = firebase.storage().ref(user_id+"/"+name+"/ar_pic/"+path);
  var task = storageReference.put(file);

});

//step 3 typing
function send(){
  var text = typing_text.value;
  firebase.storage().ref(user_id+"/"+name+"/source/"+text).putString(text).then((snapshot) => {
    console.log('Uploaded a string!');
  });
   
}

//step 4 files upload 
uploadBtn.addEventListener("change", event => {
  if(name == ""){
    alert("plz enter projectname first");
  }
  else{
    for(var i = 0;i<event.target.files.length;i++){
      var file = event.target.files[i];
      var path = file.name;
      var storageReference = firebase.storage().ref(user_id+"/"+name+"/source/"+path);
      const task = storageReference.put(file);
      var num=1;
      task.on("state_changed",
        function progress(snapshot) {
          msg.textContent = "上傳中，請稍後...("+num+"/"+event.target.files.length+")";
          let uploadValue = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          uploader.value = uploadValue;
        },
        function error(err) {
          msg.textContent = "上傳失敗";
        },
        function complete() {
          //console.log(num);
          msg.textContent = "上傳成功";
          num++;
        }

      );
    }
  }

});

//login
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var email = user.email;
    alert("welcome " + email);
    user_id = user.uid;
    console.log(user.uid);

  } else {
    alert("please login first");
  }
});

//class for preview
class preview{
  constructor(name,url){
    this.name = name;
    this.url = url;
    //console.log(this.name);

    document.getElementById("list").innerHTML += 
    "<li><a class=\"a_data\" target=\"_blank\" href=\""+url+"\">"+name+" </a><button class=\"bt_4\" onclick=\"listup("+this.name+")\" > Up </button> <button class=\"bt_4\" onclick=\"deleteBtn("+this.name+")\" > Delete </button> </li>";
  }
}


//show storage data
function load_data(){

  var listRef = firebase.storage().ref(user_id+"/"+name+"/source/");
  var itemName;
  document.getElementById("list").innerHTML="";
  document.getElementById("upload_bar").value=100;

  if(nameMap.size == 0){
    listRef.listAll().then((res) => {
      res.items.forEach((itemRef) => { 
        itemRef.getMetadata().then((metadata) => {

          itemName = metadata.name;
          geturl(itemName);

        }).catch((error) => {
          console.log(error);
        });
      });
    
    }).catch((error) => {
      console.log(error);
    });

  }
  else{
    nameMap.forEach((value, key) => {
      var item = new preview(key,value);
      //console.log(`${key}: ${value}`)
    })
    
  }
  
}

//get name & URL in Map
function geturl(itemName){

  var listRef = firebase.storage().ref(user_id+"/"+name+"/source/");
  var itemURL;

  if(nameMap.size == 0){
    listRef.child(itemName).getDownloadURL().then((url) => {
      itemURL = url;
      var item = new preview(itemName,itemURL);
      nameMap.set(itemName,itemURL);
        
    }).catch((error) => {
      console.log(error);
    });

  }else{
    console.log("url failed");
  }
}


function listup(itemName){
  console.log(itemName);

  //load_data();

}

function deleteBtn(itemName){
  console.log(itemName);
  //load_data();
}

function renew(){
  //nameArray = [];
  load_data();

}

//step div change
function go_step1(){
  document.getElementById("step1").style.display='block';
  document.getElementById("step2").style.display='none';

  document.getElementById("upload_bar").value=0;
}

function go_step2(){
  getprojectname();
  document.getElementById("step1").style.display='none';
  document.getElementById("step2").style.display='block';
  document.getElementById("step3").style.display='none';

  document.getElementById("upload_bar").value=25;
}

function go_step3(){
  document.getElementById("step2").style.display='none';
  document.getElementById("step3").style.display='block';
  document.getElementById("preview").style.display='none';

  document.getElementById("upload_bar").value=50;
}

function go_preview(){
  document.getElementById("step3").style.display='none';
  document.getElementById("preview").style.display='block';
  document.getElementById("upload_bar").value=75;
  load_data();
  
}

function saveData(){
  var sequence = "";
  nameMap.forEach((value, key) => {
    //console.log(key+" "+value);
    sequence += "@"+key;
  })

  firebase.storage().ref(user_id+"/"+name+"/sequence").putString(sequence).then((snapshot) => {
    console.log("saveSequence");
  });
  //console.log(sequence);
}


      