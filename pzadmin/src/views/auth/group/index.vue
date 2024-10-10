<script setup>
import { ref, reactive, onMounted, nextTick} from 'vue'
import { userGetMenu, userSetMenu, menuList } from '../../../api'
import { id } from 'element-plus/es/locale/index.mjs';
import PanelHead from '../../../components/panelHead.vue';
import { Plus } from '@element-plus/icons-vue'
import { useRoute} from 'vue-router'

const route = useRoute()

onMounted(() => {
  // 菜单权限的数据
  userGetMenu().then(({data}) => {
    // console.log(data)
    permissionsData.value = data.data
  })
  getListData()
})

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 打开弹窗
// 如果是新增 rowData为空
// 如果是编辑 传入rowData
const open = (rowData = {}) => { 
  dialogFormVisable.value = true
  // 弹窗打开form生成是异步的
  nextTick(() => {
    //编辑
    if (rowData) {
      // 为什么不能直接赋值，form = rowData
      // 因为form是reactive的，响应式的，直接赋值会失去响应式
      // 所以需要使用Object.assign Object.assign会拷贝对象，并且保持响应式
      Object.assign(form, { id:rowData.id, name: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}

const handleCurrentChange = () => {
  paginationData.pageNum = val
  getListData()
}

// 请求列表数据
const getListData = () => {
  menuList(paginationData).then(({data}) => {
    const {list, total} = data.data
    tableData.list = list
    tableData.total = total
  })
}

const formRef = ref()

// form数据
const form = reactive({
  id: '',
  name: '',
  permissions: ''
})

// 树形菜单权限数据
const permissionsData = ref([])

// 弹窗的显示与隐藏
const dialogFormVisable = ref(false)

// 关闭弹窗前的回调
const beforeClose = () => {
  dialogFormVisable.value = false
  // 清空表单
  formRef.value.resetFields()
  // tree清空选择
  treeRef.value.setCheckedKeys(defaultKeys)
}

// 默认选中的权限
const defaultKeys = [4,5]
const treeRef = ref()

const rules = reactive({
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur'}]
})

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获取选中的权限
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({
        name: form.name,
        permissions,
        id: form.id,
      }).then(({data}) => {
        // console.log(data)

      })
      // 关闭弹窗，清空表单
      beforeClose()
      // 页面刷新
      getListData()      
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}
</script>

<template>
  <!-- 菜单管理 -->
  <!-- 全局组件注入 -->
  <PanelHead :route="route"></PanelHead>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)">新增
    </el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%;">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">  <!-- scope 是当前的数据 -->
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      size="small"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog 
    v-model="dialogFormVisable" 
    :before-close="beforeClose" 
    title="添加权限" 
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" label="ID" prop="id">
        <el-input v-model="form.id" placeholder="请填写权限ID"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称"/>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <!-- show-checkbox 节点是否可被选择  -->
        <!-- default-checked-keys 默认勾选的节点的key的数组 -->
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionsData"
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="defaultKeys"
          node-key="id"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="dialogFormVisable = false">取消</el-button> -->
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>