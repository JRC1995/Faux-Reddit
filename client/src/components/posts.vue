<template>
  <div class="app">
    <table style="width:100%">
      <div v-bind:key="thread.thread_id" v-for="thread in this.$store.state.threads">
        <tr>
          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(thread.score)}}</b><br>
              <button class="vote"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>
          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <button class="thread_link" v-on:click="show_comments(thread)"><b>{{thread.title}}</b></button><br>
              <div class="thread_details">
                by <button class="username_link" v-on:click="username_click(thread.user_name)">{{thread.user_name}}</button> on {{totime(thread.created_utc)}}
              </div>
            </div>
          </td>
        </tr>
      </div>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: "Posts",
  components: {

  },


data(){
  return{

     threads:null

  }

},
mounted () {

axios.get('http://localhost:5000/frontpage_threads',{
  params: {
    param: {}
  }
}).then((response) => {
    this.$store.commit("update_threads",response.data)
    this.threads = this.$store.state.threads
  })
},

methods: {
  totime(unix_timestamp){
    var t = new Date(unix_timestamp*1000);
    var formatted = moment(t).format("Do MMM YYYY h:mm a");
    return formatted
  },
  show_comments(thread){
    var current_states = {comment_state: this.$store.state.comment_state,
                      selected_thread: this.$store.state.selected_thread,
                      subcomment_state: this.$store.state.subcomment_state,
                      selected_comment: this.$store.state.selected_comment,
                      subcomments: this.$store.state.subcomments}
    this.$store.commit('update_history',current_states);
    console.log(thread)
    this.$store.commit('change_comment_state_to_true');
    console.log(this.$store.state.comment_state)
    this.$store.commit('select_thread',thread);
    console.log(this.$store.state.selected_thread)


  },
  username_click(username){
    this.$store.commit('flip_blur');
    this.$store.commit("select_username",username);
    this.$store.commit("show_userdetails",true);
  },
  format_score(score){
    if (parseInt(score) <= 9999){
      return score;
    }
    else{
      score = parseInt(parseInt(score)/1000);
      score = String(score)+"K";
      return score;
    }
  }
}
}
</script>


<style scoped>

.app {
  display: inline-block;
  width: 67%;
}


.thread_link {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 17px;
  min-width: 100%;
  max-width: 100%;
  transition: all 0.4s;
  margin-bottom: 2px;
  background-color:rgba(0, 0, 0, 0);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.username_link {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  max-width: 10%;
  background-color:rgba(0, 0, 0, 0);
  padding: 1px;

}

.thread_div {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #444444;
  text-align: left;
  text-decoration: none;
  font-size: 16px;
  padding-top: -5px;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);
  background-color: white;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left:5px;
  min-width: 100%;
  max-width: 100%;
  margin-left: 0.5%;

}

.thread_details{
  font-size: 10px;
  padding-left: 3%;
}

.thread_link:hover{
  color: #1651bc;
  z-index:999;
  font-size: 22px;
}

.username_link:hover{
  text-decoration: underline;
}

.score_block
{
  display: inline-block;
  font-size: 17px;
  font-family: "DancingScript";
  text-align: center;
  width: 53px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: none;
}

.vote {
  display: inline-block;
  border: none;
  cursor: pointer;
  text-overflow: ellipsis;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  background-color:rgba(0, 0, 0, 0);
  padding-left: 5px;
}

img.vote_image
{
  transition: all 0.5s;
  background-color:rgba(0, 0, 0, 0);
}


img.vote_image:hover {
  width: 30px;
  height: 30px;
}

/*table, th, td {
  border: 1px solid black;
}*/

</style>
