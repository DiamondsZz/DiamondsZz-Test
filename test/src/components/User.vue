<template>
  <div class="actions">
    <a-dropdown>
      <div>
        <a-avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <span class="ml10">{{ userInfo.username || "ecoer" }}</span>
      </div>
      <a-menu slot="overlay">
        <!-- <a-menu-item>
          <a href="javascript:;" class="align-center" @click="modify">
            <a-icon type="edit" class="mr10" />修改密码
          </a>
        </a-menu-item> -->
        <a-menu-item>
          <a
            href="javascript:;"
            class="align-center"
            @click="handleClick({ key: 'logout' })"
          >
            <a-icon type="logout" class="mr10" />退出登录
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal
      :width="480"
      :visible="modifyVisible"
      title="修改密码"
      @ok="modifyConfirm"
      :centered="true"
      @cancel="modifyVisible = false"
    >
      <a-form :form="form" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <a-form-item label="旧密码">
          <a-input
            v-decorator="[
              'oldPassword',
              { rules: [{ required: true, message: '请输入旧密码' }] },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input
            v-decorator="[
              'newPassword',
              { rules: [{ required: true, message: '请输入新密码' }] },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input
            v-decorator="[
              'confirmPassword',
              {
                rules: [
                  { required: true, message: '请再次输入密码' },
                  { validator: confirmPassword },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { modifyPassword } from '@/api/auth'
export default {
  data () {
    return {
      modifyVisible: false,
      form: this.$form.createForm(this),
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState('user', ['username'])
  },
  methods: {
    ...mapActions('user', ['Logout']),
    // 请求成功
    requestSuccess (success) {
      this.$notification.success({
        message: '成功',
        description: (success || {}).msg || '处理完成',
        duration: 4
      })
    },
    // 请求失败
    requestFailed (err) {
      this.$notification.error({
        message: '错误',
        description: (err || {}).msg || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    handleClick ({ key }) {
      const self = this
      if (key === 'logout') {
        this.$confirm({
          title: '注销',
          content: '确定要注销当前登录吗？',
          okText: '注销',
          okType: 'danger',
          onOk () {
            self.Logout().then(() => {
              self.$router.replace('/login')
            })
          },
          onCancel () {
            self.$message.warning('取消操作')
          }
        })
      }
    },
    // 获取用户信息
    getUserInfo () {
      this.userInfo = { username: this.$store.state.user.username }
    },
    // 再次验证密码
    confirmPassword (rule, value, callback) {
      // 获取密码
      const password = this.form.getFieldValue('newPassword')
      if (value && value !== password) {
        callback('两次密码输入不一致！')
      } else {
        callback()
      }
    },
    // 修改密码
    modify () {
      this.modifyVisible = true
    },
    // 修改密码提交
    modifyConfirm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const { oldPassword, newPassword, confirmPassword } = values
          const params = {
            confirm: confirmPassword,
            oldPassword,
            password: newPassword
          }
          modifyPassword(params)
            .then((res) => {
              this.requestSuccess(res)
              // 退出
              this.Logout().then(() => {
                this.$router.replace('/login')
              })
            })
            .catch((res) => {
              this.requestFailed(res)
            })
            .finally(() => {})
        }
      })
    }
  },
  created () {
    // 获取用户信息
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.actions {
  cursor: pointer;
  /deep/ .ant-dropdown-trigger {
    padding: 0 14px;
  }
}
.actions:hover {
  background-color: #e6f7ff;
}
.ml10 {
  margin-left: 10px;
}
.mr10 {
  margin-right: 10px;
}
.align-center {
  text-align: center;
}
</style>
