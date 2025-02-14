<template>
  <form @submit.prevent="" class="registerForm">
    <div>
      <img src="logo.png" alt="Logo" />
      <h2>Cadastro</h2>
      <span id="infoMessage" v-if="this.infoMessage">{{ infoMessage }}</span>
    </div>
    <div class="fields">
      <div>
        <label> Nome </label>
        <input type="text" v-model="name" />
      </div>
      <div>
        <label> Nome de usuário </label>
        <input type="text" v-model="username" />
      </div>
      <div>
        <label> Senha </label>
        <input type="password" v-model="password" />
      </div>
      <div>
        <CreateInstance
          v-if="showCreateInstance"
          @createdInstance="createdInstance"
        />
        <i class="bi-plus-circle-fill add" @click="toggleShowCreateInstance"></i>
        <label> Conta </label>
        <select name="instance" id="" v-model="instance">
          <option
            v-for="instance of instances"
            :key="instance.id"
            :value="instance.name"
          >
            {{ instance.name }}
          </option>
        </select>
      </div>
      <div class="actions">
        <button @click="register">Cadastrar</button>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import CreateInstance from "@/components/CreateInstance.vue";
import throwError from "@/functions/throwError";

export default {
  name: "RegisterView",
  components: {
    CreateInstance,
  },
  data() {
    return {
      name: null,
      username: null,
      password: null,
      instance: null,
      instances: [],
      infoMessage: null,
      showCreateInstance: null,
    };
  },
  mounted() {
    this.listInstances();
  },
  methods: {
    async listInstances() {
      try {
        const response = await axios.get("/instances");
        this.instances = response.data;
      } catch (err) {
        throwError(err.response, this);
      }
    },
    async register() {
      if (
        !this.name ||
        !this.username ||
        !this.password ||
        !this.instance
      ) {
        return (this.infoMessage = "Por favor, preencha todos os campos");
      }

      try {
        await axios.post("/registerUser", {
          name: this.name,
          username: this.username,
          password: this.password,
          instance: this.instance,
        });
      } catch (err) {
        if (err.response && err.response.status === 403) {
          this.infoMessage = err.response.data.message;
          return;
        }
        throwError(err.response, this);
      }

      this.$router.push("/");
    },
    createdInstance(value) {
      this.showCreateInstance = false;
      this.infoMessage = value.message
      this.listInstances();
    },
    toggleShowCreateInstance() {
      if (this.showCreateInstance === true) {
        this.showCreateInstance = false;
      } else {
        this.showCreateInstance = true;
      }
    },
  },
};
</script>

<style>
html,
body {
  background-color: whitesmoke;
}
.registerForm {
  background-color: whitesmoke;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 1.2em;
}
.registerForm img {
  width: 150px;
}
.fields {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  height: 100px;
}
.registerForm label {
  font-weight: bold;
}
.registerForm input {
  border-radius: 30px;
  border: 1px solid black;
  padding: 6px 15px;
}
.actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 15px;
}
.actions button {
  border: 0px;
  background-color: transparent;
  padding: 10px 15px;
  border-radius: 30px;
  -webkit-text-stroke-color: rgba(0, 0, 0, 0.432);
  -webkit-text-stroke-width: 1px;
  font-size: 0.8em;
  background-color: #e7cd56;
}

#errorMessage {
  background-color: #ff3636;
  color: white;
  font-weight: bold;
  padding: 5px;
}

#infoMessage {
  font-weight: bold;
  padding: 5px;
}
</style>