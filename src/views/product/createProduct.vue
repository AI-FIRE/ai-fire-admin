<template>
  <a-form :model="formState" :label-col="{ span: 2 }" @finish="submit">
    <a-form-item label="产品名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item label="产品URL" name="url">
      <a-input v-model:value="formState.url" />
    </a-form-item>

    <a-form-item label="产品简介" name="intro">
      <a-textarea v-model:value="formState.intro" show-count :autosize="{ minRows: 3 }" />
    </a-form-item>

    <a-form-item label="产品Logo">
      <a-upload
        name="uploadfile"
        list-type="picture-card"
        :action="actionUrl"
        :show-upload-list="false"
        @change="handleLogoChange"
      >
        <img
          v-if="formState.logo"
          :src="formState.logo"
          alt="logo"
          style="width: 100px; height: 100px"
        />
        <div v-else>
          <plus-outlined></plus-outlined>
        </div>
      </a-upload>
    </a-form-item>

    <a-form-item label="产品封面">
      <a-upload
        name="uploadfile"
        list-type="picture-card"
        :action="actionUrl"
        :show-upload-list="false"
        @change="handleThumbnailChange"
      >
        <img
          v-if="formState.thumbnail"
          :src="formState.thumbnail"
          alt="cover"
          style="width: 100px; height: 100px"
        />
        <div v-else>
          <plus-outlined></plus-outlined>
        </div>
      </a-upload>
    </a-form-item>

    <!-- Stats -->
    <a-divider>统计信息</a-divider>
    <a-row :gutter="16">
      <a-col :span="6">
        <a-form-item label="评分">
          <a-input v-model:value="formState.rating" placeholder="e.g. 4.8" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="月访问量">
          <a-input v-model:value="formState.monthlyVisits" placeholder="e.g. 1.2M" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="平均时长">
          <a-input v-model:value="formState.avgDuration" placeholder="e.g. 00:05:20" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="跳出率">
          <a-input v-model:value="formState.bounceRate" placeholder="e.g. 40%" />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Content Tabs -->
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="description" tab="产品介绍">
        <v-md-editor v-model="formState.description" height="500px"></v-md-editor>
      </a-tab-pane>
      <a-tab-pane key="traffic" tab="网站流量">
        <v-md-editor v-model="formState.trafficInfo" height="500px"></v-md-editor>
      </a-tab-pane>
      <a-tab-pane key="opensource" tab="开源信息">
        <v-md-editor v-model="formState.openSourceInfo" height="500px"></v-md-editor>
      </a-tab-pane>
      <a-tab-pane key="alternatives" tab="替代品">
        <v-md-editor v-model="formState.alternativesInfo" height="500px"></v-md-editor>
      </a-tab-pane>
    </a-tabs>

    <a-form-item label="标签">
      <a-input v-model:value="formState.tags" placeholder="逗号隔开" />
    </a-form-item>
    <a-form-item label="是否置顶">
      <a-select
        v-model:value="formState.isTop"
        style="width: 100%"
        :options="[{ label: '是', value: 1 }, { label: '否', value: 0 }]"
      />
    </a-form-item>
    <a-form-item label="分类" :rules="[{ required: true, message: '请选择分类' }]" name="cateId">
      <a-select
        v-model:value="formState.cateId"
        style="width: 100%"
        :options="cateList"
        :fieldNames="{ label: 'name', value: 'id' }"
      />
    </a-form-item>

    <a-divider>筛选信息</a-divider>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item label="价格">
          <a-select
            v-model:value="formState.price"
            style="width: 100%"
            :options="[
              { label: '免费', value: '免费' },
              { label: '部分免费', value: '部分免费' },
              { label: '免费试用', value: '免费试用' },
              { label: '付费', value: '付费' }
            ]"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="地域">
          <a-select
            v-model:value="formState.region"
            style="width: 100%"
            :options="[
              { label: '国内', value: '国内' },
              { label: '海外', value: '海外' }
            ]"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="形式">
          <a-select
            v-model:value="formState.form"
            style="width: 100%"
            :options="[
              { label: '网页', value: '网页' },
              { label: '移动应用', value: '移动应用' },
              { label: '桌面软件', value: '桌面软件' },
              { label: 'API/SDK', value: 'API/SDK' },
              { label: '插件', value: '插件' },
              { label: '本地部署', value: '本地部署' },
              { label: '云服务', value: '云服务' },
              { label: '模型', value: '模型' },
              { label: '解决方案', value: '解决方案' },
              { label: '硬件', value: '硬件' }
            ]"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item :wrapper-col="{ offset: 2 }">
      <a-button type="primary" style="margin-right: 10px" html-type="submit">{{
        route.query.id ? '保存' : '创建'
      }}</a-button>
      <a-button @click="cancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts" name="createProduct">
import { onMounted, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import * as api from '@/apis'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import type { UploadChangeParam } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const cateList = ref([])
const activeTab = ref('description')
const actionUrl = import.meta.env.VITE_API_BASE_URL + 'admin/file/uploadImg'

const formState = ref({
  id: '',
  name: '',
  url: '',
  logo: '',
  intro: '',
  description: '',
  rating: '',
  monthlyVisits: '',
  avgDuration: '',
  pagesPerVisit: '',
  bounceRate: '',
  domainCreated: '',
  domainExpiry: '',
  lastUpdated: '',
  domainAge: '',
  trafficInfo: '',
  openSourceInfo: '',
  alternativesInfo: '',
  thumbnail: '',
  tags: '',
  isTop: 0,
  cateId: null,
  price: '',
  region: '',
  form: ''
})

const getDetail = async (id: string) => {
  const res = await api.getProductDetail({ id })
  formState.value = res.data
}

onMounted(() => {
  if (route.query.id) {
    getDetail(route.query.id as string)
  }
  getCateList()
})

const handleLogoChange = ({ file }: UploadChangeParam) => {
  if (file.response?.data?.filename) {
     formState.value.logo = import.meta.env.VITE_API_BASE_UPLOAD_IMG_URL + file.response.data.filename
  }
}

const handleThumbnailChange = ({ file }: UploadChangeParam) => {
  if (file.response?.data?.filename) {
     formState.value.thumbnail = import.meta.env.VITE_API_BASE_UPLOAD_IMG_URL + file.response.data.filename
  }
}

const submit = async () => {
  const req = { ...formState.value }
  
  if (route.query.id) {
    await api.updateProduct({ ...req, id: route.query.id })
  } else {
    await api.createProduct(req)
  }
  message.success('操作成功')
  cancel()
}

const cancel = () => {
  router.go(-1)
}

const getCateList = async () => {
  const res = await api.getProductCategoryList({ status: 1 })
  cateList.value = res.data.list
}
</script>

<style scoped>
:deep(.ant-input) {
  width: 100%;
}
</style>
