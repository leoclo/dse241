<template>
    <div :class="modal_wrapper">
      <div class="ft-modal ft-bg-white e-p-1" :style="modal_width">
        <div class="ft-modal-header">
          <span @click="close_modal" class="ft-close-modal ft-close ft-hover-text">
            ×
          </span>
          <span class="ft-modal-title ft-text-secondary" style="font-weight: bold">
            <slot name="header"></slot>
          </span>
        </div>
        <div class="ft-modal-body">
          <slot></slot>
        </div>
        <div v-if="has_footer" class="ft-d-flex ft-align-items-center ft-justify-content-center ft-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    export default {
      name: "ft-modal",
      props: {
        modal_super:{default:false},
        modal_disp_ref: { default: "" },
        width: { default: "80%" },
        has_cancel: { default: true },
        has_footer: { default: true }
      },
      computed: {
        modal_width() {
          return 'width:' + this.width;
        },
        modal_wrapper() {
          if(this.modal_super){
            return 'ft-modal-wrapper-super';
          }
          return 'ft-modal-wrapper'
        }
      },
      methods: {
        close_modal() {
          this.$emit("close", this.modal_disp_ref);
        },
      }
    };
  </script>
  
  <style lang="scss">

    @media only screen and (max-width: 600px) {
      .ft-modal {
        width:99% !important;
      }
      .ft-modal-body {
        display:flex;
      }
      .ft-modal-wrapper{
        max-width:100%;
      }
    }
    .ft-close-modal {
        padding-right: 7px;
    }

    .ft-modal-wrapper {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 975;
      background-color: rgba(10, 10, 10, .6);
    }
    .ft-modal-wrapper-super {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1055;
      background-color: rgba(10,10,10,.6);
    }
    .ft-modal {
      margin: 30px auto;
      border-radius: 15px;
    }
    .ft-modal-body {
      padding: 7px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .ft-modal-footer {
      padding: 15px;
      text-align: right;
      border-top: 1px solid #e5e5e5;
    }
    .ft-modal-header {
      padding: 7px;
      padding-bottom: 12px;
      padding-top: 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    .ft-modal-header i {
      margin-right: 1rem;
    }

    .ft-modal-title {
        margin-left: 7px;
        margin-bottom: 0;
        line-height: 1.5;
    }

  </style>