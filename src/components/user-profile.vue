<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <template v-slot:default="{ open }">
        <v-row no-gutters>
          <v-col cols="12" class="text--secondary">
            <v-fade-transition leave-absolute>
              <span v-if="open" key="0"> Fill employee card </span>
              <span v-else key="1">
                {{
                  `${userLocalComputed.fullName.name} ${userLocalComputed.fullName.surname} ${userLocalComputed.fullName.patronymic}`
                }}
              </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-btn tile color="warning" @click="changeInfo">
            <v-icon left> mdi-pencil </v-icon>
            Edit
          </v-btn>
          <v-btn color="error" @click="deleteEmployee(userLocalComputed.id)">
            Delete
          </v-btn>
          <v-card ref="form">
            <v-card-text>
              <div
                v-if="
                  userLocalComputed.fullName.name &&
                  userLocalComputed.fullName.surname &&
                  userLocalComputed.fullName.patronymic &&
                  !this.onInfoChange
                "
              >
                {{
                  `${userLocalComputed.fullName.name} ${userLocalComputed.fullName.surname} ${userLocalComputed.fullName.patronymic}`
                }}
              </div>
              <v-text-field
                v-else
                v-model="fullNameComputed"
                :rules="[
                  () =>
                    !!isfullNameValid ||
                    'This field is required. Example: `Winston Smith Vasilyewich`',
                ]"
                label="Full Name"
                placeholder="John Doe Ivanovich"
                required
              ></v-text-field>

              <div v-if="userLocalComputed.address && !this.onInfoChange">
                {{ userLocalComputed.address }}
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

              <div v-if="userLocalComputed.department && !this.onInfoChange">
                {{ user.department }}
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

              <div v-if="userLocalComputed.birthdate && !this.onInfoChange">
                {{ user.birthdate }}
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

              <div v-if="userLocalComputed.about && !this.onInfoChange">
                {{ user.about }}
              </div>
              <v-textarea
                v-else
                v-model="userLocalComputed.about"
                color="teal"
                filled
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
              <v-btn text> Cancel </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="submitData(userLocalComputed)"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "UserProfile",

  components: {},
  props: {
    user: Object,
  },

  data: () => ({
    isfullNameValid: false,
    onInfoChange: false,
    activePicker: null,
    menu: false,
    formHasErrors: false,
    errorMessages: "",
    rules: {
      name: [(val) => (val || "").length > 0 || "This field is required"],
    },
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
    userLocalComputed() {
      return {
        fullName: {
          name: this.user.name ? this.user.name : "",
          surname: this.user.surname ? this.user.surname : "",
          patronymic: this.user.patronymic ? this.user.patronymic : "",
        },
        about: this.user.about ? this.user.about : "",
        department: this.user.department ? this.user.department : "",
        birthdate: this.user.birthdate ? this.user.birthdate : "",
        address: this.user.address ? this.user.address : "",
        id: this.user.id ? this.user.id : "",
      };
    },
    fullNameComputed: {
      get() {
        const name = this.userLocalComputed.fullName.name;
        const surname = this.userLocalComputed.fullName.surname;
        const patronymic = this.userLocalComputed.fullName.patronymic;
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
          this.userLocalComputed.fullName = {
            name: arrayOfFullname[0],
            surname: arrayOfFullname[1],
            patronymic: arrayOfFullname[2],
          };
          return true;
        }
        return false;
      },
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
      this.onInfoChange = !this.onInfoChange;
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
    },
  },

  mounted() {},
};
</script>
