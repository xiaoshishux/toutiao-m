<template>
  <div class="artice">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详细"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <h1 class="title">{{ article.title }}</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
        slot="icon"
        class="avatar"
        round
        fit="cover"
        :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">
        {{ article.pubdate | relativeTime }}
      </div>
      <van-button
        :type="article.is_followed ? 'default' : 'info'"
        round
        :icon="article.is_followed ? '' : 'plus'"
        class="follow-btn"
        :loading="isFollowLoading"
        size="small"
        @click="onFollow"
      >
        {{ article.is_followed ? "已关注" : "关注" }}
      </van-button>
    </van-cell>
    <div
      class="markdown-body"
      v-html="article.content"
      ref="article-content"
    ></div>

    <!-- 底部区域 -->
    <div class="artcle-bottom">
      <van-button class="comment-btn" type="default" round>
        写评论
      </van-button>
      <van-icon name="comment-o " info="123" color="#777"></van-icon>
      <van-icon
        :color="article.is_collected ? 'yellow' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollected"
      ></van-icon>
      <van-icon
        :color="article.attitude === 1 ? 'red' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onlike"
      ></van-icon>
      <van-icon color="#7777777" name="share-o"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import "./github-markdown.css";
import {
  getArticleById,
  deleteCollect,
  addCollect,
  addLike,
  deleteLike
} from "@/api/article";
import { addFollow, deleteFollow } from "@/api/user";
import { ImagePreview } from "vant";

// ImagePreview({
//
//     "https://img01.yzcdn.cn/vant/apple-1.jpg",
//     "https://img01.yzcdn.cn/vant/apple-2.jpg"
//
// });

export default {
  name: "ArticeIndex",
  components: {},
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      article: {}, //文章数据对象
      isFollowLoading: false, //关注用户按钮的 loading
      isCollectedLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticl();
  },
  mounted() {},
  methods: {
    async loadArticl() {
      const { data } = await getArticleById(this.articleId);
      console.log(data);
      this.article = data.data;

      // 数据改变影响视图更新（DOM）不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，需要把这个代码放到 $nextTick中
      // this.$nextTick 是vue提供的一个方法
      this.$nextTick(() => {
        this.handlePerviewImage();
      });
    },
    handlePerviewImage() {
      //1.获取文章内容 Dom容器
      const articleContent = this.$refs["article-content"];
      // 2.得到所有的img标签
      const imags = articleContent.querySelectorAll("img");
      const imgPaths = [];
      // 3.循环img列表，给img注册点击事件
      imags.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onclick = function() {
          // 4.在事件处理函数中调用ImagePreview（）预览
          ImagePreview({
            images: imgPaths, //预览图片路径列表
            startPosition: index // 起始位置
          });
        };
      });
    },
    async onFollow() {
      this.isFollowLoading = true;
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(this.article.art_id);
      } else {
        // 没有关注，添加关注
        await addFollow(this.article.art_id);
      }
      this.article.is_followed = !this.article.is_followed;
      this.isFollowLoading = false;
    },
    async onCollected() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true //禁止背景点击
      });
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId);
      } else {
        // 没有收藏，添加收藏
        await addCollect(this.articleId);
      }
      this.article.is_collected = !this.article.is_collected;
      this.$toast.success(`${this.article.is_collected ? "" : "取消"}收藏成功`);
    },
    async onlike() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true //禁止背景点击
      });
      if (this.article.attitude === 1) {
        // 已收藏，取消收藏
        await deleteLike(this.articleId);
        this.article.attitude = -1;
      } else {
        // 没有收藏，添加收藏
        await addLike(this.articleId);
        this.article.attitude = 1;
      }
      this.$toast.success(
        `${this.article.attitude === 1 ? "" : "取消"}点赞成功`
      );
    }
  }
};
</script>

<style scoped lang="less">
.title {
  font-size: 40px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .avatar {
    width: 70px;
    height: 70px;
    margin-right: 17px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 200px;
    height: 80px;
  }
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
</style>
