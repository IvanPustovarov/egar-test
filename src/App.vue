<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="2">
            <v-btn
              tile
              color="success"
              @click="createEmployee"
              :disabled="isNew"
            >
              <v-icon dark> mdi-plus </v-icon>
              Create
            </v-btn>
          </v-col>
          <v-col cols="7">
            <v-expansion-panels>
              <v-expansion-panel
                class="user-profile"
                v-for="UserProfile in infoComputed"
                :key="UserProfile.createdAt"
              >
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="12" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0">
                            <h1>Employee card</h1></span
                          >
                          <span v-else key="1">
                            <div
                              v-if="
                                UserProfile.name &&
                                UserProfile.surname &&
                                UserProfile.patronymic
                              "
                            >
                              {{
                                `${UserProfile.name} ${UserProfile.surname} ${UserProfile.patronymic}`
                              }}
                            </div>
                          </span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <user-profile :user="UserProfile"></user-profile>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UserProfile from "./components/user-profile.vue";

export default {
  name: "App",

  components: {
    UserProfile,
  },

  data: () => ({}),
  watch: {},

  computed: {
    infoComputed() {
      return this.$store.state.employees;
    },
    isNew() {
      return this.$store.state.isNew.payload;
    },
  },

  methods: {
    createEmployee() {
      this.$store.commit({
        type: "isCreatingEmployee",
        payload: true,
      });

      this.$store.commit({
        type: "createEmployee",
        user: {},
      });
    },
  },

  mounted() {
    this.$store.dispatch({
      type: "loadEmployees",
    });
  },
};
</script>

<style lang="scss">
.user-profile {
  margin-bottom: 15px;
}
</style>