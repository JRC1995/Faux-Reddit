<template>

  <div class="comment_app">

    <div class="outer_form" v-if="this.$store.state.editor==true">
      <div class="editor">
        <form>
        <ckeditor :editor="editor" v-model="body" :config="editorConfig"></ckeditor>
        <button class="button_style" style="margin-top:10px;" v-on:click="create_comment">Create</button>
        </form>
      </div>
    </div>

    <table style="width:100%">
        <tr>

          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote" v-on:click="voting_thread(thread.thread_id, 1)"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(this.thread.score)}}</b><br>
              <button class="vote" v-on:click="voting_thread(thread.thread_id, -1)"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>

          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_title">
                <b>
                <span v-html="thread.title" v-if="thread_deleted==false"></span>
                <span style="color:red;" v-html="thread.title+' [DELETED]'" v-else></span>
                </b>
              </div><br>
              <div class="thread_details">
                by <button class="username_link" v-bind:key="this.thread.thread_id" v-on:click="username_click_title()">{{this.thread.user_name}}</button> on {{totime(this.thread.created_utc)}}
              </div>
              <br>
              <div class="thread_body">
                <span v-html="thread.body"></span> <br>
                <button class="button_style" style="margin-top:20px;" v-if="this.$store.state.logged_in==true" v-on:click="open_editor(thread.thread_id,'post')">
                  Reply
                </button>
                <button class="button_style" style="margin-top:20px;margin-left:10px;" v-if="this.$store.state.moderator_status==true" v-on:click="delete_thread()">
                  Delete
                </button>
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
              <button class="vote" v-on:click="voting_comment(thread.thread_id, 0, comment._id, 1, comment.score)"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(comment.score)}}</b><br>
              <button class="vote" v-on:click="voting_comment(thread.thread_id, 0, comment._id, -1, comment.score)"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>

          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_details">
              <button class="username_link_comment" v-on:click="username_click_comment(comment.user_name)">{{comment.user_name}}</button> on {{totime(comment.created_utc)}}
              </div>
              <br>
              <div class="thread_body">
                <span v-html="comment.body" v-if="comment.removed==0"></span>
              </div>
              <br>
              <button class="comment_button" v-if="$store.state.logged_in==true" v-on:click="open_editor(comment._id,'comment')">Reply</button>
              <button class="comment_button" v-on:click="show_subcomments(comment)">Load Replies</button>
              <button class="comment_button" v-if="$store.state.moderator_status==true">Delete</button>
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: "Comments",
  components: {

  },


