<template>
  <v-row>
    <v-col>
      <v-card>
        <v-form ref="form" v-model="isFormValid">
          <v-card-actions v-if="userLocalComputed.id">
            <v-btn color="warning" @click="changeInfo" :disabled="onInfoChange">
              <v-icon left> mdi-pencil </v-icon>
              Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteEmployee(userLocalComputed.id)">
              Delete
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <div
              v-if="
                userLocalComputed.name &&
                userLocalComputed.surname &&
                userLocalComputed.patronymic &&
                !this.onInfoChange &&
                userLocalComputed.id
              "
            >
              <h2>
                {{
                  `Full name of employee: ${userLocalComputed.name} ${userLocalComputed.surname} ${userLocalComputed.patronymic}`
                }}
              </h2>
            </div>
            <v-text-field
              v-else
              v-model="fullNameComputed"
              :rules="rules.fullname"
              label="Full Name"
              placeholder="John Doe Ivanovich"
              required
            ></v-text-field>

            <div
              v-if="
                userLocalComputed.address &&
                !this.onInfoChange &&
                userLocalComputed.id
              "
            >
              <h3>Employee address: {{ userLocalComputed.address }}</h3>
            </div>
            <v-text-field
              v-else
              v-model="userLocalComputed.address"
              :rules="[
                () =>
                  !!userLocalComputed.address ||
                  'This field is required. Example: `Moscow, 221b Lubyanka st.`',
                () =>
                  (!!userLocalComputed.address &&
                    userLocalComputed.address.length > 3 &&
                    userLocalComputed.address.length <= 25) ||
                  'Address must be less than 25 characters and more than 3 characters',
              ]"
              label="Address Line"
              placeholder="Snowy Rock Pl"
              counter="25"
              required
            ></v-text-field>

            <div
              v-if="
                userLocalComputed.department &&
                !this.onInfoChange &&
                userLocalComputed.id
              "
            >
              <h3>Employee department: {{ userLocalComputed.department }}</h3>
            </div>
            <v-text-field
              v-else
              v-model="userLocalComputed.department"
              :rules="[
                () =>
                  !!userLocalComputed.department || 'This field is required',
              ]"
              label="Department"
              placeholder="Department of Back-End"
              required
            ></v-text-field>

            <div
              v-if="
                userLocalComputed.birthdate &&
                !this.onInfoChange &&
                userLocalComputed.id
              "
            >
              <h3>Employee birthdate: {{ userLocalComputed.birthdate }}</h3>
            </div>
            <div v-else>
              <div class="mb-6">
                Active picker:
                <code>{{ activePicker || "Select the date" }}</code>
              </div>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="userLocalComputed.birthdate"
                    label="Birthday date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="userLocalComputed.birthdate"
                  :landscape="true"
                  :active-picker.sync="activePicker"
                  :max="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  min="1950-01-01"
                  @change="saveDate"
                  required
                ></v-date-picker>
              </v-menu>
            </div>

            <div
              v-if="
                userLocalComputed.about &&
                !this.onInfoChange &&
                userLocalComputed.id
              "
            >
              <p>About employee: {{ userLocalComputed.about }}</p>
            </div>
            <v-textarea
              v-else
              v-model="userLocalComputed.about"
              color="teal"
              auto-grow
              label="Two rows"
              rows="3"
              row-height="25"
            >
              <template v-slot:label>
                <div>Bio <small>(optional)</small></div>
              </template>
            </v-textarea>
          </v-card-text>
          <v-card-actions v-if="this.onInfoChange">
            <v-btn color="normal" @click="cancelChange"> Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="submitData(userLocalComputed)"
              :disabled="!isFormValid"
            >
              Submit
            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="isNew && !userLocalComputed.id">
            <v-btn text @click="cancelCreate"> Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="createEmployee(userLocalComputed)"
              :disabled="!isFormValid"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UserProfile",

  components: {},
  props: {
    user: Object,
  },

  data: () => ({
    isFormValid: true,
    isfullNameValid: false,
    onInfoChange: false,
    activePicker: null,
    menu: false,
    formHasErrors: false,
    rules: {
      name: [(val) => (val || "").length > 0 || "This field is required"],
      fullname: [
        (val) =>
          /^[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+$/gi.test(val) ||
          "This field is required. Example: `Winston Smith Vasilyewich`",
      ],
    },
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  computed: {
    userLocalComputed() {
      return {
        name: this.user.name || "",
        surname: this.user.surname || "",
        patronymic: this.user.patronymic || "",
        about: this.user.about || "",
        department: this.user.department || "",
        birthdate: this.user.birthdate || "",
        address: this.user.address || "",
        id: this.user.id || "",
      };
    },
    fullNameComputed: {
      get() {
        const name = this.userLocalComputed.name;
        const surname = this.userLocalComputed.surname;
        const patronymic = this.userLocalComputed.patronymic;
        if (name && surname && patronymic) {
          return `${name} ${surname} ${patronymic}`;
        }
        if (!name || !surname || !patronymic) {
          return "";
        }
        return false;
      },
      set(newValue) {
        let arrayOfFullname = [];
        newValue = newValue.trim();
        let reg = /^[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+$/gi;
        this.isfullNameValid = reg.test(newValue);
        if (this.isfullNameValid) {
          arrayOfFullname = newValue.split(" ");
          this.userLocalComputed.name = arrayOfFullname[0];
          this.userLocalComputed.surname = arrayOfFullname[1];
          this.userLocalComputed.patronymic = arrayOfFullname[2];
          return true;
        }
        return false;
      },
    },
    isNew() {
      return this.$store.state.isNew.payload;
    },
  },

  methods: {
    deleteEmployee(id) {
      this.$store.dispatch({
        type: "deleteEmployee",
        id: id,
      });
    },
    changeInfo() {
      this.onInfoChange = true;
    },
    cancelChange() {
      this.onInfoChange = false;
    },
    cancelCreate() {
      this.$store.commit({
        type: "cancelCreateEmployee",
      });
      this.$store.commit({
        type: "isCreatingEmployee",
        payload: false,
      });
    },
    createEmployee(employee) {
      this.$refs.form.validate();
      this.$store.dispatch({
        type: "createEmployee",
        employee: employee,
      });
    },
    saveDate(date) {
      this.$refs.menu.save(date);
      this.userLocalComputed.birthdate = date;
    },
    submitData(employee) {
      this.$store.dispatch({
        type: "updateEmployee",
        employee: employee,
      });

      this.onInfoChange = false;
    },
  },

  mounted() {
    if (
      this.userLocalComputed.name &&
      this.userLocalComputed.surname &&
      this.userLocalComputed.patronymic
    ) {
      this.isfullNameValid = true;
    }
  },
};
</script>

<style lang="scss">
.panel {
  // width: 100rem;
}
</style>
