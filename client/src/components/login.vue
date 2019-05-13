
 <template>
 <div class="header_login">
        <button v-on:click="login()">LOGIN</button>
    <div v-if="visible" id="login_page">
        <input v-model="user" placeholder="username">
        <input v-model="password" :type="passwordType" placeholder="password">
        <button v-on:click="authenticate()">SUBMIT</button>
    </div>
   </div>
 </template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return{ user: '', passwordType: 'password', pass: '', visible: false, toggle: false, auth: false, password: null, user: null}
  },
  mounted() {
    axios.get('http://localhost:5000/authenticate', {
        params: {
          user_name: this.user
        }
      }).then(response => { this.pass = response.data;})
  },
   methods: {
    login: function (event) {
        if (!this.toggle) {
          this.visible = true;
          this.toggle = true;
        }
        else if (this.toggle) {
          this.visible = false;
          this.toggle = false;
        }
    },
    checkPassword: function (passwd) {

      // Detect if we received password information or not.
      if (typeof passwd[0] == "undefined") {
        alert('Username not found');
      }
      // If password matches, then good to go.
      else if (this.password == passwd[0].password) {
        this.auth = true;
        this.visible = false;
      }
      // Incorrect login name -- display message
      else {
        this.auth = false;
        this.visible = true;
        alert('Check your credentials.');
      }
      this.toggle = false;
    },
    authenticate: function (event) {
	    // Check database for auth
      // Empty packet is nonexistent database entry
      let self = this;
	    axios.get('http://localhost:5000/authenticate', {
      	params: {
          user_name: self.user
        }
      }).then(response => {
        self.pass = response.data; self.checkPassword(self.pass)})
    }
  }
}
</script>

<style scoped>
.header_login {
    position: relative;
    display: block;
    width: 1000%;
    margin-left: 70%;
}
</style>
