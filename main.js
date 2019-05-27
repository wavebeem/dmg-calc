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

const SpellTable = {
  props: ["spell", "mode"],

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

    time() {
      return this.spell.time;
    },

    averageHits() {
      if (this.minimumHits === this.maximumHits) {
        return this.minimumHits;
      }
      // I'm sure there's some formula for this, but I don't know what it is and
      // I'm just gonna use a for-loop, sorry!
      let result = 0;
      for (let i = this.minimumHits; i <= this.maximumHits; i++) {
        result += i;
      }
      result /= 1 + this.maximumHits - this.minimumHits;
      return result;
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
      return this.damage * this.maximumHits;
    },

    maximumEfficiency() {
      if (this.cost > 0) {
        return this.maximumDamage / this.cost;
      }
      return "";
    },

    averageDPS() {
      return this.averageDamage / this.time;
    },

    minimumDPS() {
      return this.minimumDamage / this.time;
    },

    maximumDPS() {
      return this.maximumDamage / this.time;
    }
  },

  template: html`
    <div class="Results">
      <h2 class="Results-Name">{{ spell.name }}</h2>
      <div>
        <div class="Results-Item" v-if="mode === 'average'">
          <div class="Results-Label">Damage</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="mode === 'minimum'">
          <div class="Results-Label">Damage</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="mode === 'maximum'">
          <div class="Results-Label">Damage</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ maximumDamage | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="time > 1 && mode === 'average'">
          <div class="Results-Label">DPS</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageDPS | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="time > 1 && mode === 'minimum'">
          <div class="Results-Label">DPS</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumDPS | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="time > 1 && mode === 'maximum'">
          <div class="Results-Label">DPS</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ maximumDPS | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="mode === 'average'">
          <div class="Results-Label">Efficiency</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ averageEfficiency | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="mode === 'minimum'">
          <div class="Results-Label">Efficiency</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ minimumEfficiency | formatNumber }}
          </div>
        </div>
        <div class="Results-Item" v-if="mode === 'maximum'">
          <div class="Results-Label">Efficiency</div>
          <div class="Results-Divider"></div>
          <div class="Results-Number">
            {{ maximumEfficiency | formatNumber }}
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
};

Vue.component("spell-table", SpellTable);

function makeKey(string) {
  return [string, new Date().toISOString(), Math.random()].join(" | ");
}

const app = new Vue({
  el: "#app",

  methods: {
    onDelete(spell) {
      this.spells = this.spells.filter(s => s.id !== spell.id);
    },

    submit(event) {
      event.preventDefault();
      this.spells.unshift({
        id: makeKey(this.name),
        name: this.name,
        damage: this.damage,
        accuracy: this.accuracy,
        minimumHits: this.minimumHits,
        maximumHits: this.maximumHits,
        cost: this.cost,
        time: this.time
      });
    }
  },

  computed: {
    damage() {
      return Number(this.inputDamage || 0);
    },

    accuracy() {
      return Number(this.inputAccuracy) / 100;
    },

    minimumHits() {
      return Number(this.inputMinimumHits);
    },

    maximumHits() {
      return Number(this.inputMaximumHits || this.inputMinimumHits);
    },

    cost() {
      return Number(this.inputCost || 0);
    },

    time() {
      return Number(this.inputTime || 1);
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
    inputTime: "",

    // average | minimum | maximum
    mode: "average",

    spells: storage.get("spells", [])
  }
});

app.$watch("spells", () => {
  storage.set("spells", app.spells);
});
