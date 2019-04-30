<template>
  <div id="app">
    <Header />
    <Posts />
  </div>
</template>

<script>
import Header from './components/layouts/header';
import Posts from './components/posts'
export default {
  name:"app",
  components: {
    Header,
    Posts
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
  background-color: white;
  min-width: 100%;
  max-width: 100%;
  transition: all 0.5s;
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
  background-color: white;
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
