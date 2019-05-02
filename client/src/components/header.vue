<template>
  <div class="header_outside">
    <header class="header">
      <div class ="header_inside">
           E-Dialectics
      </div>
    </header>
    <div class="header_gap"></div>
  </div>
</template>

<script>
export default {
  name: "Header"
}
</script>


<style scoped>

@font-face {
  font-family: "DancingScript";
  src: url("../../public/fonts/DancingScript-Bold.ttf") format("truetype");
}

.header_outside {
  display: block;

}
.header {
    -webkit-box-shadow: 0 8px 6px -6px #999;
    -moz-box-shadow: 0 8px 6px -6px #999;
    box-shadow: 0 8px 6px -6px #999;
    width: 100%;
    position: fixed;
    display: inline-block;
    background-color:  #3676e8;
    z-index: 1000;
    margin-top: -9px;
    margin-left: -8px;
    margin-right: -8px;
}

.header_gap {
    width: 100%;
    height: 65px;
}

.header_inside {
    padding-top: 1%;
    padding-bottom: 1%;
    padding-left: .5%;
    font-size: 200%;
    width:15%;
    color: white;
    font-family: "DancingScript";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

</style>
