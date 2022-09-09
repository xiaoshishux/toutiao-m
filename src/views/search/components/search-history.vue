<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <!-- prop 数据如果是引用类型（数组、对象）可以修改，但注意这个修改的是 user.name= ‘Jave’、arr.push(123)、arr.splice（0，1）
        但是任何 prop数据都不能重复赋值 xxx = xxx  如果你想让prop数据 = 新数据：让父组件自己修改-->
        <span @click="$emit('update-histories') || []">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete-o" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in SearchHistories"
      :key="index"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
        @click="onDelete(history, index)"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  components: {},
  props: {
    SearchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onDelete(history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.SearchHistories.splice(index, 1);
        setItem("search-histories", this.SearchHistories);
        return;
      }

      // 非删除状态，展示搜索结果
      this.$emit("search", history);
    }
  }
};
</script>

<style scoped lang="less"></style>
