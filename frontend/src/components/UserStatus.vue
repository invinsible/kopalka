<template>
  <div>
    <p>Ваше умение собирателя трав: 1</p>
    <p>Ваш опыт собирателя трав: 0</p>
    <div v-if="status">
      <p>Вы собираете травы. Ещё собирать {{ timerCountSec }}</p>
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :aria-valuenow="timerCountSec"
          aria-valuemin="0"
          aria-valuemax="30"
          :style="progressStyle"
        ></div>
      </div>
    </div>
    <p v-if="result">Вы собрали {{ result }} в количестве 1 шт.</p>    
  </div>
</template>

<script>
export default {
  name: 'UserStatus',
  props: {
    status: {
      type: Boolean,
      default: false,
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
  },
  watch: {
    timerCountSec: {
      handler(value) {
        if (value > 0 ) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
        if (value === 0) {
          this.isWork = false;
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },  
  methods: {

  },
};
</script>
