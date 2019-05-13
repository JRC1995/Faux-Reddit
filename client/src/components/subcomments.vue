<template>
  <div class="app">

    <div class="outer_form" v-if="this.$store.state.editor==true">
      <div class="editor">
        <form  v-on:submit.prevent>
        <ckeditor :editor="editor" v-model="body" :config="editorConfig"></ckeditor>
        <button class="button_style" style="margin-top:10px;" v-on:click="create_comment">Create</button>
        </form>
      </div>
    </div>


    <table style="width:100%">
        <tr>
          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" v-on:click="voting_comment($store.state.selected_comment._id,1,$store.state.selected_comment.score,'parent')" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(this.$store.state.selected_comment.score)}}</b><br>
              <button class="vote"><img  class="vote_image" v-on:click="voting_comment($store.state.selected_comment._id,-1,$store.state.selected_comment.score,'parent')" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>
          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_details">
              Replies to <button class="username_link_comment" v-on:click="username_click_parent()">{{this.$store.state.selected_comment.user_name}}</button>
              </div>
              <br>
              <div class="thread_body">
                <span v-html="this.$store.state.selected_comment.body" v-if="this.$store.state.selected_comment.removed==0"></span>
                <span v-else style="color:red;font-size:13px">[ REMOVED ]</span><br>
                <button class="button_style" style="margin-top:20px;" v-if="this.$store.state.logged_in==true" v-on:click="open_editor($store.state.selected_comment._id)">Reply</button>
                <button class="button_style" style="margin-top:20px;margin-left:10px;" v-if="($store.state.moderator_status==true || $store.state.selected_comment.user_name==$store.state.username) && $store.state.selected_comment.removed==0" v-on:click="delete_comment($store.state.subcomment_parent_id,$store.state.selected_comment._id,'parent')">Delete</button>
              </div>
              <br>
            </div>
          </td>
        </tr>
    </table>
    <div style="withd:100%;padding-left:67px;">
    <h4><u>Replies</u></h4>
    </div>
    <table style="width:100%;margin-top:-15px;">
      <div v-bind:key="subcomment._id" v-for="subcomment in this.$store.state.subcomments">
        <tr>
          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" v-on:click="voting_comment(subcomment._id,1,subcomment.score,'comment')" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(subcomment.score)}}</b><br>
              <button class="vote"><img  class="vote_image" src="../assets/dislike.png" v-on:click="voting_comment(subcomment._id,-1,subcomment.score,'comment')" height="20" width="20"></button>
            </div>
          </td>
          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <div class="thread_details">
              <button class="username_link_comment" v-on:click="username_click_reply(subcomment.user_name)">{{subcomment.user_name}}</button> on {{totime(subcomment.created_utc)}}
              </div>
              <br>
              <div class="thread_body">
                <span v-html="subcomment.body" v-if="subcomment.removed==0"></span>
                <span v-else style="color:red;font-size:13px">[ REMOVED ]</span>
              </div>
              <br>
              <button class="comment_button" v-if="$store.state.logged_in==true" v-on:click="open_editor(subcomment._id)">Reply</button>
              <button class="comment_button" v-on:click="show_subcomments(subcomment)">Load Replies</button>
              <button class="comment_button" v-if="($store.state.moderator_status==true || subcomment.user_name==$store.state.username) && subcomment.removed==0" v-on:click="delete_comment($store.state.selected_comment._id,subcomment._id,'comment')">Delete</button>
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
import Swal from 'sweetalert2';

