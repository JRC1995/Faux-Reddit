<template>
  <div class="app">
    <div v-if="this.description!=null">
      <div class="title"> <b>Category: {{this.description[0].category_name}}</b> </div> <hr>
      {{this.description[0].category_description}} <br>
      <div class="title"> <b>Subcategory: {{this.description[0].subforum_name}}</b> </div> <hr>
      {{this.description[0].subforum_description}} <br>
      <button class="suscribe" v-on:click="subscribe()">Suscribe</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Description",

data(){
  return{

     description:null,

  }

},
mounted () {
axios.get('http://localhost:5000/description',{params:{thread_id:this.$store.state.selected_thread.thread_id}})
  .then(response => (this.description = response.data))
},

methods: {
  subscribe()
  {
    console.log(this.$store.state.username, this.$store.state.selected_thread.subforum_id)
  }
}

}



</script>


<style scoped>

.title{
  margin-top: 30px;
}

.suscribe{
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
  margin-top: 30px;
  font-size: 17px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: 37%;
}

.suscribe:hover {
  background-color:  #6496EE;
}

.app{
  display: inline-block;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  float: right;
  width: 28%;
  padding-bottom:3%;
  text-overflow: ellipsis;
  padding-left: 30px;
  padding-top: 0%;
  margin-top: -10px;
  position: fixed;
  right: 0px;
}


hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0;
}

</style>
