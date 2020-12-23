<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt="" />
    <span class="logo-til" v-if="!isCollapsed">社群宝</span>
  </div>
</template>

<script>
export default {
  props: ["collapsed"],
  data() {
    return {
      isCollapsed: false,
    };
  },
  watch: {
    collapsed: {
      handler(val) {
        this.isCollapsed = val;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #fff;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  background-color: #002140;
  img {
  }
  .logo-til {
    margin-left: 16px;
    flex-shrink: 0;
  }
}
</style>
