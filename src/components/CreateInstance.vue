<template>
  <form @submit.prevent="" class="createInstance">
    <span id="errorMessage" v-if="this.errorMessage">{{ errorMessage }}</span>
    <span>Para o funcionamento do sistema, a instância deve estar <br>criada no evolution</span>
    <label>Nome da instância (da exata forma que está no evolution)</label>
    <input type="text" v-model="name" id="instanceName"/>

    <button @click="createInstance">Adicionar</button>
  </form>
</template>

<script>
import throwError from "@/functions/throwError";
import axios from "axios";

export default {
  name: "CreateInstance",
  data() {
    return {
      name: null,
      errorMessage: null,
    };
  },
  methods: {
    async createInstance() {
      if (!this.name) {
        return (this.errorMessage = "Por favor, digite um nome para a conta");
      }
      try {
        const response = await axios.post("/instance", {
          name: this.name
        });

        this.$emit("createdInstance", response.data);
      } catch (err) {

        if(err.response.status === 400){
          return this.errorMessage = err.response.data.message
        }

        if(err.response.status === 404){
          return this.errorMessage = err.response.data.message
        }

        throwError(err.response, this);
      }

    },
  },
};
</script>

<style scoped>
.createInstance {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 0.9em;
}
.createInstance label {
  font-weight: 600;
  text-align: left;
}
.createInstance button {
  background-color: white;
  border: 1px solid #645e5e;
  border-radius: 5px;
}

</style>
