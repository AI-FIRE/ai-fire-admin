<template>
  <div class="website-info">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="newsBrief" tab="快讯生成">
        <a-form layout="vertical">
          <a-form-item label="文章主题（可不填）">
            <a-input v-model:value="form.topic" placeholder="不填默认原标题" />
          </a-form-item>

          <a-form-item label="启用定时生成">
            <a-switch v-model:checked="form.enabled" />
          </a-form-item>

          <a-form-item label="定时类型">
            <a-radio-group v-model:value="form.scheduleType">
              <a-radio value="hourly">每小时</a-radio>
              <a-radio value="daily">每天固定时间</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item v-if="form.scheduleType === 'hourly'" label="每隔多少小时生成">
            <a-input-number v-model:value="form.hourlyInterval" :min="1" :max="24" />
          </a-form-item>

          <a-form-item v-if="form.scheduleType === 'daily'" label="每天生成时间（HH:MM）">
            <a-input v-model:value="form.dailyTime" placeholder="08:00" style="width: 160px" />
          </a-form-item>

          <div style="display: flex; gap: 10px">
            <a-button type="primary" :loading="saving" @click="saveConfig">保存配置</a-button>
            <a-button type="primary" :loading="generating" @click="generateNow">立刻生成</a-button>
            <a-button v-if="lastBlogId" @click="openLastBlog">查看最近生成</a-button>
          </div>
        </a-form>

        <a-divider />

        <a-descriptions bordered title="最近状态" :column="1">
          <a-descriptions-item label="最近执行时间">{{ lastRunTimeText }}</a-descriptions-item>
          <a-descriptions-item label="最近生成博客ID">{{ lastBlogId || '-' }}</a-descriptions-item>
          <a-descriptions-item label="最近错误">{{ lastError || '-' }}</a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts" name="ArticleGenerate">
import request from '@/utils/http'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeKey = ref('newsBrief')
const saving = ref(false)
const generating = ref(false)
const config = ref<any>({})

const form = reactive({
  enabled: false,
  scheduleType: 'daily',
  hourlyInterval: 1,
  dailyTime: '08:00',
  topic: ''
})

const lastRunTimeText = computed(() => {
  const t = config.value?.lastRunTime
  if (!t) return '-'
  const d = dayjs(t)
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(t)
})

const lastBlogId = computed(() => {
  const v = config.value?.lastBlogId
  if (!v) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
})

const lastError = computed(() => {
  const v = config.value?.lastError
  return v ? String(v) : ''
})

const loadConfig = async () => {
  const res = await request<any>({
    url: '/admin/newsBrief/getConfig',
    method: 'POST'
  })
  config.value = res.data || {}
  form.enabled = Number(config.value.enabled) === 1
  form.scheduleType = (config.value.scheduleType || 'daily') as string
  form.hourlyInterval = Number(config.value.hourlyInterval || 1)
  form.dailyTime = String(config.value.dailyTime || '08:00')
  form.topic = String(config.value.topic || '')
}

onMounted(() => {
  loadConfig()
})

const saveConfig = async () => {
  saving.value = true
  try {
    const data = new URLSearchParams()
    data.append('enabled', form.enabled ? '1' : '0')
    data.append('scheduleType', form.scheduleType)

    if (form.scheduleType === 'hourly') {
      data.append('hourlyInterval', String(form.hourlyInterval || 1))
    }
    if (form.scheduleType === 'daily' && String(form.dailyTime || '').trim()) {
      data.append('dailyTime', String(form.dailyTime).trim())
    }

    data.append('topic', String(form.topic || '').trim())

    await request<any>({
      url: '/admin/newsBrief/updateConfig',
      method: 'POST',
      data
    })
    message.success('保存成功')
    await loadConfig()
  } finally {
    saving.value = false
  }
}

const generateNow = async () => {
  generating.value = true
  try {
    const data = new URLSearchParams()
    if (String(form.topic || '').trim()) {
      data.append('topic', String(form.topic).trim())
    }
    await request<any>({
      url: '/admin/newsBrief/generateNow',
      method: 'POST',
      data
    })
    message.success('生成成功')
    await loadConfig()
  } finally {
    generating.value = false
  }
}

const openLastBlog = () => {
  if (!lastBlogId.value) return
  router.push({
    name: 'editBlog',
    query: {
      id: String(lastBlogId.value)
    }
  })
}
</script>

