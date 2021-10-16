<template>
  <div class="login-container">
  <!-- 导航栏 -->
  <van-nav-bar
    class="app-nav-bar"
      title="登录 / 注册"
      left-arrow
    />
    <!-- /导航栏 -->
    <!-- 登录表单 -->
     <van-form ref="loginForm">
      <!-- 手机号输入框 -->
      <van-field
        name='mobile'
        v-model="user.mobile"
        left-icon="phone-o"
        label="手机号"
        placeholder="请输入手机号"
        required
        :rules="userFormRules.mobile"
      />


      <!-- 验证码输入框 -->
      <van-field
        name='code'
        v-model="user.code"
        left-icon="passed"
        label="验证码"
        placeholder="请输入验证码"
        required
        :rules="userFormRules.code"
      >
        <template #button>
         <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button 
          class="send-btn" 
          size="mini" 
          round
          :loading="isSendSmsLoading"
          @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button 
        round 
        block 
        class="login-btn" 
        type="info" 
        @click="onLogin"
        >登录</van-button>
      </div>
    </van-form>
     <!-- /登录表单 -->
  </div>
</template>

<script>
import { login , sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      // 表单数据
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },

      // 表单验证规则
      userFormRules:{
        // 手机号验证规则
        mobile:[
          { required: true, message: '手机号是必填项' },
          { pattern: /^1[0-9]{10}$/, message: '手机号格式不正确'}
          ],
          // 验证码验证规则
        code:[
          { required: true, message: '验证码是必填项' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确'}
          ]
        },

        // 倒计时的显示隐藏
        isCountDownShow: false,
        // 按钮的loading状态
        isSendSmsLoading: false
      } 
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 登录代码
    async onLogin () {
      /**
       * 登录功能 具体实现步骤：
       * 1、给表单绑定提交的事件
       * 2、点击登录按钮，用正则表达式进行表单验证
       * 
       * 注意：使用try{} catch(err){} try里面一般是 接口请求的代码，catch里是 如果报错里就执行的代码
       * 
       * 3、获取到表单数据，同时提交表单数据（向服务器发起带参数的post请求）
       * 4、根据请求的响应结果，判断是否登录成功，然后进行后续的操作
       * 5、登录成功，提示用户，再把token存储到 Vuex容器里
       * 6、使用路由跳转到 layout组件页面
       */
      this.$toast.loading({
        duration: 0,// 持续时间，0表示持续展示不停止
        message: '加载中...',// 是否禁止背景点击
        forbidClick: true,// 提示消息
      })
      try {
        // 1、拿到表单数据作为参数，向服务器发起 post请求
        const res = await login(this.user)
        // 2、登录成功提示用户
        //console.log('登录成功', res)
        this.$toast.success('登录成功')
        // 3、把token存储到 Vuex容器中
        
        this.$store.commit('setUser', res.data.data)

        // 4、使用路由跳转 layout组件页面

        this.$router.push(this.$route.query.redirect || '/')
      } catch (error) {
        // 5、登录失败，提示用户错在哪里
        if(error.response.status === 400){
          //console.log('登录失败', err)
          this.$toast.fail('登录失败,手机号或验证码错误')
        }else{
          this.$toast.fail('服务器可能出现问题了，请稍后重试')
        }
      }
    },

    // 发送验证码的功能代码
    async onSendSms(){
      /**
       * 发送验证码功能 具体实现步骤：
       * 1、注册点击发送验证码事件
       * 2、校验手机号
       * 3、验证通过，显示倒计时，发送带参数的get请求
       * 4、验证失败，关闭倒计时，提示用户错在哪里
       */
      // 1、校验手机号
      try {   
        await this.$refs.loginForm.validate('mobile') 
      } catch (err){
        return console.log('验证失败', err)
      }
      
      // 2、验证通过，显示倒计时
      this.isCountDownShow = true
      
      // 3、发送带参数的get请求获取验证码，注意参数是手机号
      try {
        this.isSendSmsLoading =true
         await sendSms(this.user.mobile)
         this.$$toast('发送成功')
      } catch(err){
         this.isSendSmsLoading = false
      // 4、发送失败，关闭倒计时，提示用户错在哪里
      this.isCountDownShow = false
      if(err.response.status === 429){
        this.$toast('请求频繁，请稍后重试')
      } else {
        this.$toast('服务器异常，请联系客服')
      }
      }
    }
  } 
}
</script>

<style scoped lang="less">
/**
 * 局部样式
 */
 .login-container{
   .send-btn{
     width: 176px;
     height: 53px;
     background-color: #ededed;
     .van-button__text{
       font-size: 11px;
       color: #666666;
     }
   }
   .login-btn-wrap{
     padding: 26px 16px;
     .login-btn{
       background-color: #6db4fb;
        border: none;
      .van-button__text {
        font-size: 15px;
      }
     }
   }
 }
</style>
