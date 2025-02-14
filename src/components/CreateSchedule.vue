<template>
  <form @submit.prevent="" class="createSchedule">
    <span id="infoMessage" v-if="this.infoMessage">{{ infoMessage }}</span>
    <label>Titulo</label>
    <input type="text" v-model="title" id="title">
    <label>Mensagem</label>
    <textarea v-model="message" id="message" >
      </textarea>

    <label>Contatos</label>
    <input id="searchContact" type="text" v-model="contact" />
    <div class="list">
      <div v-for="contact in filteredContacts" :key="contact.id">
        <input type="checkbox" :id="contact.id" class="contact" v-model="selectedContacts" :value="contact">
        <label :for="contact.id">{{ contact.pushName }}</label>
      </div>
    </div>
    <i class="bi bi-arrow-clockwise" @click="listContacts('ignore')">
      Atualizar</i>
    <input type="file" @change="handleFile" id="file"/>

    <label>Data e horário</label>
    <input type="datetime-local" v-model="date" id="data"/>

    <label>Recorrente?</label>
    <span>Agendamentos recorrentes são recriados e tem suas datas atualizadas automaticamente</span>
    <div style="margin-bottom: 15px;">
      <input type="radio" value="Sim" v-model="recurrent" id="confirmarRecorrencia" />Sim
      <input type="radio" value="Não" v-model="recurrent" id="negarRecorrencia" />Não
    </div>

    <label v-if="this.recurrent === 'Sim'">Recorrência em dias</label>
    <input v-if="this.recurrent === 'Sim'" type="number" v-model="recurrenceInDays"
      placeholder="A cada quantos dias será executado.." id="diasRecorrencia" >

    <button @click="scheduleMessage" id="agendar" ref="btnAgendar" >Agendar</button>
    <button @click="closeModal">Fechar</button>
  </form>
</template>

<script>
import axios from "axios";
import throwError from "@/functions/throwError";

export default {
  name: "ScheduleMessage",
  data() {
    return {
      contacts: [],
      title: null,
      message: null,
      contact: null,
      date: null,
      recurrent: 'Não',
      recurrenceInDays: 0,
      file: null,
      infoMessage: null,
      selectedContacts: []
    };
  },
  async mounted() {
    await this.listContacts();
  },
  computed: {
    filteredContacts() {
      return this.contacts.filter(contact =>
        contact.pushName && contact.pushName.startsWith(this.contact)
      );
    },
  },
  methods: {
    handleFile(event) {
      this.file = event.target.files[0];
      if (this.file && this.file.size > 20971520) {
        this.file = null
        event.target.value = null
        return (this.infoMessage = "Tamanho máximo de arquivo excedito. Limite máximo: 20MB")
      } else {
        this.infoMessage = null
      }
    },
    async scheduleMessage() {
      if (!this.message || !this.contact || !this.date) {
        return (this.infoMessage = "Por favor, preencha todos os campos.");
      }
      if (this.recurrent === 'Sim' && !this.recurrenceInDays) {
        return (this.infoMessage = "Por favor, defina o prazo de recorrência do agendamento")
      }
      this.$refs.btnAgendar.setAttribute('disabled', 'disabled')
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("message", this.message);
        formData.append("title", this.title);
        formData.append("contacts", JSON.stringify(this.selectedContacts));
        formData.append("date", this.date);
        formData.append("recurrent", this.recurrent);
        formData.append("recurrenceInDays", this.recurrenceInDays);
        formData.append("user", JSON.parse(localStorage.getItem("user")).username);
        formData.append("instance", JSON.parse(localStorage.getItem("user")).instance);
        await axios.post("/schedule", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$emit("schedule");
      } catch (err) {
        if (err.response.data.message) {
          return (this.infoMessage = err.response.data.message);
        }

        throwError(err.response, this);
      }
    },
    async listContacts(ignore) {
      if (!ignore) {
        if (localStorage.getItem("contacts")) {
          const contatos = localStorage.getItem("contacts");
          this.contacts = [...JSON.parse(contatos)];
          return;
        }
      }
      this.contacts = [];
      try {
        const response = await axios.get(`/contacts`);
        this.contacts = response.data;
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
      } catch (err) {
        throwError(err.response, this);
      }
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.createSchedule {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 500px;
  background-color: #e8ce56;
  box-shadow: 0 4px 4px 0px rgb(117, 116, 116);
  border: 1px solid rgb(197, 197, 197);
  padding: 15px;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

label {
  font-weight: 600;
  text-align: left;
}

.createSchedule button {
  background-color: white;
  border: 1px solid #645e5e;
  border-radius: 5px;
}

.list {
  overflow-y: scroll;
  max-height: 150px;
  text-align: left;
  border: 1px solid black
}
.bi-arrow-clockwise {
  cursor: pointer;
}
</style>
