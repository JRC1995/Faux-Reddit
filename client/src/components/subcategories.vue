<template>
  <div class="subapp">
      <div v-bind:key="subcategory.subforum_id" v-for="subcategory in subcategories">
        <label class="container"> {{subcategory.name}}
          <input type="checkbox" v-on:change="filter($event, subcategory.subforum_id)" :name="subcategory.name" :value="subcategory.name">
          <span class="checkmark"></span>
        </label>
      </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: "Subcategories",
  props: ["category_id"],
  components: {
  },


data(){
  return{

     subcategories:null

  }

},
mounted () {
  axios.get('http://localhost:5000/subcategories',{
    params: {
      category_id: this.category_id
    }
  }).then(response => (this.subcategories = response.data))
},

methods: {
  filter(event,subforum_id){
    this.$store.commit('add_subforum_id',{event: event, subforum_id: subforum_id})
    console.log(this.$store.state.list_sub_id)
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
        this.$store.commit("update_threads",response.data)
      })
  }
}

}
</script>


<style scoped>

.subapp{
  float:left;
  display: inline-block;
  margin-bottom: 17px;
}

/* Adapted From: https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */

/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 0px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: #eee;
  border-radius: 4px;
  transition: all 0.4s;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #3676e8;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 5.5px;
  top: 2px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}




</style>
