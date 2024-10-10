<script setup>
import { useRouter } from "vue-router";
import { useMenuStore } from "../store/menu"

const props = defineProps(["menuData", "index"]);
// 创建 router 实例
const router = useRouter();
// 创建 store 实例
const menuStore = useMenuStore();

// 点击菜单
const handleClick = (item, active) => {
  // console.log('点击菜单', item);
  router.push(item.meta.path);
  menuStore.updateMenuActive(active);
  menuStore.addMenu(item.meta);
};
</script>
<template>
  <template v-for="item in props.menuData" :key="`${props.index}-${item.meta.id}`">
    <!-- 无子菜单 -->
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
    >
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>{{ item.meta.name }}</template>
    </el-menu-item>

    <!-- 有子菜单 -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- <template #title :name = "item.meta.name">{{ item.meta.name }}</template> -->
        <!-- <template >666</template> -->

        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 递归处理子菜单 -->
      <tree-menu :menuData="item.children" :index="`${props.index}-${item.meta.id}`" />
    </el-sub-menu>
  </template>
</template>

<style lang="less" scoped>
</style>