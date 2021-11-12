<template>
  <div>
    <p>Ваше умение собирателя трав: 1</p>
    <p>Ваш опыт собирателя трав: 0</p>    
    <div v-if="status">
      <p>Вы собираете травы. Ещё собирать {{ counterTransform }}</p>
      <!-- <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :aria-valuenow="timerCountSec"
          aria-valuemin="0"
          aria-valuemax="30"
          :style="progressStyle"
        ></div>
      </div> -->
    </div>
    <p v-if="result">Вы собрали {{ result }} в количестве 1 шт.</p>    
  </div>
</template>

<script>
export default {
  name: 'UserStatus',
  props: {
    status: {
      type: Object,
      default: null,
    },
    result: {
      type: String,
      default: '',
    },
    timerCount: {
      type: Number,
      default: 0,
    },
  }, 
  data() {
    return {
      timerCountSec: this.timerCount,
    };
  },
  computed: {   
    progressStyle() {
       return `width:${this.timerCountSec}%`;
     },
     counterTransform() {
      const min = Math.floor((this.timerCount / 1000 / 60) << 0);
      const sec = Math.floor((this.timerCount / 1000) % 60);
       return `${min} мин ${sec} сек`;
     },
  },  
  watch: {
    // timerCountSec: {
    //   handler(value) {
    //     if (value > 0 ) {
    //       setTimeout(() => {
    //         this.timerCount--;
    //       }, 1000);
    //     }
    //     if (value === 0) {
    //       this.isWork = false;
    //     }
    //   },
    //   immediate: true, 
    // },
  },

};
</script>
