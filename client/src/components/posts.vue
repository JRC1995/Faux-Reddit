<template>
  <div class="app">

    <button class="button_style" style="margin-bottom:7px;" v-if="this.$store.state.logged_in==true" v-on:click="open_editor">New Post</button>

    <div class="outer_form" v-if="this.$store.state.editor==true">
      <div class="editor">
        <form>
        <select v-model="subcategory_id" class="styled-select" id="subcategory_select">
        <option value="" disabled selected>Choose subcategory</option>
        <option v-for="subcategory in this.subcategories" :value="subcategory.subforum_id">
          {{subcategory.name}}
        </option>
        </select>
        <textarea class="title" id="title" style="margin-bottom: 10px; width: 594px;" v-model="title" placeholder="Enter title of the post here."></textarea> <br>
        <ckeditor :editor="editor" v-model="body" :config="editorConfig"></ckeditor>
        <button class="button_style" style="margin-top:10px;" v-on:click="create_post">Create</button>
        </form>
      </div>
    </div>

    <div style="min-height: 500px">

    <table style="width:100%">
      <div v-bind:key="thread.thread_id" v-for="thread in this.$store.state.threads[this.$store.state.page]">
        <tr>
          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote" v-on:click="voting(thread.thread_id, 1)"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{format_score(thread.score)}}</b><br>
              <button class="vote" v-on:click="voting(thread.thread_id, -1)"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>
          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <button class="thread_link" v-on:click="show_comments(thread)"><b><span v-html="thread.title"></span></b></button><br>
              <div class="thread_details">
                by <button class="username_link" v-on:click="username_click(thread.user_name)">{{thread.user_name}}</button> on {{totime(thread.created_utc)}}
              </div>
            </div>
          </td>
        </tr>
      </div>
    </table>

  </div>

    <div class="outer_form">
      <button class="button_style" style="margin-top: 20px; margin-right: 10px;margin-left:-40px" v-on:click="prev">Prev</button>
      <span style="margin-top: 10px">Page {{this.$store.state.page}} of {{this.$store.state.pages}}</span>
      <button class="button_style" style="margin-top: 20px; margin-left: 10px;" v-on:click="next">Next</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default {
  name: "Posts",
  components: {

  },


data(){
  return{

     editor: ClassicEditor,
     title: '',
     body: '',
     editorConfig: {
       // The configuration of the editor.
       placeholder: "Enter the body of post here."
     },
     subcategories: [],
     subcategory_id: "",

  }

},
mounted () {

axios.get('http://localhost:5000/frontpage_threads',{
  params: {
    param: {}
  }
}).then((response) => {
    var threads = response.data
    var item_no = 6

    //format threads
    //test
    var pages = Math.ceil(threads.length/item_no)

    this.$store.commit('update_pages',pages)

    var page_dict = {}

    for (var page=1;page<=pages;page++){
      var page_threads = []
      for (var i=(page-1)*item_no;i<((page-1)*item_no)+item_no;i++){
        if (i< threads.length)
        {
          page_threads.push(threads[i])
        }
      }
      page_dict[page] = page_threads

    }

    this.$store.commit("update_threads",page_dict)
  })

  axios.get('http://localhost:5000/all_subcategories').then((response) => {
      this.subcategories = response.data
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
    console.log("ASBWAD");
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
  voting(thread_id, sentiment){
    //if backend sentiment is equal to new sentiment, set sentiment to 0
    //w
    console.log(this.$store.state.username, thread_id, sentiment);
  }, 
  open_editor(){
    this.subcategory_id = "";
    this.body = "";
    this.title = "";
    this.$store.commit('editor',true);
    this.$store.commit('flip_blur');
  },

  prev()
  {
    if (this.$store.state.page != 1){
      this.$store.commit('decrement_page');
    }
  },

  next()
  {
    if (this.$store.state.page!= this.$store.state.pages){
      this.$store.commit('increment_page');
    }
  },

  create_post(){

    if (this.subcategory_id == ""){
      document.getElementById('subcategory_select').setCustomValidity("You must choose a sucbategory");
    }

    else if (this.title==""){
      document.getElementById('title').setCustomValidity("You must enter a title");
    }

    else {

      var body = this.body.substring(3,this.body.length-4)

      axios.get('http://localhost:5000/create_post',{
        params: {
             subforum_id: this.subcategory_id,
             body: body,
             title: this.title,
             user_id: this.$store.state.user_id
        }
      }).then((response) => {

        console.log("response: ")
        console.log(response)

        var param={}
        var i

        for (i in this.$store.state.list_sub_id){
          param[this.$store.state.list_sub_id[i]] = this.$store.state.list_sub_id[i]
        }

        console.log(param)

        axios.get('http://localhost:5000/frontpage_threads',{
          params: {
            param: param
          }}).then((response) => {

            var threads = response.data
            var item_no = 6

            //format threads
            var pages = Math.ceil(threads.length/item_no)

            this.$store.commit('update_pages',pages)

            var page_dict = {}

            for (var page=1;page<=pages;page++){

              var page_threads = []

              for (var i=(page-1)*item_no;i<((page-1)*item_no)+item_no;i++){

                if (i< threads.length)
                {
                  page_threads.push(threads[i])
                }
              }
              page_dict[page] = page_threads

            }

            this.$store.commit("update_threads",page_dict)
            this.$store.commit('editor',false);
            this.$store.commit('flip_blur');
          })
        })

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

.title{
  margin-bottom: 10px;
  width: 594px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  font-size: 15px;
}

.styled-select {
   height: 29px;
   overflow: hidden;
   width: 150px;
   -webkit-border-radius: 15px;
   -moz-border-radius: 15px;
   border-radius: 15px;
   color: black;
   background-color: white;
   margin-bottom: 10px;
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   color: #2c3e50;
}


/*table, th, td {
  border: 1px solid black;
}*/

</style>
