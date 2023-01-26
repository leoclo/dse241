<template>
    <div>
      <ul class="ft-nav ft-nav-tabs ft-mb-2">
        <li v-for="tab in tabs" :key="tab.id" class="ft-nav-item" :class="{'active':tab.isActive}">
          <a @click="selectTab(tab)" class="ft-nav-link" >{{ tab.name }}</a>
        </li>
      </ul>
      <div>
        
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
      export default {
        name: "easie-top-tabs",
        data() {
          return { tabs: [] };
        },
        created() {
          this.tabs = this.$children;
        },
        methods: {
          selectTab(selectedTab) {
            this.tabs.forEach(tab => {
              tab.isActive = tab.name == selectedTab.name;
            });
          }
        }
      };
  </script>
  
  <style lang="scss">
    .ft-nav {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }
    
    .ft-nav-tabs {
        padding-left: 14px;
        position: relative;
        z-index: 1;
        border-bottom: 1px solid $light_border_color;
    }
  
    .ft-nav-item {
        margin-bottom: -1px;
        color: $secondary;
        border: 2px solid $light_border_color;
        margin-left: 8px;
        cursor: pointer;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
    }

    .ft-nav-item:focus, .ft-nav-item:hover, .ft-nav-item.active{
        color: $primary;
        border-color: rgba($primary, .4)
    }
    
    .ft-nav-link {
        display: block;
        padding: 0.5rem 1rem;
    }
    
  </style>
  