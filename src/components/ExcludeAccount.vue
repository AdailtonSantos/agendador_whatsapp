<template>
  <form @submit.prevent="" class="excludeInstance">
    {{ infoMessage }}
    <label>Selecione a organização que deseja excluir</label>
    <select name="organization" v-model="selectedInstance">
      <option
        v-for="instance of instances"
        :key="instance.id"
        :value="instance.name"
      >
        {{ instance.name }}
      </option>
    </select>
    <button @click="ExcludeInstance(selectedInstance)">Excluir</button>
  </form>
</template>

<script>
import throwError from "@/functions/throwError";
import axios from "axios";

export default {
  name: "ExcludeOrganization",
  data() {
    return {
      instances: [],
      infoMessage: null,
      selectedInstance: null,
    };
  },
  async mounted() {
    this.listInstances()
  },
  methods: {
    async listInstances(){
      const response = await axios.get("/instances");
      throwError(response, this)

      this.instances = response.data;
    },
    async ExcludeInstance(name) {
      const response = await axios.delete(`/instance/${name}`);
      throwError(response, this)

      this.$emit("ExcludeInstance");
    },
  },
};
</script>

<style scoped>
.excludeInstance {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  gap: 5px;
  background-color: white;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
  font-size: 0.9em;
  width: 200px;
  z-index: 999;
}
label {
  font-weight: 600;
  text-align: left;
}
.excludeInstance button {
  background-color: white;
  border: 1px solid #645e5e;
  border-radius: 5px;
}
</style>
