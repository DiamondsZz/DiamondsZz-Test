<template>
  <div class="menu">
    <a-menu
      theme="dark"
      mode="inline"
      v-model="menuCurrent"
      :openKeys.sync="openKeys"
    >
      <template v-for="item in menus">
        <a-sub-menu v-if="item.children" :key="item.key">
          <span class="menu-item" slot="title">
            <img
              class="menu-icon"
              :src="require(`@/assets/images/${item.icon}.png`)"
              alt=""
            />
            <span>{{ item.name }}</span></span
          >
          <a-menu-item
            class="menu-item"
            v-for="child in item.children"
            :key="child.key"
            @click="menuSwitch(child.path)"
          >
            <img
              class="menu-icon"
              :src="require(`@/assets/images/${child.icon}.png`)"
              alt=""
            />
            <span>{{ child.name }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          class="menu-item"
          v-else
          :key="item.key"
          @click="menuSwitch(item.path)"
        >
          <img
            class="menu-icon"
            :src="require(`@/assets/images/${item.icon}.png`)"
            alt=""
          />
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 菜单
      menus: [
        {
          name: "设备管理",
          key: "device",
          icon: "device",
          path: "/device",
          children: [
            {
              name: "设备列表",
              key: "deviceList",
              icon: "device",
              path: "/device/list",
            },
            {
              name: "分组列表",
              key: "deviceGroup",
              icon: "device",
              path: "/device/group",
            },
          ],
        },
        {
          name: "群管理",
          key: "group",
          icon: "group",
          path: "/group",
          children: [
            {
              name: "群列表",
              key: "groupList",
              icon: "group",
              path: "/group/list",
            },
            {
              name: "群内用户列表",
              key: "groupUserList",
              icon: "group",
              path: "/group/userList",
            },
            {
              name: "群内成员变动列表",
              key: "groupMemberList",
              icon: "group",
              path: "/group/memberList",
            },
            {
              name: "分组列表",
              key: "groupDivide",
              icon: "group",
              path: "/group/divide",
            },
          ],
        },
        {
          name: "财务中心",
          key: "finance",
          icon: "device",
          path: "/finance",
        },
        {
          name: "云发单配置",
          key: "cloudOrderSet",
          icon: "device",
          path: "/cloudOrderSet",
        },
        {
          name: "系统设置",
          key: "systemSet",
          icon: "system",
          path: "/systemSet",
        },
        {
          name: "黑名单",
          key: "black",
          icon: "black",
          path: "/black",
        },
        {
          name: "发群消息/朋友圈",
          key: "send",
          icon: "send",
          path: "/send",
        },
      ],
      // 当前菜单选项
      menuCurrent: [this.$route.meta.type],
      // 当前含子菜单的菜单选项
      openKeys: this.$route.meta.parent ? [this.$route.meta.parent] : [],
    };
  },
  computed: {},
  methods: {
    // 菜单切换
    menuSwitch(key) {
      this.$router.push({
        path: key,
      });
    },
  },
  watch: {
    // 监听路由改变
    $route() {
      this.menuCurrent = [this.$route.meta.type];
      this.openKeys = this.$route.meta.parent ? [this.$route.meta.parent] : [];
    },
  },
};
</script>

<style lang="less" scoped>
.menu {
  /deep/ .ant-menu-inline-collapsed{
    .menu-item{
      span{
        opacity: 0;
      }
    }
  }
}
.menu-item {
  display: flex;
  align-items: center;
  .menu-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
}
</style>
