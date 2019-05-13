<template>
  <div class="app">
    <div>
      <div style="overflow: auto;" v-bind:key="category.category_id" v-for="category in categories">
        <b>{{category.name}}</b>
        <hr>
        <Subcategories v-bind:category_id="category.category_id"/>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Subcategories from './subcategories';

export default {
  name: "Categories",
  components: {
    Subcategories
  },


data(){
  return{

     categories:null,

  }

},
mounted () {
axios.get('http://localhost:5000/categories')
  .then(response => (this.categories = response.data))
}

}

</script>


<style scoped>

.app{
  display: inline-block;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  float: right;
  width: 28%;
  padding-bottom:2%;
  overflow-y: scroll;
  overflow-x: hidden;
  text-overflow: ellipsis;
  padding-left: 30px;
  padding-right: 5px;
  padding-top: 0.9%;
  box-shadow: -8px 50% 8px -6px #999,8px 50% 8px -6px #999;
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
