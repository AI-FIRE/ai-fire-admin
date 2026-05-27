<template>
  <div class="product">
    <div style="display: flex; justify-content: space-between">
      <a-form :model="state" layout="inline" autocomplete="off">
        <a-form-item label="产品名称">
          <a-input v-model:value="state.name" style="width: 300px"> </a-input>
        </a-form-item>

        <a-form-item label="状态">
          <a-select v-model:value="state.status" :options="state.statusOptions" style="width: 150px"></a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="getList">查询</a-button>
        </a-form-item>
      </a-form>
      <a-button class="create" type="primary" @click="createProduct">创建产品</a-button>
    </div>
    <Table
      :data-source="dataSource"
      :columns="columns"
      ref="table"
      @edit="edit"
      style="margin-top: 10px"
    >
      <template #status="{ record }">
        <a-tag :color="record.status === 30 ? 'green' : 'red'">
          {{ record.status === 30 ? '已发布' : '未发布' }}
        </a-tag>
      </template>
    </Table>

    <a-pagination
      @change="getList"
      v-model:current="state.pageNum"
      :total="state.total"
      show-less-items
      style="margin-top: 10px"
    />
  </div>
</template>

<script setup lang="ts" name="Product">
import Table from '@/components/table.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '@/apis/product'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()
const dataSource = ref<any[]>([])

const state = reactive({
  name: '',
  status: 0,
  pageNum: 1,
  pageSize: 10,
  total: 0,
  statusOptions: [
    { label: '全部', value: 0 },
    { label: '已发布', value: 30 },
    { label: '未发布', value: 10 }
  ]
})

const deleteProduct = (record: any) => {
  Modal.confirm({
    title: '确认删除该产品吗？',
    content: '删除后将不可恢复。',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await api.deleteProduct({ id: record.id })
      message.success('删除成功')
      getList()
    }
  })
}
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '产品分类', dataIndex: 'tags', key: 'tags' },
  { title: '产品名称', dataIndex: 'name', key: 'name' },
  { title: '简介', dataIndex: 'intro', key: 'intro', width: '30%' },
  { title: '访问量', dataIndex: 'monthlyVisits', key: 'monthlyVisits' },
  { title: '评分', dataIndex: 'rating', key: 'rating' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    operationList: [
      {
        name: '删除',
        method: deleteProduct
      }
    ]
  }
]

const getList = async () => {
  const res = await api.getProductList({
    pageNum: state.pageNum,
    pageSize: state.pageSize,
    status: state.status,
    name: state.name
  })
  dataSource.value = res.data.list
  state.total = res.data.count
}

const createProduct = () => {
  router.push('/createProduct')
}

const edit = (record: any) => {
  router.push({
    path: '/editProduct',
    query: {
      id: record.id
    }
  })
}



onMounted(() => {
  getList()
})
</script>

<style scoped>
.product {
  padding: 20px;
  background: #fff;
}
</style>
