// Loading from browser globals because embedding giant URLs inside my JS feels
// yucky for some reason... deal with it, nerds. Maybe one day we'll have import
// maps. Maybe.
const { Vue } = window;

const app = new Vue({
  el: "#app",
  computed: {
    damage() {
      return Number(this.inputDamage || 0);
    },

    accuracy() {
      return Number(this.inputAccuracy || 0);
    },

    minimumHits() {
      return Number(this.inputMinimumHits || 0);
    },

    maximumHits() {
      return Number(this.inputMaximumHits || 0);
    },

    cost() {
      return Number(this.inputCost || 0);
    },

    averageDamage() {
      return "";
    },

    averageEfficiency() {
      if (this.averageDamage && this.cost) {
        return this.averageDamage / this.cost;
      }
      return "";
    },

    minimumDamage() {
      return "";
    },

    minimumEfficiency() {
      if (this.minimumDamage && this.cost) {
        return this.minimumDamage / this.cost;
      }
      return "";
    },

    maximumDamage() {
      return "";
    },

    maximumEfficiency() {
      if (this.maximumDamage && this.cost) {
        return this.maximumDamage / this.cost;
      }
      return "";
    }
  },
  data: {
    css: {
      label: "db mt3 mb1",
      input: "db ba b--black-30 pa2 br1",
      thead: "",
      tbody: "",
      table: "ba b--black-30 br1 w-100 collapse mt3 bg-white",
      tr: "ba b--black-30 tl",
      td: "ba b--black-30 pa2 tr",
      th: "ba b--black-30 pa2 tl bg-moon-gray"
    },

    inputDamage: "",
    inputAccuracy: "",
    inputMinimumHits: "",
    inputMaximumHits: "",
    inputCost: ""
  }
});

console.log(app);
window.app = app;
