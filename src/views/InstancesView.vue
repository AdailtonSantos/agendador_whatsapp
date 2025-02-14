<template>
  <div>
    <h1>INSTÂNCIAS</h1>
  </div>
  <div v-for="(instance, index) of instances" :key="index" class="instance-name">
    <b>{{ instance.name }}</b>
    <hr />
    <div
      v-for="(user, userIndex) in instance.users"
      :key="userIndex"
      class="instance-user"
    >
      {{ user.name }}
      <i class="bi bi-x-circle-fill" @click="excludeUser(user.id)"></i>
    </div>
  </div>
</template>

<script>
import throwError from "@/functions/throwError";
import axios from "axios";

export default {
  name: "InstancesView",
  components: {},
  data() {
    return {
      instances: [],
      removeUserModal: false,
    };
  },
  async mounted() {
    this.listInstances();
  },
  methods: {
    async listInstances() {
      try {
        const response = await axios.get("/edit/instances");
        const instances = response.data.instances;
        const users = response.data.users;
        instances.map((instance) => {
          instance.users = users.filter((el) => el.instance === instance.name);
        });
        this.instances = instances;
      } catch (err) {
        if(err.response.status === 403){
          return this.$router.push("/list")
        }

        throwError(err.response, this);
      }
    },
    async excludeUser(id) {
      if (confirm("Você tem certeza que deseja executar esta ação?")) {
        try {
          await axios.delete(`/user/${id}`);
          this.listInstances();
        } catch (err) {
          throwError(err.response, this);
        }
      }
    },
  },
};
</script>
<style scoped>
.instance-name {
  background-color: rgb(247, 243, 243);
  padding: 15px 15px;
  margin: 5px 15px;
  border: 1px solid rgb(216, 204, 204);
  border-radius: 10px;

  text-align: left;
}

.instance-user {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(184, 175, 175);
  padding: 5px;
}

.instance-user i {
  color: red;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
