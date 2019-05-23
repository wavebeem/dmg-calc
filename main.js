// Loading from browser globals because embedding giant URLs inside my JS feels
// yucky for some reason... deal with it, nerds. Maybe one day we'll have import
// maps. Maybe.
const { Vue } = window;

const app = new Vue({
  el: "#app",
  filters: {
    formatNumber(value) {
      if (!value) {
        return "–"; // ndash
      }
      return value.toFixed(3);
    }
  },
  computed: {
    damage() {
      return Number(this.inputDamage || 0);
    },

    accuracy() {
      return Number(this.inputAccuracy || 0) / 100;
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

    isFormComplete() {
      return (
        this.inputDamage &&
        this.inputAccuracy &&
        this.inputMinimumHits &&
        this.inputMaximumHits &&
        this.inputCost
      );
    },

    averageHits() {
      if (this.isFormComplete) {
        if (this.minimumHits === this.maximumHits) {
          return this.minimumHits;
        }
        const count = this.maximumHits - this.minimumHits;
        const sum = (count / 2) * (this.minimumHits + this.maximumHits);
        return sum / count;
      }
      return "";
    },

    averageDamage() {
      if (this.isFormComplete) {
        return this.damage * this.accuracy * this.averageHits;
      }
      return "";
    },

    averageEfficiency() {
      if (this.isFormComplete && this.cost > 0) {
        return this.averageDamage / this.cost;
      }
      return "";
    },

    minimumDamage() {
      return "";
    },

    minimumEfficiency() {
      if (this.isFormComplete && this.cost > 0) {
        return this.minimumDamage / this.cost;
      }
      return "";
    },

    maximumDamage() {
      return "";
    },

    maximumEfficiency() {
      if (this.isFormComplete && this.cost > 0) {
        return this.maximumDamage / this.cost;
      }
      return "";
    }
  },
  data: {
    css: {
      label: "db mt3 mb1 b",
      input: "db ba bw1 b--dark-blue pa2 bg-lightest-blue navy",
      thead: "",
      tbody: "",
      table: "w-100 collapse mt3 bg-lightest-blue navy",
      tr: "ba bw1 b--dark-blue tl",
      td: "ba bw1 b--dark-blue pa2 tr",
      th: "ba bw1 b--dark-blue pa2 tl bg-light-blue"
    },

    // inputDamage: "0",
    // inputAccuracy: "100",
    // inputMinimumHits: "1",
    // inputMaximumHits: "1",
    // inputCost: "0"

    // Temporarily use the Zodiac lv.1 Meteor spell
    inputDamage: "50",
    inputAccuracy: "95",
    inputMinimumHits: "2",
    inputMaximumHits: "5",
    inputCost: "27"
  }
});

console.log(app);
window.app = app;
