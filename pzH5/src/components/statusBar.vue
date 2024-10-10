<template>
  <div>
    <van-steps :active="active">
      <van-step>填写订单</van-step>
      <van-step>在线支付</van-step>
      <van-step>专人服务</van-step>
      <van-step>服务完成</van-step>
    </van-steps>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';

const { item } = defineProps(["item"]);
// 进度
const active = ref(0);

// 根据item获取进度
const getStauts = () => {
  // console.log(item);
  if (item == 0) {
    active.value = 0;
  } else if (item == 1) {
    active.value = 1;
  } else if (item == 2) {
    active.value = 2;
  } else if (item == 3 || item == 4) {
    active.value = 3;
  }
}

onMounted(() => {
  getStauts();
})


</script>

<style scoped>

</style>