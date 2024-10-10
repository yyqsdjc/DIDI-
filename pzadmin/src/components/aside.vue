<script setup>
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { useMenuStore } from "../store/menu"

const menuStore = useMenuStore();
const isCollapse = menuStore.isCollapse// 从 store 中获取菜单是否折叠的状态

const handleOpen = () => {};
const handleClose = () => {};
</script>

<template>
  <el-menu
    :style="{width: isCollapse ? '64px' : '230px'}"
    class="aside-container"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="menuStore.menuActive"
  >
    <p class="logo-lg">{{ isCollapse ? 'DIDI' : 'DIDI陪诊'}}</p>
    <TreeMenu :index="1" :menuData="menuStore.routerList" />
  </el-menu>
</template>

<style lang="less" scoped>
.aside-container {
  height: 100%;
}
.logo-lg {
  font-size: 20px;
  line-height: 50px;
  color: #1e2022;
  text-align: center;
  padding: 10px 0;
  height: 50px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

// .el-menu--collapse .el-menu-item span, 
// .el-menu--collapse .el-sub-menu__title span {
//   display: none;
// }
</style>