data(){
  return{

     thread:this.$store.state.selected_thread,
     comments: [],
     editor: ClassicEditor,
     body: '',
     editorConfig: {
       // The configuration of the editor.
       placeholder: "Enter comment here."
     },
     parent_id: null,
     thread_deleted: false,
     comment_deleted: false

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

  if (this.$store.state.logged_in==true)
  {

    axios.get('http://localhost:5000/moderator_status',{
      params: {
        subforum_id: this.$store.state.selected_thread.subforum_id,
        user_id: this.$store.state.user_id
      }
    }).then((response) => {
        this.$store.commit('update_moderator_status', response.data);
      })
  }

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
  },

  open_editor(parent_id,parent_type){

    if (parent_type == 'post')
    {
      this.parent_id = 't'+parent_id
    }
    else{
      this.parent_id = parent_id
    }
    console.log(this.parent_id)
    this.body = "";
    this.$store.commit('flip_blur')
    this.$store.commit('editor',true)
  },

  create_comment(){
    var body = this.body.substring(3,this.body.length-4)

    axios.get('http://localhost:5000/create_comment',{
      params: {
           body: body,
           parent_id: this.parent_id,
           username: this.$store.state.username,
      }
    }).then((response) => {
      if (response == "unsuccessful"){
        alert("Something went wrong! Try again, perhaps?");
      }
      else{

        axios.get('http://localhost:5000/comments',{
          params: {
            thread_id: this.thread.thread_id
          }
        }).then((response) => {
            this.comments = response.data;
            this.$store.commit('editor',false);
            this.$store.commit('flip_blur');
          })

      }

    })
  },

  delete_thread(){

    axios.get('http://localhost:5000/delete_thread',{
      params: {
        thread_id: this.thread.thread_id
      }
    }).then((response) => {

        var message = response.data;
        if (message == "success") this.thread_deleted = true;
        else alert("Something went wrong! Try again, perhaps?");
      })
  },

  voting_thread(thread_id, sentiment)
  {
    console.log(this.$store.state.username, thread_id, sentiment);
    axios.get('http://localhost:5000/get_thread_vote', {
      params: {
        user_id: this.$store.state.user_id,
        thread_id: thread_id
      }
    }).then((response) => {
        //if no vote exists add it
        
        if(typeof response.data[0] == "undefined" && this.$store.state.logged_in == true)
        {
          /*
          axios.get('http://localhost:5000/create_subscription', {
            params: {
              user_id: this.$store.state.user_id,
              subforum_id: this.$store.state.selected_thread.subforum_id
            }
          }).then(response => {
            alert("Subscribed")
          })
          */
          console.log("yes", sentiment)
          axios.get('http://localhost:5000/create_thread_vote', {
            params: {
              user_id: this.$store.state.user_id,
              thread_id: thread_id,
              sentiment: sentiment
            }
          }).then(response => {
            if(sentiment == 1)
            {
              alert("LIKED")
            }
            else
            {
              alert("DISLIKED")
            }
          })
        }
        else if(this.$store.state.logged_in == true)
        {
          this.sentiment = response.data[0].sentiment
          console.log(this.sentiment)
          console.log("ASDBASD")
          //if sentiment is the same delete it
          if(this.sentiment == sentiment)
          {
            axios.get('http://localhost:5000/delete_thread_vote', {
            params: {
              user_id: this.$store.state.user_id,
              thread_id: thread_id
            }
            }).then(response => {
              alert("VOTE DELETED")
            })


          }
          //else if different update it
          else
          {
            axios.get('http://localhost:5000/update_thread_vote', {
            params: {
              user_id: this.$store.state.user_id,
              thread_id: thread_id,
              sentiment: sentiment
            }
            }).then(response => {
              alert("VOTE UPDATED")
    
            })
          }
        }
    })
  },

  voting_comment(thread_id, parent_id, comment_id, sentiment, comment_score)
  {
    
    comment_id = parseInt(comment_id);
    //parent/origin comments always have a parent_id of 0
    console.log(thread_id, parent_id, comment_id, sentiment, comment_score);
    
    console.log(comment_score)
    axios.get('http://localhost:5000/get_comment_vote', {
    params: {
      user_id: this.$store.state.user_id,
      comment_id: comment_id
      }
    }).then(response => {
      alert("YEAP")
      //need to check if comment vote exists in sql first
      //then do mongo updates
      

      if(typeof response.data[0] == "undefined" && this.$store.state.logged_in == true)
      {
        //create the comment vote in sql
        axios.get('http://localhost:5000/create_comment_vote', {
        params: {
          user_id: this.$store.state.user_id,
          comment_id: comment_id,
          sentiment: sentiment
        }
        }).then(response => {
          alert("COMMENT VOTE CREATED")
        });

        comment_score = parseInt(comment_score)
        comment_score = comment_score + sentiment

        //then update the value in mongo
        axios.get('http://localhost:5000/mongo_update_comment_vote', {
        params: {
          parent_id: 't'+thread_id,
          comment_id: comment_id,
          comment_score: comment_score
        }
        }).then(response => {
          alert("COMMENT VOTE SCORE UPDATED FOR CREATION")
          console.log(response)
        });
        
      }
      //else if the comment vote already exists
      //delete record from sql
      //set mongodb record to new score
      else if(this.$store.state.logged_in == true)
      {
        var retrivedSentiment = response.data[0].sentiment

        console.log(retrivedSentiment, sentiment)
        if(retrivedSentiment == sentiment)
        {
          axios.get('http://localhost:5000/delete_comment_vote', {
            params: {
              user_id: this.$store.state.user_id,
              comment_id: comment_id
            }
            }).then(response => {
              alert("COMMENT VOTE DELETED")
            });

            comment_score = parseInt(comment_score)
            comment_score = comment_score - sentiment

            axios.get('http://localhost:5000/mongo_update_comment_vote', {
            params: {
              parent_id: 't'+thread_id,
              comment_id: comment_id,
              comment_score: comment_score
            }
            }).then(response => {
              alert("COMMENT VOTE DELETION SCORE UPDATED")
              console.log(response)
            });

        }
        //else sentiment user provides is different than what is stored
        //update record in sql
        //update score in mongodb
        else
        {
          console.log('update')
          
          comment_score = parseInt(comment_score)
          console.log(comment_score)
          comment_score = comment_score + (2 * sentiment)
          console.log(comment_score)

          axios.get('http://localhost:5000/update_comment_vote', {
            params: {
              user_id: this.$store.state.user_id,
              comment_id: comment_id,
              sentiment: sentiment
            }
            }).then(response => {
              alert("COMMENT VOTE UPDATED")
            });

            axios.get('http://localhost:5000/mongo_update_comment_vote', {
            params: {
              parent_id: 't'+thread_id,
              comment_id: comment_id,
              comment_score: comment_score
            }
            }).then(response => {
              alert("COMMENT VOTE UPDATE SCORE UPDATED")
              console.log(response)
            });
        }
      }
    });

    

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

.outer_form{
  padding-left: 66.3%;
  display: inline-block;
}

.editor{
  opacity: 1;
  width: 600px;
  z-index: 1005;
  display: inline-block;
  background-color: white;
  position: fixed;
  padding: 30px;
  border-radius: 10px;
  margin-top: 1%;
  margin-left: -310px;
  box-shadow: 0 7px 16px 0 rgba(0,0,0,0.24), 0 7px 16px 0 rgba(0,0,0,0.10);
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


/*table, th, td {
  border: 1px solid black;
}*/

</style>