export default {
  name: "Comments",
  components: {

  },


data(){
  return{
    editor: ClassicEditor,
    body: '',
    editorConfig: {
      // The configuration of the editor.
      placeholder: "Enter comment here."
    },
    parent_id: null

  }

},
mounted () {

console.log("subcomments mounted: "+this.$store.state.selected_comment._id)

axios.get('http://localhost:5000/subcomments',{
  params: {
    comment_id: this.$store.state.selected_comment._id
  }
}).then((response) => {
    this.$store.state.subcomments = response.data
  })
},

methods: {

  totime(unix_timestamp){
    var t = new Date(unix_timestamp*1000);
    var formatted = moment(t).format("Do MMM YYYY h:mm a");
    return formatted
  },


  update_mount(){
    axios.get('http://localhost:5000/subcomments',{
      params: {
        comment_id: this.$store.state.selected_comment._id
      }
    }).then((response) => {
        this.$store.state.subcomments = response.data
      })
  },


  voting_comment(comment_id, sentiment, comment_score, pos){

    if (pos.localeCompare('comment')==0)
    {
      var parent_id = this.$store.state.selected_comment._id;
    }
    else
    {
      var parent_id = this.$store.state.subcomment_parent_id;
    }

    console.log(parent_id)
    console.log(comment_id)

    if (this.$store.state.logged_in == true){
        axios.get('http://localhost:5000/get_comment_vote', {
          params: {
            user_id: this.$store.state.user_id,
            comment_id: comment_id
          }
        }).then((response) => {
            //if no vote exists add it

            if(typeof response.data[0] == "undefined")
            {
              console.log("yes", sentiment)
              axios.get('http://localhost:5000/create_comment_vote', {
                params: {
                  user_id: this.$store.state.user_id,
                  comment_id: comment_id,
                  sentiment: sentiment,
                  parent_id: parent_id,
                  comment_score: comment_score
                }
              }).then(response => {

                if (sentiment==1)
                {
                  Swal.fire({
                              type: 'success',
                              title: "Upvoted Successfully",
                              focusConfirm: false,
                              showConfirmButton: false,
                              timer: 1200
                            })
                }
                else
                {
                  Swal.fire({
                              type: 'success',
                              title: "Downvoted Successfully",
                              focusConfirm: false,
                              showConfirmButton: false,
                              timer: 1200
                            })
                }
                if (pos.localeCompare('comment')==0)
                    this.update_mount()
                else
                    this.$store.state.selected_comment.score += sentiment
              })
            }
            else
            {
              this.sentiment = response.data[0].sentiment

              //if sentiment is the same delete it
              if(this.sentiment == sentiment)
              {
                if (sentiment == 1)
                {
                  var message = "You have already upvoted this comment. Upvoting again will revoke your upvote. Do you want to proceed?"
                }
                else
                {
                  var message = "You have already downvoted this comment. Downvoting again will revoke your downvote. Do you want to proceed?"
                }
                Swal.fire({ title: 'Are you sure?',
                            text: message,
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3676e8',
                            cancelButtonColor: '#B2B8BF',
                            confirmButtonText: 'Proceed'
                          }).then((result) => {
                            if (result.value) {
                              axios.get('http://localhost:5000/delete_comment_vote', {
                              params: {
                                user_id: this.$store.state.user_id,
                                comment_id: comment_id,
                                parent_id: parent_id,
                                sentiment: sentiment,
                                comment_score: comment_score
                              }
                              }).then(response => {
                                if (sentiment==1)
                                {
                                  Swal.fire({
                                              type: 'success',
                                              title: "Upvote Removed",
                                              focusConfirm: false,
                                              showConfirmButton: false,
                                              timer: 1200
                                            })
                                }
                                else
                                {
                                  Swal.fire({
                                              type: 'success',
                                              title: "Downvote Removed",
                                              focusConfirm: false,
                                              showConfirmButton: false,
                                              timer: 1200
                                            })
                                }
                                if (pos.localeCompare('comment')==0)
                                    this.update_mount()
                                else
                                    this.$store.state.selected_comment.score -= sentiment
                              })

                            }
                          })

              }
              //else if different update it
              else
              {
                axios.get('http://localhost:5000/update_comment_vote', {
                params: {
                  user_id: this.$store.state.user_id,
                  comment_id: comment_id,
                  sentiment: sentiment,
                  parent_id: parent_id,
                  comment_score: comment_score
                }
                }).then(response => {
                  if (sentiment==1)
                  {
                    Swal.fire({
                                type: 'success',
                                title: "Upvoted Successfully",
                                focusConfirm: false,
                                showConfirmButton: false,
                                timer: 1200
                              })
                  }
                  else
                  {
                    Swal.fire({
                                type: 'success',
                                title: "Downvoted Successfully",
                                focusConfirm: false,
                                showConfirmButton: false,
                                timer: 1200
                              })
                  }
                  if (pos.localeCompare('comment')==0)
                      this.update_mount()
                  else
                      this.$store.state.selected_comment.score += 2*sentiment
                })
              }
            }
        })
    }
    else{
      Swal.fire({
                  type: 'error',
                  title: "Oops..",
                  text: "You must log in to vote!",
                  focusConfirm: false,
                  confirmButtonColor: '#3676e8',
                })
    }



  },




  show_subcomments(comment){
    var current_states = {comment_state: this.$store.state.comment_state,
                      selected_thread: this.$store.state.selected_thread,
                      subcomment_state: this.$store.state.subcomment_state,
                      selected_comment: this.$store.state.selected_comment,
                      subcomments: this.$store.state.subcomments,
                      subcomments_parent_id: this.$store.state.subcomment_parent_id};
    this.$store.commit('update_history',current_states);
    this.$store.commit('change_subcomment_state_to_true');
    this.$store.commit('update_subcomment_parent_id',this.$store.state.selected_comment._id);
    console.log(this.$store.state.subcomment_state);
    this.$store.commit('select_comment',comment);
    console.log(this.$store.state.selected_comment);


    axios.get('http://localhost:5000/subcomments',{
      params: {
        comment_id: this.$store.state.selected_comment._id
      }
    }).then((response) => {
        this.$store.state.subcomments = response.data
      })
  },



  username_click_parent(){
    this.$store.commit('flip_blur');
    this.$store.commit("select_username",this.$store.state.selected_comment.user_name);
    this.$store.commit("show_userdetails",true);
  },


  username_click_reply(username){
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


  open_editor(parent_id){
    this.parent_id = parent_id;
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
        Swal.fire({
                    type: 'error',
                    title: "Oops..",
                    text: "Something went wrong. Please try again !",
                    focusConfirm: false,
                    showConfirmButton: false,
                    timer: 1200
                  });
      }
      else{

        axios.get('http://localhost:5000/subcomments',{
          params: {
            comment_id: this.$store.state.selected_comment._id
          }
        }).then((response) => {
          Swal.fire({
                      type: 'success',
                      title: "Comment Created",
                      focusConfirm: false,
                      showConfirmButton: false,
                      timer: 1200
                    });
            this.$store.state.subcomments = response.data;
            this.$store.commit('editor',false);
            this.$store.commit('flip_blur');
          })
      }
    })
  },

  delete_comment(parent_id,comment_id,pos){

    console.log(parent_id)
    console.log(comment_id)

    axios.get('http://localhost:5000/delete_comments',{
      params: {
        parent_id: parent_id,
        comment_id: comment_id
      }
    }).then((response) => {

        var message = response.data;
        if (message == "success")
        {
          axios.get('http://localhost:5000/subcomments',{
            params: {
              comment_id: this.$store.state.selected_comment._id
            }
          }).then((response) => {
            Swal.fire({
                        type: 'success',
                        title: "Comment Deleted",
                        focusConfirm: false,
                        showConfirmButton: false,
                        timer: 1200
                      });
              this.$store.state.subcomments = response.data
              if (pos=='parent')
              {
                this.$store.state.selected_comment.removed=1;
              }
            })
        }
        else Swal.fire({
                    type: 'error',
                    title: "Oops..",
                    text: "Something went wrong. Please try again !",
                    focusConfirm: false,
                    showConfirmButton: false,
                    timer: 1200
                  });
      })
  },

}
}
</script>


<style scoped>

.app {
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
