<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #001529">
      <div style="height: 100%; display: flex; flex-direction: column;">
        <div style="padding: 10px 0 10px 20px;">
          <img :src="logo" alt="" height="32" class="logo" />
          <span style="color: white; font-size: 18px; margin-left: 10px; font-weight: bold;">AI-NOUS</span>
        </div>
        <Menu />
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ router.currentRoute.value.meta.name }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div style="cursor: pointer" @click="out">退出登陆</div>
      </div>
      <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
      >
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from '@/router'
import logo from '@/assets/img/logo1.png'
import { useRoute } from 'vue-router'
import { logout } from '@/apis/user'
import Menu from './menu.vue'

export default defineComponent({
  components: {
    Menu
  },
  setup() {
    const route = useRoute()
    const out = async () => {
      await logout({})
      router.push('/login')
    }
    return {
      router,
      out, // 退出
      logo,
      selectedKeys: ref<string[]>([route.path]),
    }
  }
})
</script>
<style lang="less">
.ant-layout {
  overflow: scroll;
  height: 100%;

  .ant-layout-content {
    overflow: scroll;
    min-height: initial;
  }

  .logo {
    position: relative;
    left: 20px;
    margin: 10px auto;
  }
}

.ant-breadcrumb {
  font-size: 16px !important;
  color: #21293c !important;
  font-weight: 700 !important;
}
</style>
