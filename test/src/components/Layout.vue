<template>
  <a-layout class="layout">
    <a-layout-sider
      class="layout-sider"
      v-model="collapsed"
      :trigger="null"
      collapsible
    >
      <Logo :collapsed="collapsed" />
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <div class="layout-header-left">
          <a-icon
            class="layout-header-trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <div class="layout-header-menu">
            <div class="layout-header-menu-item">
              <a-icon type="bell"></a-icon>
              <span class="layout-header-menu-item-text">系统公告</span>
            </div>
            <div class="layout-header-menu-item">
              <a-icon type="link"></a-icon>
              <span class="layout-header-menu-item-text">激活码管理</span>
            </div>
            <div class="layout-header-menu-item">
              <a-icon type="question-circle" />
              <span class="layout-header-menu-item-text">云发单教程</span>
            </div>
            <div class="layout-header-menu-item">
              <a-icon type="download" />
              <span class="layout-header-menu-item-text">联系我们</span>
            </div>
          </div>
        </div>
        <User />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import User from "@/components/User";
import Menu from "@/components/Menu";
import Logo from "@/components/Logo";
export default {
  data() {
    return {
      // 菜单收合
      collapsed: false,
    };
  },
  components: {
    Menu,
    Logo,
    User,
  },
};
</script>

<style lang="less" scoped>
.layout {
  .layout-sider {
    min-height: 100vh;
  }

  /deep/ .ant-layout {
    min-width: 768px;
    .layout-header {
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 0;
      .layout-header-left {
        display: flex;
        .layout-header-trigger {
          display: flex;
          align-items: center;
          font-size: 18px;
          padding: 0 24px;
          cursor: pointer;
          &:hover {
            color: #1890ff;
          }
        }
        .layout-header-menu {
          display: flex;
          opacity: 0;
          .layout-header-menu-item {
            margin-right: 40px;
            cursor: pointer;
            .layout-header-menu-item-text {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              margin-left: 4px;
            }
          }
        }
      }
    }

    .layout-content {
      margin: 16px;
      min-height: 280px;
      background-color: #f0f2f9;
    }
  }
}
</style>
