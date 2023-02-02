<template>
    <div class="ft-container ft-m-1 ft-p-1 ft-pb-4">
      <div class="ft-d-flex ft-justify-content-between ft-container-header ft-ml-2">
        <span class="ft-container-title">
          <slot name="title"></slot>
        </span>
        <span>
          <slot name="tools"></slot>
        </span>
      </div>
      <div class="ft-container-body ft-ml-2 ft-mt-2">
        <slot></slot>
      </div>
    </div>
</template>
  
<script>
    export default {
        name: 'ft-container'
    }
</script>
  
<style lang="scss">
    .ft-container {
        border: none !important;
        border-radius: 15px !important;
        box-shadow: 0px 0px 25px lightgray !important;
        background-color: #fff;
    }
  
    .ft-container-header {
        padding: 7px;
        border-bottom: 1px solid #e5e5e5;
    }

    .ft-container-body {
        min-height: 300px;
    }
    
    .ft-container-title label {
        font-weight: bold;
    }
</style>