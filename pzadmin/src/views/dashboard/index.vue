<script setup>
import { ref, reactive, onMounted} from 'vue'
import PanelHead from '../../components/panelHead.vue'
import { useRoute} from 'vue-router'
import { report } from '../../api'

const route = useRoute()

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
const avatar = userInfo.avatar
const tableData = reactive({
  user: {},
  types: [],
  typeList: []
})

const getData = () => {
  report().then(({data}) => {
    const { user, types, typeList} = data.data
    tableData.user = user
    tableData.types = types
    tableData.typeList = typeList
    console.log('tableData', tableData);
  })
}


onMounted(() => {
  getData()
})

</script>

<template>
  <!-- 控制台 -->
  <PanelHead :route="route"></PanelHead>
  <div class="header">
    <div class="left">
      <div class="left-top">
        <el-image style="width: 100px; height: 100px" :src="tableData.user.user_img" fit="fill" />
      </div>
      <el-divider />
      <div class="left-bottom" v-if="tableData.user">
        <div>当前用户：{{ tableData.user.user_name }}</div>
        <div>当前权限：{{ tableData.user.permission}}</div>
        <div>登录的ip：{{ tableData.user.ip }} </div>
      </div>
    </div>
    <div class="right">
      <!-- 待支付 -->
      <div class="dzf">
        <div class="dzf-img" style="background-color: #409eff; width: 100px; height: 100px; padding: 5px;">
          <el-image style="width: 100px; height: 100px" src="./dzf.png" fit="fill" />
        </div>
        <div class="dzf-text">
          <div>待支付0</div>
        </div>
      </div>
      <!-- 已完成 -->
      <div class="ywc">
        <div class="ywc-img" style="background-color: #409eff; width: 100px; height: 100px; padding: 5px;">
          <el-image style="width: 100px; height: 100px" src="./ywc.png" fit="fill" />
        </div>
        <div class="ywc-text">
          <div>已完成0</div>
        </div>
      </div>
      <!-- 待服务 -->
      <div class="dfw">
        <div class="dfw-img" style="background-color: #409eff; width: 100px; height: 100px; padding: 5px;">
          <el-image style="width: 100px; height: 100px" src="./dfw.png" fit="fill" />
        </div>
        <div class="dfw-text">
          <div>待服务0</div>
        </div>
      </div>
      <!-- 已取消 -->
      <div class="yqx">
        <div class="yqx-img" style="background-color: #409eff; width: 100px; height: 100px; padding: 5px;">
          <el-image style="width: 100px; height: 100px" src="./yqx.png" fit="fill" />
        </div>
        <div class="yqx-text">
          <div>已取消0</div>
        </div>
      </div>
    </div>
  </div>
  <div class="content">

  </div>
</template>

<style lang="less" scoped>
.header {
  height: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  .left {
    min-width: 400px;
    height: 100%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    background-color: #ffffff;
    margin-right: 10px;
  }
  .right {
    min-width: 400px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    margin-left: 10px;
    background-color: #ffffff;
    .dzf,
    .dfw {
      margin-bottom: 10px;
    }
  }

  
}
</style>