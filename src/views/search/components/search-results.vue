<template>
  <div class="search-results">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search";
export default {
  name: "SearchResults",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      //   1.请求获取数据
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText
      });

      console.log(data);
      //   2.将数据放到数据列表中
      const { results } = data.data;
      this.list.push(...results);
      //   3.关闭本次的 loading
      this.loading = false;
      //   4.判断是否还有数据，
      if (results.length) {
        // 如果有，则更新获取下一页数据的页码；
        this.page++;
      } else {
        // 如果没有，则把fineshed设置为 true，关闭加载更多
        this.finished = true;
      }
    }
  }
};
</script>

<style scoped lang="less">
.search-results {
  position: fixed;
  left: 0;
  right: 0;
  top: 100px;
  bottom: 0;
  overflow-y: auto;
}
</style>
