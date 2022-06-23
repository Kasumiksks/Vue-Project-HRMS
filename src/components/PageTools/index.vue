<template>
  <div class="page-tools">
    <!-- 左侧 -->
    <div class="left">
      <div class="tips">
        <i class="el-icon-info" />
        <span>
          <slot name="left" />
        </span>
      </div>
    </div>
    <div class="right">
      <!-- 右侧 -->
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255,.5);
    background: rgba(251, 200, 223,.3);
    i {
      margin-right: 10px;
      color: #fbc8df;
    }
  }
}
</style>
