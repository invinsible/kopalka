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
    <p v-if="workResult && !status">{{ resultMessage }}</p>    
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'UserStatus',
  props: {
    status: {
      type: Object,
      default: null,
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
    ...mapGetters([
      'workResult',
    ]),
    progressStyle() {
       return `width:${this.timerCountSec}%`;
     },
     counterTransform() {
      const min = Math.floor((this.timerCount / 1000 / 60) << 0);
      const sec = Math.floor((this.timerCount / 1000) % 60);
       return `${min} мин ${sec} сек`;
     },
     resultMessage() {
       return this.workResult.itemName ? `Вы собрали ${this.workResult.itemName} в количестве ${this.workResult.quantity} шт.` : 'Трава оказалась пожухлой';
       
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
