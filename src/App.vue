<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted } from 'vue';

// Import the router instance
import { useRouter } from 'vue-router';

// Fetch the store and router instances
const store = useStore();
const router = useRouter();

onMounted(() => {
  if (store && !store.state.auth.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
