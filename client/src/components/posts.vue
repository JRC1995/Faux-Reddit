<template>
  <div class="app">
    <table style="width:100%">
      <div v-bind:key="thread.thread_id" v-for="thread in this.$store.state.threads">
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
                by <button class="username_link">{{thread.user_name}}</button> on {{totime(thread.created_utc)}}
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
}
}
</script>


<style scoped>

.app {
  display: inline-block;
  width: 68%;
}


.thread_link {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #3676e8;
  border: none;
  cursor: pointer;
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
  max-width: 10%;
  background-color:rgba(0, 0, 0, 0);

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
  -webkit-box-shadow: 0 8px 6px -6px #999;
  -moz-box-shadow: 0 8px 6px -6px #999;
  box-shadow: 0 8px 6px -6px #999;
  background-color: white;
  padding-top: 2%;
  padding-bottom: 2%;
  min-width: 100%;
  max-width: 100%;

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
  font-size: 20px;
  font-family: "DancingScript";
  text-align: center;
  margin-top: 7px;
  margin-bottom: 7px;
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
