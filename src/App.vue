<script setup>
import LandingPage from './views/LandingPage.vue'
import TheWelcome from './components/TheWelcome.vue'

import './assets/LandingPage.css' 
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup></script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}


/* style.css */
body {
  font-family: "Noto Sans JP", sans-serif;
  background-color: #f9f9f9;
  color: #222;
  margin: 0;
  padding: 0;
}

.header-nav {
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}

.header-nav a {
  margin: 0 40px;
  font-weight: bold;
  font-size: 1.3rem;
  text-decoration: none;
  color: #000;
}

.hero {
  text-align: center;
  padding: 40px 20px;
}

.hero h1 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.hero p {
  color: #555;
  margin-bottom: 30px;
}

.hero-image {
  width: 80%;
  height: 250px;
  background-color: #ddd;
  margin: 0 auto;
  background-position: center;
  background-size: cover;
  border-radius: 6px;
}

.search-section {
  padding: 30px 9%;
}

.search-section h2 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.brand-grid, .type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.brand-item {
  background-color: #eaeaea;
  border: 1px solid #ccc;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
}

.brand-item img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.brand-item p {
  margin-top: 5px;
  font-size: 0.9rem;
}

.type-grid div {
  background-color: #eaeaea;
  border: 1px solid #ccc;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
}

</style>