<template>
  <!-- -- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 -- -->
  <!-- -- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 -- -->
  <!-- -- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 -- -->
  <!-- -- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 ---- 频道的文章列表 -- -->

  <div class="article-list" ref="article-list">
    <van-pull-refresh
      :success-text="refreshSuccessText"
      :success-duration="1000"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
        <ArticleItem
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item/index.vue'

export default {
  name: 'ArticleList',

  components: {
    ArticleItem
  },

  props: {
    channel: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 是否加载失败
      refreshing: false,
      refreshSuccessText: '刷新成功'
    }
  },

  computed: {},

  watch: {},

  created () {},

  mounted () {},

  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      /*
        具体实现步骤：
        1. 调用接口 向服务器发起请求 获取频道的文章列表
        2. 在data里 定义 List 空数组，准备接收服务器返回的数据
***** 注意：服务器返回的数据results是一个数组，千万不能直接把results数组赋值给List数组，
*****       否则渲染就只有一条数据，也不能把results数组直接push到list数组里，那样的话list数组就是二维数组
        3. 将服务器返回的results数组用延展运算符拆分开，然后push合成到List数组里
        4. 将list数据渲染到页面
        5. 本次数据加载结束之后要把加载状态设置为结束
        6. 判断数据是否全部加载完成，加载完毕，设置加载状态结束，不再触发上拉加载更多了
        7. catch一下，开启错误提示，设置加载状态结束

        */
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
         

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        this.list.push(...results)
        console.log(data);
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (error) {
        this.error = true // 开启错误提示
        this.loading = false // 关闭loading效果
      }
    },

    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3. 关闭下拉刷新的 loading 状态
        this.refreshing = false

        // 4. 提示刷新成功
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (error) {
        //   如果失败就提示失败了
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow: auto;
}
</style>