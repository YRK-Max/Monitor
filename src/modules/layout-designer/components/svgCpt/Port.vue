<template>
  <g>
    <rect :x="-(height/2)" :y="-(height/2)" :width="height" :height="height" :fill="color" stroke="#000000" :stroke-width="width" />
    <line fill="none" stroke="#000000" :stroke-width="width" :x1="-(height/2)" :x2="-(height/2) + (height)" :y1="-(height/2)" :y2="-(height/2) + (height)" />
    <line fill="none" stroke="#000000" :stroke-width="width" :x1="-(height/2) + (height)" :x2="-(height/2)" :y1="-(height/2)" :y2="-(height/2) + (height)" />
  </g>
</template>

<script>
export default {
  name: 'Port',
  // eslint-disable-next-line vue/require-prop-types
  props: ['height', 'color', 'width']
}
</script>

<style scoped>

</style>
