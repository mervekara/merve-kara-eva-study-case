<template>
  <div>
    <el-form @submit.prevent="login" label-position="top">
      <el-form-item label="Email">
        <el-input v-model="email" type="text"></el-input>
      </el-form-item>

      <el-form-item label="Password">
        <el-input v-model="password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

const email = ref('');
const password = ref('');

const store = useStore();
const router = useRouter();

const login = async () => {
  await store.dispatch('auth/login', {
    email: email.value,
    password: password.value,
  });

  // After successful login, fetch user information
  await store.dispatch('auth/fetchUserInformation', email.value);

  // Fetch chart information
  await store.dispatch('chart/fetchChartInformation');

  router.push('/chart');
};
</script>

<style scoped></style>
