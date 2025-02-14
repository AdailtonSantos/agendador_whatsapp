<template>
  <header>
    <p><b>MENSAGENS AGENDADAS |</b></p>
    <i :class="icon" @click="toggleModalCreateTicket"></i> (Adicionar)
    <CreateSchedule v-if="createTicket" @schedule="scheduleCreated" @closeModal="closeModal" />
    <div @click="toggleUserInfo()" class="profile">
      <i class="bi bi-person-circle"></i>
      <span>Perfil</span>
    </div>
    <div v-if="userInfo" class="user-info">
      <div class="instance">
        <span>USUÁRIO:</span>
        <span class="username">{{ user.username }}</span><br>
        <span>SUA INSTÂNCIA:</span>
        <span class="userinstance">{{ user.instance }}</span>
      </div>
      <button @click="logout()">SAIR</button>
    </div>
  </header>
</template>

<script>
import CreateSchedule from "@/components/CreateSchedule";

export default {
  name: "HeaderComponent",
  components: {
    CreateSchedule,
  },
  data() {
    return {
      icon: "bi-plus-circle-fill add",
      accounts: [],
      showExcludeModal: false,
      createTicket: false,
      userInfo: false,
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  mounted() {},
  methods: {
    toggleUserInfo(){
      if(this.userInfo === false){
        this.userInfo = true
      } else {
        this.userInfo = false
      }
    },
    toggleModalCreateTicket() {
      if (this.icon === "bi-plus-circle-fill add") {
        this.icon = "bi-x-circle-fill add";
        this.createTicket = true;
        return;
      }
      if (this.icon === "bi-x-circle-fill add") {
        this.createTicket = false;
        this.icon = "bi-plus-circle-fill add";
        return;
      }
    },
    toggleModalExcludeTicket() {
      if (this.showExcludeModal === true) {
        this.showExcludeModal = false;
      } else {
        this.showExcludeModal = true;
      }
    },
    closeModal() {
      this.createTicket = false;
      this.icon = "bi-plus-circle-fill add";
    },
    scheduleCreated() {
      this.$emit('scheduleCreated')
      this.closeModal()
    },
    logout() {
      localStorage.removeItem("user")
      this.$router.push('/')
    }
  },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  gap: 10px;
}

header .add {
  font-size: 1.5em;
  cursor: pointer;
}

header div {
  display: flex;
  margin-left: auto;
}

header .bi-square-fill {
  font-size: 0.84em;
  font-weight: bold;
  cursor: pointer;
  margin: 0 5px;
}

.viewCalendarButton {
  margin-left: auto;
  border: 0;
  background-color: #e8ce56;
  padding: 5px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1em;
}

.profile {
  display: flex;
  align-items: center;
  gap: 5px;

  cursor: pointer;
}

.profile i {
  font-size: 1.5em;
}
.profile span {
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  justify-content: center;

  position: absolute;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.26);
  right: 15px;
  top: 55px;

  padding: 15px;
  background-color: white;
  font-weight: bold;
}
.instance {
  padding: 5px;
  display: flex;
  align-items: center;
  flex-direction: column
}
.userinstance,
.username {
  background-color: #e8ce56;
  padding: 5px 30px;
  border-radius: 5px;
  text-transform: uppercase;
}
.user-info button {
  padding: 5px 30px;
  border: 2px solid #e8ce56;
  border-radius: 5px;
  background-color: white;
  font-weight: bold;
  transition: background-color .1s;
  cursor: pointer
}
.user-info button:hover {
  background-color: #e8ce56;
}
</style>
