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
    <div>
      <div class="Results">
        <div class="flex mb3">
          <h2 class="Results-Name">{{ spell.name }}</h2>
          <button
            class="RemoveButton"
            type="button"
            v-bind:aria-label="'Remove ' + spell.name"
            v-on:click="onDeleteClick"
          >
            Remove
          </button>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Damage: Average</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Damage: Minimum</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Damage: Maximum</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ maximumDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Efficiency: Average</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageEfficiency | formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Efficiency: Minimum</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumEfficiency | formatNumber }}
          </div>
        </div>
        <div class="Results-Item">
          <div class="Results-Label">Efficiency: Maximum</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ maximumEfficiency | formatNumber }}
          </div>
        </div>
      </div>
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
    name: "",
    inputDamage: "0",
    inputAccuracy: "100",
    inputMinimumHits: "1",
    inputMaximumHits: "1",
    inputCost: "0",

    spells: storage.get("spells", [])
  }
});

app.$watch("spells", () => {
  storage.set("spells", app.spells);
});
