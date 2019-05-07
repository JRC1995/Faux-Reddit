<template>

  <div class="comment_app">

    <table style="width:100%">
        <tr>

          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(this.thread.score)}}</b><br>
              <button class="vote"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>

          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_title"><b>{{this.thread.title}}</b></div><br>
              <div class="thread_details">
                by <button class="username_link" v-bind:key="this.thread.thread_id" v-on:click="username_click_title()">{{this.thread.user_name}}</button> on {{totime(this.thread.created_utc)}}
              </div>
              <br>
              <div class="thread_body">
                {{this.thread.body}}
              </div>
            </div>
          </td>

        </tr>
    </table>

    <div style="withd:100%;padding-left:67px;">
    <h4><u>Comments</u></h4>
    </div>

    <table style="width:100%;margin-top:-15px;">

      <div v-bind:key="comment._id" v-for="comment in this.comments">

        <tr>

          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(comment.score)}}</b><br>
              <button class="vote"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>

          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_details">
              <button class="username_link_comment" v-on:click="username_click_comment(comment.user_name)">{{comment.user_name}}</button> on {{totime(comment.created_utc)}}
              </div>
              <br>
              <div class="thread_body">
                {{comment.body}}
              </div>
              <br>
              <button class="comment_button">Reply</button>
              <button class="comment_button" v-on:click="show_subcomments(comment)">Load Replies</button>
              <button class="comment_button" v-if="comment.removed==0">Delete</button>
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
  name: "Comments",
  components: {

  },


data(){
  return{

     thread:this.$store.state.selected_thread,
     comments: []

  }

},
mounted () {

console.log("comments mounted: "+this.thread.thread_id)

axios.get('http://localhost:5000/comments',{
  params: {
    thread_id: this.thread.thread_id
  }
}).then((response) => {
    this.comments = response.data
  })
},

methods: {
  totime(unix_timestamp){
    var t = new Date(unix_timestamp*1000);
    var formatted = moment(t).format("Do MMM YYYY h:mm a");
    return formatted
  },
  show_subcomments(comment){
    var current_states = {comment_state: this.$store.state.comment_state,
                      selected_thread: this.$store.state.selected_thread,
                      subcomment_state: this.$store.state.subcomment_state,
                      selected_comment: this.$store.state.selected_comment,
                      subcomments: this.$store.state.subcomments};
    this.$store.commit('update_history',current_states);
    this.$store.commit('change_subcomment_state_to_true');
    console.log(this.$store.state.subcomment_state);
    this.$store.commit('select_comment',comment);
    console.log(this.$store.state.selected_subcomment);
  },
  username_click_title(){
    this.$store.commit('flip_blur');
    this.$store.commit("select_username",this.thread.user_name);
    this.$store.commit("show_userdetails",true);
  },
  username_click_comment(username){
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

.comment_app {
  display: inline-block;
  width: 65%;
}


.thread_title {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 17px;
  min-width: 100%;
  max-width: 100%;
  transition: all 0.4s;
  margin-bottom: 2px;
  background-color:rgba(0, 0, 0, 0);

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
  background-color:rgba(0, 0, 0, 0);
  padding: 1px;

}

.username_link_comment {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 17px;
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
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);
  background-color: white;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left:2%;
  padding-right:2%;
  min-width: 100%;
  max-width: 100%;
  margin-left: 0.5%;

}

.thread_details{
  font-size: 10px;
}

.username_link:hover{
  text-decoration: underline;
}

.username_link_comment:hover{
  text-decoration: underline;
}


.score_block
{
  display: inline-block;
  font-size: 17px;
  font-family: "DancingScript";
  text-align: center;
  margin-top: 7px;
  margin-bottom: 7px;
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

.comment_button {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 13px;
  max-width: 15%;
  background-color:rgba(0, 0, 0, 0);
  text-decoration: underline;

}

/*table, th, td {
  border: 1px solid black;
}*/

</style>
