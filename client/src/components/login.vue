 <template>
 <div class="header_login">
        <b-button v-on:click="login()">LOGIN</b-button>
    <div v-if="visible" id="login_page">
        <input v-model="user" placeholder="username">
        <input v-model="pass" placeholder="password">
        <b-button v-on:click="authenticate()">SUBMIT</b-button>
    </div>
   </div>
 </template>

<script>
export default {
  data () {
    return{ username: 'NULL', visible: false, toggle: false}
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
    authenticate: function (event) {
    	// Check database for auth
    	// If username is not in the database, ask for signup?
    }
  }
}
</script>

<style scoped>
.header_login {
    position: relative;
    display: block;
    width: 1000%;
    margin-top: 10px;
    margin-left: 70%;
}
</style>