<template>
  <div class="app">
    <table style="width:67%">
      <div v-bind:key="thread.thread_id" v-for="thread in threads">
        <tr>
          <td style="vertical-align: middle;">
            <div class="score_block" >
              <button class="vote"><img class="vote_image" src="../assets/like.png" height="20" width="20"></button>
              <br><b>{{thread.score}}</b><br>
              <button class="vote"><img  class="vote_image" src="../assets/dislike.png" height="20" width="20"></button>
            </div>
          </td>
          <td style="width:100%;vertical-align: middle;">
            <div class="thread_div">
              <button class="thread_link"><b>{{thread.title}}</b></button><br>
              <div class="thread_details">
                by <button class="username_link">{{thread.user_name}} </button>
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

export default {
  name: "Posts",
  components: {
    axios
  },


data(){
  return{

     threads:null

  }

},
mounted () {
axios.get('http://localhost:5000/frontpage_threads')
  .then(response => (this.threads = response.data))
}
}
</script>


<style scoped>

</style>
