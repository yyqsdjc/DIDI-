<script setup>
import { authAdmin, menuSelectlist, updateUser } from '../../../api'
import { reactive, onMounted, ref } from 'vue'
import PanelHead from '../../../components/panelHead.vue';
import dayjs from 'dayjs';
import { useRoute} from 'vue-router'

const route = useRoute()

// 分页
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

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 请求列表数据
const getListData = () => {
  // 账号管理列表
  authAdmin(paginationData).then(({data}) => {
    // console.log('authAdmin', data)
    const { list, total } = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    });
    tableData.list = list
    tableData.total = total
  })
}

onMounted(() => {
  // 请求列表数据
  getListData()
  // 菜单权限下拉
  menuSelectlist().then(({data}) => {
    options.value = data.data
  })
})
const options = ref([]) // 所属组别
// 根据权限 id 匹配权限名称
const permissionName = (id) => {
  const data = options.value.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}

// 弹窗
const dialogFormVisable = ref(false)
const beforeClose = () => {
  dialogFormVisable.value = false
}

// 编辑表单
const form = reactive({
  name: '',
  permissions_id: '',
  mobile: ''
})

const formRef = ref() // 表单实例(因为要在ref中用，所有先定义formRef)

// 校验规则
const rules = reactive({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id: [
    { required: true, message: '请选择菜单权限', trigger: 'change' },
  ],
})

// 确定按钮
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form
      // 发送请求
      updateUser({ name, permissions_id }).then(({data}) => {
        if (data.code === 10000) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          dialogFormVisable.value = false
          getListData()
        } else {
          ElMessage({
            message: '修改失败',
            type: 'error',
          })
        }
      })
    } else {
      // console.log('error submit!', fields)
      return false
    }
  })

}

const open = (rowData) => {
  dialogFormVisable.value = true
  // 给编辑表单内的数据(form)赋值
  // 为什么不能直接赋值，form = rowData
  // 因为form是reactive的，响应式的，直接赋值会失去响应式
  // 所以需要使用Object.assign Object.assign会拷贝对象，并且保持响应式
  Object.assign(form, { name: rowData.name, permissions_id: rowData.permissions_id, mobile: rowData.mobile })
}
</script>

<template>
  <!-- 账号管理 -->
  <PanelHead :route="route"></PanelHead>
  <el-table :data="tableData.list" style="width: 100%;">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">  <!-- scope 是当前的数据 -->
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">  <!-- scope 是当前的数据 -->
        <el-tag :type="scope.row.active ? 'success' : 'danger'" >{{ scope.row.active ? '正常' : '失效'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" >
      <template #default="scope">  <!-- scope 是当前的数据 -->
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
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
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled/>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select 
          v-model="form.permissions_id"
          placeholder="请选择菜单权限" 
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key = "item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>