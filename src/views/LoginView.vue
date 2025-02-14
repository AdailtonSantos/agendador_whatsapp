<template>
  <form @submit.prevent="" class="loginForm">
    <div>
      <img src="logo.png" alt="Logo" />
      <h2>LOGIN</h2>
      <span id="infoMessage">{{ infoMessage }}</span>
    </div>
    <div class="fields">
      <div>
        <label> Usuário </label>
        <input type="text" v-model="username" id="username"/>
      </div>
      <div>
        <label> Senha </label>
        <input type="password" v-model="password" id="password" />
      </div>
      <div class="actions">
        <button @click="login">Entrar</button>
      </div>
      <p>Não possui uma conta? <a href="/register"> Registre-se </a></p>
    </div>
  </form>
</template>

<script>
import throwError from "@/functions/throwError";
import axios from "axios";

export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      username: null,
      password: null,
      infoMessage: null,
    };
  },
  mounted() {
    if(localStorage.getItem('user')){
      this.$router.push("/list");
    }
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        return (this.infoMessage = "Por favor, preencha todos os campos");
      }

      try {
        const response = await axios.post("/login", {
          username: this.username,
          password: this.password,
        });
        const user = {
          username: response.data.user,
          instance: response.data.instance,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(user));
        this.$router.push("/list");
      } catch (err) {
        if(err.response.status === 403){
          return this.infoMessage = err.response.data.error
        }
        throwError(err.response, this);
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
.loginForm {
  background-color: whitesmoke;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 1.2em;
}
.loginForm img {
  width: 150px;
}
.fields {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  height: 100px;
}
.loginForm label {
  font-weight: bold;
}
.loginForm input {
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
</style>