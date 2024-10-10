<script setup>
import { useMenuStore } from "../store/menu"
import { useRoute, useRouter} from 'vue-router';

// 拿到store的实例
const menuStore = useMenuStore()
// 拿到路由实例
const router = useRouter()
// 获取当前路由
const route = useRoute()
// 顶部展示的菜单
const selectMenu = menuStore.selectMenu

// 点击关闭tag
const closeTab = (item, index) => {
  menuStore.closeMenu(item)
  // 删除的是非当前页tag
  if (route.path !== item.path) {
    // console.log('删除的是非当前页tag', route.path);
    return
  }
  const selectMenuData = selectMenu.value
  // 删除的是最后一项
  if (index === selectMenuData.length) {
    // 如果tag只有一个元素
    if (!selectMenuData.length) {
      router.push('/')
    } else {
      // 路由跳转写法1
      router.push({
        path: selectMenuData[index - 1].path 
      })        
    } 
  } else { // 删除的是中间位置tag
      // 路由跳转写法2
    router.push(selectMenuData[index].path)
  }
}
const handleClick = (command) => {
  if (command === 'cancel') {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('pz_v3pz')
    window.location.href = window.location.origin
  }
}

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
</script>

<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <!-- <el-icon class="icon" size="25" @click="store.commit('collapseMenu')"> -->
      <el-icon class="icon" size="25" @click="menuStore.collapseMenu">
        <Fold />
      </el-icon>
      <ul class="flex-box">
        <li 
          v-for="(item, index) in selectMenu" 
          :key="item.path" 
          class="tab flex-box"
          :class="{ selected: route.path === item.path }">
          <el-icon size="12">
            <component :is="item.icon" />
          </el-icon>
          <router-link class="text flex-box" :to="item.path"> {{ item.name }} </router-link>
          <el-icon size="12" class="close" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <p class="user-name">{{userInfo.name}}</p>
          <el-avatar :src="userInfo.avatar" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fefefe;
  padding-left: 10px;
  padding-right: 20px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .tab {
      height: 100%;
      padding: 0 10px;

      .text {
        margin: 0 5px;
      }

      .close {
        visibility: hidden;
      }

      &.selected {
        background-color: #f5f5f5;
        a {
          color: #27a1ff;
        }
        i {
          color: #27a1ff;
        
        }
      }
    }

    .tab:hover {
      background-color: #f5f5f5;

      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }

  .header-right {
    .el-dropdown-link {
      .user-name {
        margin-right: 10px;
      }
    }
  }

  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>