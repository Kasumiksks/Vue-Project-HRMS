<template>
  <div>
    <h3>这是一个子组件</h3>
    <p>这个是a的值{{ a }}</p>
    <p>这是个b的值{{ b }}</p>

    <button @click="hClick">这是点击事件</button>
  </div>
</template>

<script>
export default {
  props: {
    a: {
      type: Number,
      required: true
    },
    b: {
      type: Number,
      required: true
    }

  },
  methods: {
    hClick() {
      this.$emit('update:a', 'a')
      this.$emit('update:b', 'b')
    }
  }
}
</script>

<style>

</style>
