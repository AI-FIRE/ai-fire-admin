<template>
  <a-menu
    id="menu"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    style="width: 100%"
    mode="inline"
    @click="handleClick"
    theme="dark"
  >
    <a-sub-menu key="sub1" @titleClick="titleClick">
      <template #icon>
        <MailOutlined />
      </template>
      <template #title>常规管理</template>
      <a-menu-item key="/dashboard">仪表盘</a-menu-item>
      <a-menu-item key="/blog">博客管理</a-menu-item>
      <a-menu-item key="/product">AI产品管理</a-menu-item>
      <a-menu-item key="/productCategory">工具分类管理</a-menu-item>
      <a-menu-item key="/category">分类管理</a-menu-item>
      <a-menu-item key="/link">友链管理</a-menu-item>
      <a-menu-item key="/special">专栏管理</a-menu-item>
      <a-menu-item key="/banner">轮播图管理</a-menu-item>
      <a-menu-item key="/notice">公告管理</a-menu-item>
      <a-menu-item key="/articleGenerate">文章生成</a-menu-item>

    </a-sub-menu>
    <a-sub-menu key="sub2" @titleClick="titleClick">
            <template #icon>
        <SettingOutlined />
      </template>
      <template #title>系统设置</template>
      <a-menu-item key="/websiteinfo">网站信息</a-menu-item>
      <a-menu-item key="/webmasterinfo">站长信息</a-menu-item>

    </a-sub-menu>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MailOutlined, QqOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
export default defineComponent({
  components: {
    MailOutlined,
    QqOutlined,
    AppstoreOutlined,
    SettingOutlined
  },
  setup() {
    const router = useRouter()
    const selectedKeys = ref<string[]>([router.currentRoute.value.path])
    const openKeys = ref<string[]>(['sub1', 'sub2'])
    const handleClick: MenuProps['onClick'] = (e) => {
      router.push(e.key as string)
    }
    const titleClick = (e: Event) => {
      console.log('titleClick', e)
    }
    watch(
      () => openKeys,
      (val) => {
        console.log('openKeys', val)
      }
    )
    return {
      selectedKeys,
      openKeys,

      handleClick,
      titleClick
    }
  }
})
</script>
