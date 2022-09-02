<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-bth"
        icon="search"
        type="info"
        round
        size="small"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 频道的文章列表 -->
        <ArticleList :channel="item"></ArticleList>
        <!-- /频道的文章列表 -->
      </van-tab>
      <div slot="nav-right" class="wa"></div>
      <div slot="nav-right" @click="show = true" class="wap-nav-wrap">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
      get-container="body"
    >
      <ChannelEdit :user-channels="channels"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import { getItem } from "@/utils/storage";
import { mapState } from "vuex";
import ArticleList from "@/views/home/components/article-list.vue";
import ChannelEdit from "@/views/home/components/channel-edit.vue";
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [], //定义数据接收 用户的频道列表
      show: false //控制编辑频道的显示状态
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    // 获取用户频道列表
    /**
     * 具体实现步骤：
     * 1、只要请求服务器拿数据，就try一脚
     * 2、调用接口 发送请求 获取用户频道列表
     * 3、到打他中定义空数据，接收服务器返回的数据
     * 4、拿到数据去模板里 循环渲染出来
     * 5、catch 一下，如果服务器接口坏了，或者其他原因等等，报错了就提示用户获取失败
     * 注意：此方法不会被人为调用，需要到钩子函数里去调用此方法
     */
    async loadChannels() {
      try {
        let channelse = [];
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels();
          //console.log(data)
          channelse = data.data.channels;
        } else {
          //未登录
          const loadChannels = getItem("TOUTIAO__CHANNELS");
          if (loadChannels) {
            // 有本地频道数据，则使用
            channelse = loadChannels;
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels();
            channelse = data.data.channels;
          }
        }
        // 将数据更新到组件中
        this.channels = channelse;
      } catch (err) {
        console.log(err);
        this.$toast("数据获取失败");
      }
    }
  }
};
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-bth {
    width: 520px;
    height: 80px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 38px;
    }
    .van-button__text {
      font-size: 28px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background: #3296fa;
    }
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    height: 80px;
    line-height: 90px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-content: center;
    opacity: 0.9;
  }
  .van-icon {
    font-size: 100px;
  }
  .wa {
    width: 80px;
    flex-shrink: 0;
  }
}
</style>
