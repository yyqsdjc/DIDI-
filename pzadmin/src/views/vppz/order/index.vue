<script setup>
import { ref, reactive, onMounted } from 'vue'
import PanelHead from '../../../components/panelHead.vue';
import { useRoute} from 'vue-router'
import { adminOrder, updateOrder } from '../../../api';
import dayjs from 'dayjs';
import { InfoFilled, Delete } from '@element-plus/icons-vue'

const route = useRoute()

onMounted(() => {
  getListData()
})

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

// 搜索表单
const searchForm = reactive({
  out_trade_no: ''
})

// 查询
const onSubmit = () => {
  getListData(searchForm)
}

// 请求列表数据
const getListData = (parms = {}) => {
  adminOrder({...paginationData, ...parms}).then(({data}) => {
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

const statusMap = (key) => {
  const map = {
    '已取消': 'info',
    '待支付': 'warning',
    '已完成': 'success',
  }
  return map[key]
}

const confirmEvent = (id) => {
  updateOrder({id}).then(({data}) => {
    if(data.code === 10000) {
      getListData()
    }   
  })
}

</script>

<template>
  <!-- 订单管理 -->
  <PanelHead :route="route"></PanelHead>
  <!-- 搜索订单号框+查询按钮 -->
  <el-form :inline="true" :model="searchForm">
    <el-form-item prop="out_trade_no">
      <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="tableData.list">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院" width="120"></el-table-column>
    <el-table-column prop="service_name" label="陪诊服务" width="140"></el-table-column>
    <el-table-column label="陪护师头像" width="120" >
      <template #default="scope">
        <el-image :src="scope.row.companion.avatar" alt=""style="width: 50px; height: 50px" />
      </template>
    </el-table-column>
    <el-table-column prop="companion.mobile" label="陪护师手机号" width="140"></el-table-column>
    <el-table-column prop="price" label="总价" width="70"></el-table-column>
    <el-table-column prop="paidPrice" label="已付" width="70"></el-table-column>
    <el-table-column label="下单时间" width="120" >
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" >
      <template #default="scope">
        <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态" ></el-table-column>
    <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
    <el-table-column label="操作" width="110" fixed="right">
      <template #default="scope">
        <el-popconfirm
          v-if="scope.row.trade_state === '待服务'"
          confirm-button-text="是"
          cancel-button-text="否"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="是否确认完成？"
          @confirm="confirmEvent(scope.row.out_trade_no)"
        >
          <template #reference>
            <el-button type="primary" link>服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
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
</template>

<style lang="less" scoped>
form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>