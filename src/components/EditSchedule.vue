<template>
  <div class="updateScheduleModal">
    <span id="infoMessage" v-if="this.infoMessage">{{ infoMessage }}</span>
    <input v-model="update.id" type="hidden" />
    <label>Titulo</label>
    <input type="text" v-model="update.title" />

    <label>Mensagem</label>
    <textarea v-model="update.message" id="message">
      </textarea>

    <label>Adicionar contatos</label>
    <input type="text" v-model="contact" placeholder="Digite aqui para pesquisar...">

    <div class="list">
      <div v-for="contact in filteredContacts" :key="contact.id">
        <input type="checkbox" :id="contact.id" v-model="selectedContacts" :value="contact">
        <label :for="contact.id">{{ contact.pushName }}</label>
      </div>
    </div>
    <i class="bi bi-arrow-clockwise" @click="listContacts('ignore')">
      Atualizar</i>
    <div class="contactList">
      <p><b>Contatos já selecionados neste agendamento</b></p>
      <hr>
      <p>Clique na caixa de seleção para removê-los do agendamento</p>
      <div v-for="contact in update.contacts" :key="contact.id">
        <input type="checkbox" :value="contact.name" v-model="selectedContactsToRemove" />
        {{ contact.name }}
      </div>
    </div>

    <label>Arquivo</label>
    <input type="file" @change="handleFile" />
    <p v-if="update.filePath && update.filePath !== 'null'">Arquivo selecionado: {{ update.filePath }}</p>

    <label>Data</label>
    <input v-model="update.normalDate" type="datetime-local" />

    <label>Recorrente?</label>
    <div style="margin-bottom: 15px;">
      <input type="radio" value="Sim" v-model="update.recurrent" />Sim
      <input type="radio" value="Não" v-model="update.recurrent" />Não
    </div>
    <label v-if="this.update.recurrent === 'Sim'">Recorrência em dias</label>
    <input v-if="this.update.recurrent === 'Sim'" type="number" v-model="this.update.recurrenceInDays"
      placeholder="A cada quantos dias será executado..">

    <div v-if="confirmExclude">
      <span>Deseja mesmo excluir este agendamento?</span><br />
      <button @click="excludeSchedule(this.update.id)">Sim</button>
      <button @click="confirmExclude = false">Não</button>
    </div>
    <button @click="confirmExclude = true" class="updateModalButton">
      Excluir
    </button>
    <button @click="updateSchedule" class="updateModalButton">Salvar</button>
    <button @click="this.$emit('close')" class="updateModalButton">
      Fechar
    </button>
  </div>
</template>

<script>
import axios from "axios";
import throwError from "@/functions/throwError";

export default {
  props: {
    schedule: {
      type: Object,
    },
  },
  data() {
    return {
      update: { ...this.schedule },
      contact: null,
      contacts: [],
      file: null,
      confirmExclude: false,
      infoMessage: null,
      selectedContacts: [],
      selectedContactsToRemove: []
    };
  },
  mounted() {
    this.listContacts();
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
    async updateSchedule() {

      if (!this.update.normalDate || !this.update.message) {
        return (this.infoMessage = "Por favor, preencha todos os campos.");
      }

      if (this.update.recurrent === 'Sim' && !this.update.recurrenceInDays) {
        return (this.infoMessage = "Por favor, defina o prazo de recorrência do agendamento")
      }

      try {
        const formData = new FormData();
        formData.append("id", this.update.id);
        formData.append("message", this.update.message);
        formData.append("title", this.update.title);
        formData.append("file", this.file);
        formData.append("oldFilePath", this.update.filePath);
        formData.append("recurrent", this.update.recurrent);
        formData.append("recurrenceInDays", this.update.recurrenceInDays);
        formData.append("contacts", JSON.stringify(this.selectedContacts));
        formData.append("removeList", JSON.stringify(this.selectedContactsToRemove));
        formData.append("date", this.update.normalDate);

        await axios.put("/schedule", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("save");
      } catch (err) {

        if (err.response.status === 400) {
          this.infoMessage = err.response.data
        }

        throwError(err.response, this);
      }
    },
    async excludeSchedule(id) {
      try {
        await axios.delete(`/schedule/${id}`);
        this.$emit("exclude");
      } catch (err) {
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
        const contatos = response.data;
        this.contacts = contatos;
        localStorage.setItem("contacts", JSON.stringify(contatos));
      } catch (err) {
        throwError(err.response, this);
      }
    },
    removeSelectedContacts() {
      this.update.contacts = this.update.contacts.filter(contact =>
        !this.selectedContactsToRemove.includes(contact.name)
      );
      this.selectedContactsToRemove = [];
    },
  },
};
</script>

<style scoped>
.updateScheduleModal {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 500px;
  background-color: #e8ce56;
  box-shadow: 0 4px 4px 0px rgb(117, 116, 116);
  padding: 25px;
  border: 1px solid rgb(197, 197, 197);
  border-radius: 10px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

label {
  font-weight: 600;
  text-align: left;
}

.updateModalButton {
  background-color: white;
  border: 1px solid #645e5e;
  border-radius: 5px;
  cursor: pointer;
}

.updateModalButton:hover {
  background-color: rgb(235, 229, 229);
}

.contactList {
  border: 1px solid black;
  border-radius: 3px;
  font-size: 0.8em;
  max-height: 125px;
  overflow-y: scroll;
  background-color: white;
  text-align: left;
  padding: 2px;
}

.contactList p {
  margin: 7px 0;
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