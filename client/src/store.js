import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    list_sub_id: [],
    threads: [],

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
    }

  },
  actions: {

  }
})
