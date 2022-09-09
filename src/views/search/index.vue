<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        placeholder="请输入搜索关键词"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-results :search-text="searchText" v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史 -->
    <search-history
      v-else
      :search-histories="SearchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
    <!-- /搜索历史 -->
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchHistory from "./components/search-history.vue";
import SearchResults from "./components/search-results.vue";
import { setItem, getItem } from "@/utils/storage";

export default {
  name: "SearchPage",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResults
  },
  props: {},
  data() {
    return {
      searchText: "", //搜索框的内容
      isResultShow: false, //控制搜索结果显示状态
      SearchHistories: getItem("search-histories") || [] // 搜索历史数据
    };
  },
  computed: {},
  watch: {
    // 监听搜索历史记录的变化，储存到本地存储
    searchHistories() {
      setItem("search-histories", this.SearchHistories);
    }
  },
  created() {
    this.loadSearchHistories;
  },
  mounted() {},
  methods: {
    onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;
      const index = this.SearchHistories.indexOf(searchText);
      if (index !== -1) {
        // 去除重复项
        this.SearchHistories.splice(index, 1);
      }
      //记录搜索历史记录放到顶部
      this.SearchHistories.unshift(searchText);

      // 如果没有登录项，则把搜索历史记录储存到本地
      setItem("search-histories", this.SearchHistories);
      //展示搜索结果
      this.isResultShow = true;
    },
    async loadSearchHistories() {
      const searchHistories = getItem("search-histories") || [];
      this.searchHistories = searchHistories;
    }
  }
};
</script>

<style scoped lang="less"></style>
