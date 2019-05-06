import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    list_sub_id: [],
    threads: [],
    subcomments: [],
    comment_state: false,
    selected_thread: null,
    subcomment_state: false,
    selected_comment: null,
    history: [{comment_state: false,selected_thread: null,subcomment_state: false,selected_comment: null,subcomments: []}],
    blur: false,
    username: null,
    logged_in: false,
    moderator_status: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true},
    selected_username: null,
    userdetails_status: false,
    userdetails: null,

  },
  mutations: {

    add_subforum_id(state, payload){
      const event = payload.event
      const subforum_id = payload.subforum_id
      console.log(event)
      console.log(subforum_id)
      if (event.target.checked)
      {
          state.list_sub_id.push(subforum_id)
      }
      else
      {
          var new_list = []
          var i
          for (i in state.list_sub_id)
          {
            if (state.list_sub_id[i] != subforum_id)
            {
              new_list.push(state.list_sub_id[i])
            }
          }
          state.list_sub_id = new_list
      }

    },

    update_threads(state,data){
      console.log(data)
      state.threads = data
    },

    change_comment_state_to_true(state){
      state.comment_state = true
    },

    select_thread(state,thread){
      state.selected_thread = thread
    },

    select_comment(state,comment){
      state.selected_comment = comment
    },

    change_subcomment_state_to_true(state){
      state.subcomment_state = true
    },

    update_history(state,states){
      state.history.push(states)
    },

    update_subcomments(state,data){
      console.log(data)
      state.subcomments = data
    },

    back(state,states){
      if (state.history.length>1){
        states = state.history.pop();
        state.comment_state = states.comment_state;
        state.subcomment_state = states.subcomment_state;
        state.selected_comment = states.selected_comment;
        state.selected_thread = states.selected_thread;
        state.subcomments = states.subcomments;
      }
    },

    flip_blur(state){
      state.blur=!state.blur;
    },


    flip_logged_in(state){
      state.logged_in=!state.logged_in;
    },

    update_username(state,username){
      state.username = username
    },

    update_moderator_status(state, moderator_status){
      state.moderator_status = moderator_status
    },

    select_username(state,username){
      state.selected_username = username
    },

    show_userdetails(state,boolean){

      if (boolean == true){

        axios.get('http://localhost:5000/userdetails',{
          params: {
            username: state.selected_username
          }}).then((response) => {
           state.userdetails = response.data[0];
          })
      }
      state.userdetails_status = boolean;

    },



  },
  actions: {

  }
})
