<template>
  <!-- user页面 -->
  <div class="container">
    <div class="user" >
      <van-image class="img" width="4.5rem" height="4.5rem" :src="userInfo.avatar" />
      <div class="name">{{ userInfo.name }}</div>
      <div class="phone">手机号 : {{ phone }}</div>
    </div>
    <div class="order">
      <div class="top">
        <div class="text1">我的订单</div>
        <div class="text2" @click="goOrder('')">全部</div>
      </div>
      <div class="bottom">
        <div @click="goOrder(1)" class="item">
          <van-image width="40" height="40" src="/images/od_10.png"/>
          <div>待支付</div>          
        </div>
        <div @click="goOrder(2)" class="item">
          <van-image width="40" height="40" src="/images/od_20.png"/>
          <div>待服务</div>            
        </div>
        <div @click="goOrder(3)" class="item">
          <van-image width="40" height="40" src="/images/od_30.png"/>
          <div>已完成</div>            
        </div>
        <div @click="goOrder(4)" class="item">
          <van-image width="40" height="40" src="/images/od_40.png"/>
          <div>已取消</div>            
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="foot1">
        <div class="text1">
          <van-image  width="1.5rem" height="1.5rem" src="/images/ic_clients.png" />
          <div class="text3">服务对象管理</div>
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
      <div class="foot2">
        <div class="text1">
          <van-image  width="1.5rem" height="1.5rem" src="/images/ic_share.png" />
          <div class="text3">分享转发</div>
        </div>
        <div class="text2"><van-icon name="arrow" /></div>
      </div>
    </div>
    <van-button class="quit" type="danger" size="large" @click="show = true">退出登录</van-button>
    <van-dialog 
      title="提示"
      v-model:show="show"
      @cancel="show = false"
      @confirm="logout()"
      show-cancel-button
    >
      <div class="quit_text">确定要退出登录吗？</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { useRouter } from 'vue-router'

// 使用computed获取userInfo, userInfo是响应式的,并且会随着localStorage的变化而变化
const userInfo = computed(() => {
  return JSON.parse(localStorage.getItem('h5_userInfo')) || {}
})
const phone = computed(() => {
  return localStorage.getItem('phone') || ''
})

const router = useRouter()
const goOrder = (state) => {
  // console.log('state', state);
  router.push(`/order?state=${state}`)
}

// 退出登录
const show = ref(false)
const logout = () => {
  localStorage.removeItem('h5_userInfo')
  localStorage.removeItem('h5_token')
  localStorage.removeItem('phone')
  router.push('/login')
}


</script>

<style lang="less" scoped>
.container {
  background-color: #f6fdff;
  height: 100vh;
  overflow: hidden;
  .user {
    width: 100%;
    height: 200px;
    background-image: linear-gradient(to left, #f1fef0 0%, #f1fefd 50%);
    margin-bottom: 0;
    .img {
      position: relative;
      margin-top: 4rem;
      margin-left: 1.8rem;
    }
    .name {
      position: absolute;
      top: 4.42rem;
      left: 7.5rem;
      display: inline-block;
      font-size: 1.63rem;
    }
    .phone {
      position: absolute;
      top: 6.9rem;
      left: 7.5rem;
      display: inline-block;
      font-size: 1rem;
      color: #7e7d7d;
    }
  }
  .order {
    width: 90%;
    margin: 0.6rem;
    margin-top: 0;
    border-radius: 0.4rem;
    background-color: #fff;
    padding: 0.6rem;
    .top {
      margin: 0 1.4rem 0.7rem 1.4rem;
      line-height: 2rem;
      display: flex;
      justify-content: space-between;
      .text1 {
        color: #333;
      }
      .text2 {
        color: #999;
      }
      border-bottom: 0.5px solid #f5f5f5;
    }
    .bottom {
      display: flex;
      justify-content: space-around;
      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .foot {
    margin: 0 0.6rem;
    padding: 0.6rem 1.7rem;
    border-radius: 0.4rem;
    line-height: 2.6rem;
    background-color: #fff;
    .foot1,
    .foot2 {
      display: flex;
      position: relative;
      justify-content: space-between;
      color: #555;
      .text1 {
        .van-image{
          position: absolute;
          top: 0.5rem;
        }
        .text3 {
          display: inline-block;
          position: absolute;
          left: 2rem;
        }
      }
    }
    .foot1 {
      border-bottom: 0.1rem solid #f5f5f5;
    }
  }
  .quit {
    width: 90%;
    margin: 20px;
  }
  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>