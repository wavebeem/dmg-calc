// Loading from browser globals because embedding giant URLs inside my JS feels
// yucky for some reason... deal with it, nerds. Maybe one day we'll have import
// maps. Maybe.
const { Vue } = window;

class Storage {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key, fallback) {
    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item);
  }
}

const storage = new Storage();
const html = String.raw;

Vue.component("spell-table", {
  props: ["spell"],

  computed: {
    damage() {
      return this.spell.damage;
    },

    accuracy() {
      return this.spell.accuracy;
    },

    cost() {
      return this.spell.cost;
    },

    minimumHits() {
      return this.spell.minimumHits;
    },

    maximumHits() {
      return this.spell.maximumHits;
    },

    averageHits() {
      if (this.minimumHits === this.maximumHits) {
        return this.minimumHits;
      }
      const count = this.maximumHits - this.minimumHits;
      const sum = (count / 2) * (this.minimumHits + this.maximumHits);
      return sum / count;
    },

    averageDamage() {
      return this.damage * this.accuracy * this.averageHits;
    },

    averageEfficiency() {
      if (this.cost > 0) {
        return this.averageDamage / this.cost;
      }
      return "";
    },

    minimumDamage() {
      return this.damage * this.accuracy * this.minimumHits;
    },

    minimumEfficiency() {
      if (this.cost > 0) {
        return this.minimumDamage / this.cost;
      }
      return "";
    },

    maximumDamage() {
      return this.damage * this.accuracy * this.maximumHits;
    },

    maximumEfficiency() {
      if (this.cost > 0) {
        return this.maximumDamage / this.cost;
      }
      return "";
    }
  },

  data() {
    return {
      css: {
        thead: "",
        tbody: "",
        table: "w-100 collapse mb4 dt--fixed",
        tr: "",
        td: "ba bw1 b--white bg-near-white pa2 tr code",
        th: "ba bw1 b--white bg-lightest-blue pa2 tr",
        button: "db ba bw1 b--dark-red bg-light-gray dark-red pv2 w-100 b"
      }
    };
  },

  template: html`
    <div>
      <div class="flex mb2">
        <h2 class="flex-auto ma0">{{ spell.name }}</h2>
        <div class="w4">
          <button
            type="button"
            v-on:click="$emit('delete', spell)"
            v-bind:class="css.button"
          >
            Remove
          </button>
        </div>
      </div>
      <table v-bind:class="css.table">
        <thead v-bind:class="css.thead">
          <tr v-bind:class="css.tr">
            <th v-bind:class="css.th"></th>
            <th v-bind:class="css.th">Damage</th>
            <th v-bind:class="css.th">Efficiency</th>
          </tr>
        </thead>
        <tbody v-bind:class="css.tbody">
          <tr v-bind:class="css.tr">
            <th v-bind:class="css.th">Average</th>
            <td v-bind:class="css.td">{{ averageDamage | formatNumber }}</td>
            <td v-bind:class="css.td">
              {{ averageEfficiency | formatNumber }}
            </td>
          </tr>
          <tr v-bind:class="css.tr">
            <th v-bind:class="css.th">Minimum</th>
            <td v-bind:class="css.td">{{ minimumDamage | formatNumber }}</td>
            <td v-bind:class="css.td">
              {{ minimumEfficiency | formatNumber }}
            </td>
          </tr>
          <tr v-bind:class="css.tr">
            <th v-bind:class="css.th">Maximum</th>
            <td v-bind:class="css.td">{{ maximumDamage | formatNumber }}</td>
            <td v-bind:class="css.td">
              {{ maximumEfficiency | formatNumber }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});

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

  methods: {
    onDelete(spell) {
      this.spells = this.spells.filter(s => s.id !== spell.id);
    },

    submit(event) {
      event.preventDefault();
      this.spells.unshift({
        id: Math.random(),
        name: this.name,
        damage: this.inputDamage,
        accuracy: this.inputAccuracy,
        minimumHits: this.inputMinimumHits,
        maximumHits: this.inputMaximumHits,
        cost: this.inputCost
      });
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

    isFormDisabled() {
      return !(
        this.name &&
        this.inputDamage &&
        this.inputAccuracy &&
        this.inputMinimumHits &&
        this.inputMaximumHits &&
        this.inputCost
      );
    }
  },

  data: {
    css: {
      label: "db mt3 mb1 b",
      input: "db ba bw1 b--gray pa2 bg-white navy w-100 border-box",
      button: "db ba bw1 b--dark-green bg-green white pv2 w-100 b",
      buttonDisabled: "db ba bw1 b--black-20 bg-light-gray black-20 pv2 w-100 b"
    },

    name: "",
    inputDamage: "0",
    inputAccuracy: "100",
    inputMinimumHits: "1",
    inputMaximumHits: "1",
    inputCost: "0",

    spells: storage.get("spells", [])
    // Temporarily use the Zodiac lv.1 Meteor spell
    // spells: [
    //   {
    //     id: Math.random(),
    //     name: "[Zodiac] Meteor (L1)",
    //     damage: 50,
    //     accuracy: 95,
    //     minimumHits: 2,
    //     maximumHits: 5,
    //     cost: 2
    //   }
    // ]
  }
});

app.$watch("spells", () => {
  storage.set("spells", app.spells);
});
