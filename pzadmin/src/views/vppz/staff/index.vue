<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Plus, Check, InfoFilled, Delete } from '@element-plus/icons-vue'
import { useRoute} from 'vue-router'
import { photoList, companion, companionList, deleteCompanion } from '../../../api'

const route = useRoute()

onMounted(() => {
  photoList().then(({data}) => {
    fileList.value = data.data
  })
  getListData()
})

const dialogFormVisable = ref(false)
const beforeClose = () => {
  dialogFormVisable.value = false
  // 表单重置
  formRef.value.resetFields()
}

const formRef = ref()
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 25,
  avatar: '',
  name: '',
  sex: ''
})

const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像'}],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]  
})

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({data}) =>{
        if (data.code === 10000){
          ElMessage.success("成功")
          beforeClose()
          getListData()
        } else {
          ElMessage.error(data.message)
        }
      })
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}

const open = (rowData = {}) => { 
  // console.log(rowData)
  dialogFormVisable.value = true
  // 弹窗打开form生成是异步的
  nextTick(() => {
    //编辑
    if (rowData) {
      // 为什么不能直接赋值，form = rowData
      // 因为form是reactive的，响应式的，直接赋值会失去响应式
      // 所以需要使用Object.assign Object.assign会拷贝对象，并且保持响应式
      Object.assign(form, rowData)
    }
  })
  
}

// 选择头像弹窗
const dialogImgVisable = ref(false)
const fileList = ref([])
const selectIndex = ref(0)
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url
  dialogImgVisable.value = false
}

// 分页
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

// 表单数据
const tableData = reactive({
  total: 0,
  list: []
})

// 请求列表数据
const getListData = () => {
  companionList(paginationData).then(({data}) => {
    const {list, total} = data.data
    tableData.list = list
    tableData.total = total
  })
}

const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}

const handleCurrentChange = () => {
  paginationData.pageNum = val
  getListData()
}

const selectTableData = ref([])
const handleSelectionChange = (val)=> {
  selectTableData.value = val.map(item => ({id: item.id}))
}

// 删除
const confirmEvent = () => {
  // 判断是否有选择数据
  if(!selectTableData.value.length) {
    return ElMessage.warning('请至少选择一项')
  } 
  deleteCompanion({id: selectTableData.value}).then(({data}) => {
    if (data.code === 10000) {
      ElMessage.success("删除成功")
      getListData()
    } else {
      ElMessage.error(data.message)
    }
  })
}

const cancelEvent = () => {
  clicked = false
  ElMessage({
    type: 'info',
    message: '取消删除',
  })
}

</script>

<template>
  <!-- 陪护管理 -->
  <PanelHead :route="route"></PanelHead>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)">新增
    </el-button>
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除？"
      @confirm="confirmEvent"
      @cancel="cancelEvent"
    >
      <template #reference>
        <el-button type="danger" :icon="Delete">删除</el-button>
      </template>
      <template #actions="{ confirm, cancel }">
        <el-button size="small" @click="cancel">No!</el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="!clicked"
          @click="confirm"
        >
          Yes?
        </el-button>
      </template>
    </el-popconfirm>    
  </div>

  <el-table :data="tableData.list" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image
          :src="scope.row.avatar"
          style="width: 100px; height: 100px"
        />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === "1" ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">  <!-- scope 是当前的数据 -->
        <el-tag :type="scope.row.active ? 'success' : 'danger'" >{{ scope.row.active ? '正常' : '失效'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" >
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
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
    title="陪护师添加"
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
        <el-input v-model="form.id" placeholder="请填写权限ID" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisable = true">点击上传</el-button>
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="15" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog 
    v-model="dialogImgVisable" 
    :before-close="beforeClose" 
    title="选择图片"
    width="680"
  >
    <div class="image-list">
      <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
        <div v-if="selectIndex === index" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image
          style="width: 148px; height: 148px"
          :src="item.url"
        />       
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogImgVisable = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
display: flex;
align-items: center;
flex-wrap: wrap;
.img-box {
  position: relative;
  .select {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 24px;
    height: 24px;
    background-color: #67c23a;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.el-image {
  margin-right: 10px;
  margin-bottom: 10px;
}
}
</style>