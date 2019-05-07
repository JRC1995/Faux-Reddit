<template>

  <div>

  <div class="blur" v-if="this.$store.state.blur==true" v-on:click="cancel_form()"></div>

  <div class="outer_form">

    <div class="login-form" v-if="this.login_form == true">
      <form id="login_form">
        <input type="text" v-model="login_user" id="login_user" class="field" placeholder="Enter Username" required><br>
        <input type="password" v-model="login_pass" id="login_pass" class="field" placeholder="Enter Password" required><br>
        <button class="button_style" style="margin-left:10px;" v-on:click="authenticate()">Log in</button>
        <button id="login_dummy_button" style="appearance:none;background:white;border:none;padding:0;"></button>
        <br>
      </form>
       <button class="link" style="margin-left:10px;margin-top:7px;" v-on:click="sign_up">Don't have an account? Click here!</button>
    </div>

   <div class="registration-form" v-else-if="this.registration_form == true">
     <form id="signup_form">
       <table>
       <tr><td>Username: </td><td><input type="text" v-model="signup_user" class="field" pattern=".{3,12}" placeholder="Enter Username" required title="Must be greater than 2 and less than 13 characters"></td></tr>
       <tr><td>Email: </td><td><input type="email" v-model="signup_email" class="field" placeholder="Enter Email" required></td></tr>
       <tr><td>Password: </td><td><input type="password" v-model="signup_pass"  class="field" id="password" placeholder="Enter Password" required></td></tr>
       <tr><td>Re-enter Password: </td><td><input type="password" v-model="signup_cpass"  id="confirm_password" class="field" v-on:change="confirm_password()" placeholder="Re-enter Password" required></td></tr>
       </table>
       <button class="button_style" style="margin-top:10px;" v-on:click="register()">Sign Up</button>
       <button id="signup_dummy_button" style="appearance:none;background:white;border:none;padding:0;"></button>
       <br>
     </form>
      <button class="link" style="margin-top:7px;" v-on:click="log_in(false)">Already have an account? Click here to log in!</button>
   </div>

   <div class="user-panel" v-if="this.$store.state.userdetails_status == true">
     <table v-if="this.$store.state.userdetails !=null">
     <tr><td><b>Name: </b></td><td style="padding-left: 5px;">{{this.$store.state.userdetails.user_name}}</td></tr>
     <tr><td><b>Email: </b></td><td style="padding-left: 5px;"><span style="color:#3676e8;">{{this.$store.state.userdetails.email}}</span> </td></tr>
     <tr><td><b>Karma: </b></td><td style="padding-left: 5px;">{{this.$store.state.userdetails.karma}} points </td></tr>
     </table>
   </div>

</div>

<div class="header_outside">

  <header class="header">

    <div class ="header_inside">
       <table>
       <tr>
       <td style="vertical-align: middle;"><button class="back" v-on:click="back"><img class="back_image" src="../assets/back.png" height="15" width="15"></button></td>
       <td style="vertical-align: middle;padding-top:5px;">E-Dialectics</td>
       </tr>
       </table>
    </div>

    <div class="loginbutton"  v-on:click="log_in(true)" v-if="this.$store.state.logged_in==false"><span>Log in</span></div>

    <div v-if="this.$store.state.logged_in==true" style="float: right; display:inline-block; margin-right: 2%;margin-top: 1.1%;">
      <table>
      <tr>
      <td><div class="username_welcome"  v-on:click="username_click()">Welcome, {{this.$store.state.username}}</div></td>
      <td style="width:100px;padding-left:10px;"><div class="loginbutton" style="margin-top: -1.1%;" v-on:click="log_out()">Log out</div></td>
      </tr>
      </table>
    </div>

  </header>

  <div class="header_gap"></div>

</div>

</div>

</template>

<script>
import axios from 'axios'

export default {
  name: "Header",

  data () {
    return{
      login_form: false,
      registration_form: false,
      login_user: "",
      login_pass: "",
      signup_user: "",
      signup_pass: "",
      signup_email: "",
      signup_cpass: ""
    }
  },


  methods:{

    back(){
      this.$store.commit('back')
    },

    log_in(flip_blur){
      if (flip_blur)
      {
        this.$store.commit('flip_blur');
      }
      this.login_form = true;
      this.registration_form = false;
    },

    sign_up(){
      this.login_form = false;
      this.registration_form = true;
    },

    cancel_form(){
      this.$store.commit('flip_blur');
      this.login_form = false;
      this.registration_form = false;
      this.$store.commit("show_userdetails",false);
      this.signup_pass = "";
      this.signup_cpass = "";
      this.signup_email = "";
      this.signup_user = "";
      this.login_user = "";
      this.login_pass = "";
    },

    authenticate(){

      document.getElementById('login_pass').setCustomValidity("");
      document.getElementById('login_user').setCustomValidity("");

      var f = document.getElementById("login_form")

      if (f.checkValidity()){

        axios.get('http://localhost:5000/authenticate', {
            params: {
              user_name: this.login_user
            }
          }).then(response =>
            { var pass = response.data;
              console.log(pass[0])
              if (typeof pass[0] == "undefined") {
                document.getElementById('login_user').setCustomValidity("Incorrect username");
                document.getElementById("login_dummy_button").click()
              }
              else if(pass[0].password != this.login_pass){
                document.getElementById('login_pass').setCustomValidity("Incorrect username or password");
                document.getElementById("login_dummy_button").click()
              }
              else{
                this.$store.commit("flip_logged_in");
                this.$store.commit("update_username",this.login_user);
                this.$store.commit('flip_blur');
                this.login_form = false;
                this.login_user = "";
                this.login_pass = "";
              }
            })
        }
    },

    register(){

      var f = document.getElementById("signup_form")
      if (f.checkValidity()){

        // do these on success
        this.$store.commit('flip_blur');
        this.login_form = false;
        this.registration_form = false;
        this.$store.commit("show_userdetails",false);
        this.signup_pass = "";
        this.signup_cpass = "";
        this.signup_email = "";
        this.signup_user = "";
      }

    },


    confirm_password() {
      if (this.signup_pass != this.signup_cpass) {
          document.getElementById('confirm_password').setCustomValidity('Passwords do not match');
      } else {
          // input is valid -- reset the error message
          document.getElementById('confirm_password').setCustomValidity('');
      }
   },

   log_out(){
     this.$store.commit("flip_logged_in");
     this.$store.commit("update_username",null);
   },

   username_click(){
     this.$store.commit('flip_blur');
     this.$store.commit("select_username",this.$store.state.username);
     this.$store.commit("show_userdetails",true);
   }
  }
}
</script>


