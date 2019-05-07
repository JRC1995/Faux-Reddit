<template>
  <div id="app">
    <Header />
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


export default {
  name:"app",
  components: {
    Header,
    Posts,
    Comments,
    Subcomments,
    Categories,
    Description
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



</style>
