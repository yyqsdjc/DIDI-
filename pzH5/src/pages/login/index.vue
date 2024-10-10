<template>
  <div class="login">
    <img src="/images/logo.png" alt="DIDI陪诊">
    <h3>DIDI陪诊</h3>
    <van-form @submit="onSubmit" class="form">
      <van-cell-group inset>
        <van-field
          v-model="form.userName"
          left-icon="contact"
          size="large"
          clearable="true"
          name="用户名"
          placeholder="请填写用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.passWord"
          left-icon="lock"
          size="large"
          clearable="true"
          type="password"
          name="密码"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="login-btn">
        <van-button 
          round 
          block 
          size="large"
          native-type="submit" 
          color="linear-gradient(to right, #E2F5F9, #97CDC3)"
        >
          登录
        </van-button>
      </div>
    </van-form>
    
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

// 获取当前vue实例
// getCurrentInstance的proxy属性可以获取到当前vue实例
const { proxy } = getCurrentInstance();
// 表单数据
const form = reactive({
  userName: '',
  passWord: ''
})
// 路由实例
const router = useRouter();
// 表单提交
const onSubmit = async () => {
  const { data } = await proxy.$api.login(form)
  localStorage.setItem('phone', form.userName)
  if (data.code === 10000) {
    localStorage.setItem('h5_token', data.data.token)
    localStorage.setItem('h5_userInfo', JSON.stringify(data.data.userInfo))
    router.push('/home')
  }
};
// const onSubmit = (values) => {
//   proxy.$api.login(form).then(res => {
//     if (res.code === 200) {
//       proxy.$toast.success('登录成功');
//       proxy.$store.commit('setToken', res.data.token);
//       proxy.$router.push('/home');
//     } else {
//       proxy.$toast.fail(res.msg);
//     }
//   })
// };

</script>

<style scoped>
.login {
  height: 100vh;
  width: 100%;
  background: url('/images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items:center;
}

img {
  display: block;
  width: 7rem;
  height: 7rem;
  margin-top: 5rem
}

h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #06966892;
}

.form {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-btn {
  margin-top: 4rem;
  margin-left: 0.5rem;
  width: 90%;
}
</style>