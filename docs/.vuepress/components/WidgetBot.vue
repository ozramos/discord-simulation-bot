<template>
  <div class="widget-bot-wrapper" ref="widget"></div>
</template>

<script>
export default {
  name: 'WidgetBot',

  mounted () {
    // inject the following code into a ref
    this.$refs.widget.innerHTML = `<widgetbot
      server="${SERVER_ID}"
      channel="${DEFAULT_CHANNEL_ID}"
      width="100%"
      height="500"
    ></widgetbot>`

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/html-embed'
    this.$refs.widget.appendChild(script)
    console.log(this.$refs.widget)
  }
}
</script>

<style scoped>
.widget-bot-wrapper {
  margin: 1em auto;
}
</style>