<style scoped>

@font-face {
  font-family: "DancingScript";
  src: url("../../public/fonts/DancingScript-Bold.ttf") format("truetype");
}

.button_style{
  border-radius: 5px;
  display: inline-block;
  color: white;
  cursor: pointer;
  border: none;
  text-overflow: ellipsis;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  background-color:#3676e8;
  transition: all 0.5s;
  font-size: 13px;
  padding: 7px;
  padding-left: 15px;
  padding-right: 15px;
}

.button_style:hover {
  background-color:  #6496EE;
}

.username_welcome{
    font-family: "DancingScript";
    color: white;
    font-size: 22px;
    display: inline-block;
    cursor: pointer;
    transition: all 0.5s;
}

.username_welcome:hover{
  font-size: 25px
}


.blur{
  width:100%;
  height:100%;
  z-index: 1001;
  display: inline-block;
  background-color: white;
  position: fixed;
  opacity:0.5;
  margin-top: -9px;
  margin-left: -8px;
  margin-right: -8px;

}

.td {
  vertical-align: middle;
}

.field{
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 0.5px solid grey;
  margin-left: 10px;
}

.login-form{
  opacity: 1;
  width: 300px;
  z-index: 1002;
  display: inline-block;
  background-color: white;
  position: fixed;
  padding: 20px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-radius: 10px;
  margin-left: -150px;
  margin-top: 10%;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);

}

.registration-form{
  opacity: 1;
  width: 500px;
  z-index: 1003;
  display: inline-block;
  background-color: white;
  position: fixed;
  padding: 20px;
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-radius: 10px;
  margin-left: -250px;
  margin-top: 10%;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);
  font-size: 15px;

}

.user-panel{
  opacity: 1;
  width: 300px;
  z-index: 1004;
  display: inline-block;
  background-color: white;
  position: fixed;
  padding: 20px;
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-radius: 10px;
  margin-left: -150px;
  margin-top: 10%;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);
  font-size: 15px;

}


.outer_form{
  padding-left: 50%;
}

.link {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 11px;
  background-color:rgba(0, 0, 0, 0);
  padding: 0px;

}

.link:hover{
  text-decoration: underline;
}


.header_outside {
  display: block;

}
.header {
    -webkit-box-shadow: 0 8px 6px -6px #999;
    -moz-box-shadow: 0 8px 6px -6px #999;
    box-shadow: 0 8px 6px -6px #999;
    width: 100%;
    position: fixed;
    display: inline-block;
    background-color:  #3676e8;
    z-index: 1000;
    margin-top: -9px;
    margin-left: -8px;
    margin-right: -8px;
}

.header_gap {
    width: 100%;
    height: 85px;
}

.header_inside {
    padding-top: 1%;
    padding-bottom: 1%;
    padding-left: .5%;
    font-size: 200%;
    width:20%;
    color: white;
    font-family: "DancingScript";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: inline-block;
}



.back {
  border-radius: 100%;
  display: inline-block;
  cursor: pointer;
  border: none;
  text-overflow: ellipsis;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  background-color:rgba(0, 0, 0, 0);
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 7px;
  margin-right: 7px;
  border: solid 2px white;
  transition: all 0.5s;
  background-color:  #6496EE;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);

}


.back:hover {
  background-color:  #4d86eb;
}

.loginbutton{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
	background-color:#6496EE;
	transition: all 0.5s;
  cursor: pointer;
  display: inline-block;
	border: none;
	color: white;
	text-align: center;
	border-radius: 5px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
	box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
	font-size: 20px;
  float: right;
  margin-right: 2%;
  margin-top: 1.1%;

}

.loginbutton span {

  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.loginbutton span:after {

  content: ' / Sign up';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -25px;
  transition: 0.5s;
}

.loginbutton:hover{
  background-color:#4d86eb;
}
.loginbutton:hover span {

  padding-right: 85px;
}

.loginbutton:hover span:after {
  opacity: 1;
  right: 0;
}


</style>
