<template>
    <div class="my-container">
      <!-- 已登录界面 -->
      <van-cell-group  v-if ="user" class="my-info">
        <van-cell 
        class="base-info"
        center
        :border='false'
         >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <div class="name" slot="title">{{userInfo.name}}</div>
          <van-button 
            class="update-btn"
            size = "small"
            round
           >编辑资料</van-button>
         </van-cell>
         <van-grid class="data-info" :border="false">
            <van-grid-item class="data-info-item">
              <div slot="text" class="text-wrap">
                <span class="count">{{userInfo.art_count}}</span>
                <span class="text">头条</span>
              </div>
            </van-grid-item>
            <van-grid-item class="data-info-item">
              <div slot="text" class="text-wrap">
                <span class="count">{{userInfo.follow_count}}</span>
                <span class="text">关注</span>
              </div>
            </van-grid-item>
            <van-grid-item class="data-info-item">
              <div slot="text" class="text-wrap">
                <span class="count">{{userInfo.fans_count}}</span>
                <span class="text">粉丝</span>
              </div>
            </van-grid-item>
            <van-grid-item class="data-info-item">
              <div slot="text" class="text-wrap">
                <span class="count">{{userInfo.like_count}}</span>
                <span class="text">获赞</span>
              </div>
            </van-grid-item>
          </van-grid>
      </van-cell-group>

    <!-- 未登录界面 -->
    <div v-else class="not-login">
      <div @click="$router.push('./login')">
        <img class="mobile" src="./手机.png" >
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <!-- 宫格导航 -->
      <van-grid class="nav-grid mb-4" :column-num='2'>
        <van-grid-item 
          class="nav-grid-item"
          icon="star-o"
          text="收藏" 
         />
        <van-grid-item 
          class="nav-grid-item"
          icon="clock-o"
          text="历史" />
      </van-grid>
      <van-cell title = "消息通知" is-link to = "/"/>
      <van-cell class="mb-4" title = "小智同学" is-link to = "/"/>
      <van-cell 
        v-if = "user"
        class="logout-cell"
        title = "退出登录"
        @click="onLogout"/>
      </div>
</template>

<script>
import { mapState } from "vuex"
import { getUserInfo } from "@/api/user.js"
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo:{} // 用户个人资料数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadgetUser()
  },
  mounted () {},
  methods: {
    // async loadgetUser(){
    //   const {data} = await getUserInfo()
    //   this.userInfo = data.data
    //   console.log(data)
    // },
    /**
     * 具体实现步骤：
     * 1、先用 try 一脚，try里面写着可能会报错的代码，一般都是向服务器发请求
     * 2、调用 接口模块user.js里面的方法，向服务器发起请求，获取用户个人资料
     * 3、在data里面放一个空对象，用来接收从服务器响应回来的数据
     * 4、拿到服务器返回的数据之后，记得去页面渲染
     * 5、最后再 catch，报错了就会执行catch里的代码，报错就提示用户获取数据失败
     * 注意：在获取用户信息，这个方法不会被认为触发，所以我们需要它自动触发
     *      在钩子函数中，判断是否有token值，如果有的话，说明用户登录了，这个时候调用此方法
     */
    async loadgetUser(){
      try{
        const {data} = await getUserInfo()
        this.userInfo = data.data
        console.log(data)
      } catch(error){
        console.log(error)
        this.$toast('获取数据失败,请稍后重试')
      }
    },


    // 退出登录功能
    onLogout(){
      /**
       * 具体实现功能步骤
       * 1、弹出退出提示
       * 2、确认退出执行--------> 把容器的 user设置null 删除本地存储的token
       * 3、因为容器里的数据是动态的，当user里面没有数据了，使用了user的地方都会跟着改变
       *    例如：user有token时，说明用户登录了，那么 v-if=“user”的里的内容就生效了
       */
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog.confirm({
        title:"提出提示",
        message:'确认退出吗'
      })
      .then(()=>{// 确认执行这里
        this.$store.commit('setUser',null)
        this.$toast('已退出')
      })
      .catch(()=>{// 退出执行这里
        this.$toast('取消退出')
      })
    }
  }
}
</script>

<style scoped lang="less">
.my-container{
  .my-info{
    background: url("./banner.png") no-repeat;
    background-size: cover;
  }
  .base-info{
    box-sizing: border-box;
    height: 300px;
    background-color: unset;
    padding-top: 38px;
    padding-bottom: 11px;
    
    .avatar{
      box-sizing: border-box;
      width: 166px;
      height: 166px;
      border: 1px solid #fff;
      margin-right: 22px;
    }
    .name{
        font-size: 30px;
        color: #fff; 
      }
    .update-btn{
      height: 70px;
      font-size: 10px;
      color: #666666;
    }
  }
    .data-info{
      .data-info-item{
        height: 140px;
        color: #fff;
        .text-wrap{
          display:flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count{
            font-size: 36px;
          }
          .text{
            font-size: 22px;
          }
        }
      }
    } 
    /deep/ .van-grid-item__content {
      background-color: unset;//重置背景色
    }  
  }
  .not-login{
    height: 300px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 166px;
      height: 166px;
    }
    .text{
      font-size: 14px;
      color: #fff;
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
</style>
