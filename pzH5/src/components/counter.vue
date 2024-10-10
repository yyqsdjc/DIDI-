<template>
  {{ formater }}
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  // second: 倒计时的总秒数，默认为0
  second: {
    type: Number,
    default: 0,
  },
  // format: 倒计时的格式，默认为"MM-dd hh:mm"
  format: {
    type: String,
    default: "MM-dd hh:mm",
  },
  // sformat: 倒计时的秒格式，默认为"hh:mm:ss"
  sformat: {
    type: String,
    default: "hh:mm:ss",
  },
 // suffix: 倒计时后的后缀，默认为空字符串
  suffix: {
    type: String,
    default: "",
  },
});
// 定义emit
const emit = defineEmits(["counterOver"]);
// 倒计时显示
const formater = ref("");

// 在组件挂载时执行
onMounted(() => {
  // 将props中的second属性格式化为TIME_FORMAT格式，并赋值给formater
  // TIME_FORMAT 函数：初始化倒计时，并启动一个定时器每秒更新倒计时。
  formater.value = TIME_FORMAT(props.second);
});
// 倒计时逻辑处理
const TIME_FORMAT = (ts) => {
  let res;

  const showtime = () => {
    if (ts <= 0) {
      clearInterval(run);
      emit("counterOver");
      return TIME_SFORMAT(0, props.sformat, props.suffix);
    }
    res = TIME_SFORMAT(ts, props.sformat, props.suffix);
    return res;
  };
  const run = setInterval(() => {
    ts -= 1000;
    res = showtime();
    formater.value = res;
  }, 1000);
  return showtime();
};
// 格式化时间
const TIME_FORMIN = (param) => {
  if (param < 0) {
    param = 0;
  }
  if (param < 10) {
    param = "0" + param;
  }
  return param;
};

const TIME_SFORMAT = (ts, sfmt, suffix) => {
  const time = {
    "h+": TIME_FORMIN(Math.floor((ts / 1000 / 60 / 60) % 24)),
    "m+": TIME_FORMIN(Math.floor((ts / 1000 / 60) % 60)),
    "s+": TIME_FORMIN(Math.floor((ts / 1000) % 60)),
  };
  for (let k in time) {
    if (new RegExp("(" + k + ")").test(sfmt)) {
      sfmt = sfmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? time[k]
          : ("00" + time[k]).substr(("" + time[k]).length)
      );
    }
  }
  return sfmt + suffix;
};
</script>

<style></style>
