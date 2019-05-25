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

  methods: {
    onDeleteClick() {
      this.$emit("delete", this.spell);
    }
  },

  filters: {
    formatNumber(value) {
      if (!value) {
        return "–"; // ndash
      }
      return value.toFixed(1);
    }
  },

  computed: {
    damage() {
      return this.spell.damage;
    },

    accuracy() {
      return this.spell.accuracy / 100;
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

  template: html`
    <div class="Results">
      <h2 class="Results-Name">{{ spell.name }}</h2>
      <div>
        <div class="Results-Item">
          <div class="Results-Label">Damage</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageDamage | formatNumber }}
          </div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumDamage | formatNumber }} &ndash; {{ maximumDamage |
            formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Efficiency</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageEfficiency | formatNumber }}
          </div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumEfficiency | formatNumber }} &ndash; {{ maximumEfficiency
            | formatNumber }}
          </div>
        </div>
      </div>
      <button
        class="RemoveButton"
        type="button"
        v-bind:aria-label="'Remove ' + spell.name"
        v-on:click="onDeleteClick"
      >
        Remove
      </button>
    </div>
  `
});

const app = new Vue({
  el: "#app",

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
        maximumHits: this.inputMaximumHits || this.inputMinimumHits,
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
        this.inputCost
      );
    }
  },

  data: {
    name: "",
    inputDamage: "",
    inputAccuracy: "100",
    inputMinimumHits: "1",
    inputMaximumHits: "",
    inputCost: "",

    spells: storage.get("spells", [])
  }
});

app.$watch("spells", () => {
  storage.set("spells", app.spells);
});
