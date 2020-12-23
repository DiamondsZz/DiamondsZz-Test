<template>
  <div>
    <a-modal
      class="modal"
      title="提示"
      :width="430"
      :centered="true"
      :visible="modalVisible"
      @cancel="cancel"
      :getContainer="() => mountModal(mountDom)"
    >
      <slot name="title"> </slot>
      <div class="modal-text" v-if="modalText">{{ modalText }}</div>
      <div slot="footer" class="modal-footer">
        <a-button class="modal-footer-btn" @click="cancel">取消</a-button>
        <a-button class="modal-footer-btn" @click="confirm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mountModal } from "@/utils/common";
export default {
  props: ["visible", "mountDom", "text"],
  data() {
    return {
      // 弹窗显示
      modalVisible: false,
      // 弹窗挂在Dom
      modalMountDom: null,
      // 弹窗文本
      modalText: "",
    };
  },
  methods: {
    mountModal,
    // 取消
    cancel() {
      this.$emit("cancel");
    },
    // 确认
    confirm() {
      this.$emit("confirm");
    },
  },
  watch: {
    // 弹窗显示
    visible: {
      handler(val) {
        this.modalVisible = val;
      },
      immediate: true,
    },
    // 弹窗文本
    text: {
      handler(val) {
        this.modalText = val;
      },
      immediate: true,
    },
    // 弹窗挂在Dom
    mountDom: {
      handler(val) {
        this.modalMountDom = val;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
//提示弹窗
.modal {
  /deep/ .ant-modal {
    border-radius: 24px;
    .ant-modal-content {
      border-radius: 24px;
      .ant-modal-header {
        border-radius: 24px 24px 0 0;
      }
      .ant-modal-body {
        padding: 40px 28px;
        .modal-text {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          text-align: center;
          line-height: 32px;
        }
      }
      .ant-modal-footer {
        padding: 32px 36px;
        .modal-footer {
          .modal-footer-btn {
            width: 125px;
            height: 34px;
            padding: 0;
            text-align: center;
            line-height: 34px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fff;
            border: none;
            &:nth-child(1) {
              background-color: #e6e6e6;
              margin-right: 36px;
            }
            &:nth-child(2) {
              background-color: #177dff;
            }
          }
        }
      }
    }
  }
}
</style>
