<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="2">
            <v-btn tile color="success">
              <v-icon dark> mdi-plus </v-icon>
              Create
            </v-btn>
          </v-col>
          <v-col cols="10">
            <v-expansion-panels>
              <v-expansion-panel
                class="user-profile"
                v-for="UserProfile in info"
                :key="UserProfile.createdAt"
              >
                <user-profile :user="UserProfile"></user-profile>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- <v-btn depressed color="primary" @click="increment"> Increment </v-btn>
      <v-btn depressed color="primary" @click="decrement"> Decrement </v-btn>
      <v-btn depressed color="primary" @click="asyncIncrementExample">
        Increment later
      </v-btn> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const axios = require("axios").default;
//import { INCREMENT } from "./store/mutation-types";
import UserProfile from "./components/user-profile.vue";

export default {
  name: "App",

  components: {
    UserProfile,
  },

  data: () => ({
    info: null,
    user: {
      name: "",
      surname: "",
      patronymic: "",
      bio: "",
      department: "",
    },
    activePicker: null,
    date: null,
    menu: false,
    formHasErrors: false,
    address: null,
    errorMessages: "",
    rules: {
      name: [(val) => (val || "").length > 0 || "This field is required"],
    },
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    "user.name"() {
      this.errorMessages = "";
    },
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
  },

  methods: {
    increment() {
      this.$store.commit({
        type: "increment",
        amount: 10,
      });
    },
    addressCheck() {
      this.errorMessages =
        this.address && !this.name ? `Hey! I'm required` : "";

      return true;
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    submit() {},
    asyncIncrementExample() {
      this.$store.dispatch({
        type: "asyncIncrementExampleStore",
        amount: 10,
      });
    },
    decrement() {
      this.$store.dispatch({
        type: "decrement",
        amount: 10,
      });
    },
  },

  mounted() {
    axios
      .get("https://629915c87b866a90ec368b06.mockapi.io/api/employee")
      .then((response) => (this.info = response.data))
      .catch((error) => console.log(error));
  },
};
</script>

<style lang="scss">
.user-profile {
  margin-bottom: 15px;
}
</style>