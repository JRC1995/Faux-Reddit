<template>
  <div id="app">
    <Header />
    <Login />
    <Posts />
    <Categories />
  </div>
</template>

<script>
import Header from './components/header';
import Posts from './components/posts';
import Categories from './components/categories';
import Login from './components/login';

export default {
  name:"app",
  components: {
    Header,
    Login,
    Posts,
    Categories
  }
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
