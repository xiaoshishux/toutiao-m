<template>
<!-- 频道的文章列表 -->
    <div class="article-list">
        <van-pull-refresh 
            v-model="isRefreshLoading"
            :success-text="refreshSuccessText"
            :success-duration="1500" 
            @refresh="onRefresh"
        >
            <p>刷新次数: {{ count }}</p>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
     <!-- <van-cell
        v-for="(article, index) in articles"
        :key="index"
        :title="article.title"
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
import { getArticles } from "@/api/article"
import ArticleItem from "@/components/article-item.vue"
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
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的 loading 状态
      refreshSuccessText: '' // 下拉刷新成功的提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
      // 初始化或滚动到底部的时候会触发调用onLoad
     async onLoad () {
         /**
          * 具体实现步骤
          * 1、调用接口 向服务器发起请求 获取频道的文章列表
          * 2、在data里 定义 list空数组，准备接收服务器返回的数据
          * 注意：服务器返回的数据 results 是一个数组，千万不能直接把 results数组赋值给List数组，
          *         否则渲染就只有一条数据，也不能把results数组直接push到list数组里，那样的话list数组就是二位数组
          * 3、将服务器返回的results数组用延展运算符拆分开，然后push合成到List数组里
          * 4、将list数据渲染到页面
          * 5、本次加载结束之后要把加载状态设置为结束
          * 6、判断数据是否全部加载完成，加载完毕，设置加载状态结束，不再触发上拉加载更多了
          * 7、catch一下，开启错误提示，设置加载状态结束
          */
         // console.log('onLoad')
      // 1、请求获取数据
      const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 ID
          timestamp: this.timestamp || Date.now(),// 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
        //console.log(data)
      // 2、把数据放到 list数组中
      const { results } = data.data
      this.articles.push(...results)
        // 3. 设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
        this.loading = false

        //4、数据全部加载完成
        if(results.length){
            //更新获取下一页数据的页码
            this.timestamp = data.data.pre_timestamp
        } else {
            // 没有数据了，把加载状态设置结束，不再触发加载更多
            this.finished = true
        }
     }
  } ,
  async onRefresh(){
      // 1、请求数据
      const { data } = await getArticles({
          channel_id:this.channel.id,
          timestamp:Date.now(),
          with_top: 1
      })
      // 2、把数据放到数据列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)
      // 3. 关闭刷新的状态 loading
        this.isRefreshLoading = false

        this.refreshSuccessText = `更新了${results.length}条数据`
  }     
}
</script>

<style scoped lang="less">
.article-list{
    position: fixed;
    left: 0;
    right: 0;
    top: 90px;
    bottom: 50px;
    overflow-y: auto ;
}
</style>