<template>
  <div id="app">
    <Header />
    <!--Login /-->
    <Posts v-if="this.$store.state.comment_state==false"/>
    <Comments v-else-if="this.$store.state.subcomment_state==false"/>
    <Subcomments v-else/>
    <Categories  v-if="this.$store.state.comment_state==false"/>
    <Description v-else />
  </div>
</template>

<script>
import Header from './components/header';
import Posts from './components/posts';
import Categories from './components/categories';
import Comments from './components/comments';
import Subcomments from './components/subcomments';
import Description from './components/description';
import Login from './components/login';


export default {
  name:"app",
  components: {
    Header,
    Posts,
    Comments,
    Subcomments,
    Categories,
    Description,
    Login
  },

}
</script>


<style>

@font-face {
  font-family: "DancingScript";
  src: url("../public/fonts/DancingScript-Bold.ttf") format("truetype");
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.ck-editor__editable_inline {
    min-height: 250px !important;
    font-size: 15px;
}



</style>
