<template>
  <HeaderComponent
    @scheduleCreated="this.listSchedules()"
  />
  <hr />
  <div class="list">
    <div class="cardSchedule" v-for="schedule of schedules" :key="schedule.id">
      <div>
        <span id="marked" v-if="schedule.message === 'Agendamento para testes automatizados'"></span>
        <p><b>Titulo: </b>{{ schedule.title }}</p>
        <p><b>Mensagem: </b>{{ schedule.message }}</p>
        <p><b>Contato(s): </b></p>
        <div class="contactList">
          <p v-for="contact of schedule.contacts" :key="contact.id">{{ contact.name }}</p>
        </div>
        <p><b>Data:</b> {{ schedule.date }}</p>
      </div>
      <i class="bi bi-pencil-fill" @click="editSchedule(schedule)" id="editSchedule" ></i>
      <i class="bi bi-copy" @click="duplicateSchedule(schedule)" id="duplicateSchedule" ></i>
    </div>

    <EditSchedule
      :schedule="updateFieldsSchedule"
      v-if="ViewUpdateSchedule"
      @close="ViewUpdateSchedule = false"
      @save="updateEvent"
      @exclude="excludeEvent"
    />
  </div>
</template>

<script>
import EditSchedule from "@/components/EditSchedule";
import HeaderComponent from "@/components/HeaderComponent.vue";
import throwError from "@/functions/throwError";
import axios from "axios";

export default {
  name: "ListView",
  components: {
    EditSchedule,
    HeaderComponent,
  },
  data() {
    return {
      schedules: [],
      updateFieldsSchedule: null,
      ViewUpdateSchedule: false,
    };
  },
  async mounted() {
    await this.listSchedules();
  },
  methods: {
    async listSchedules() {
      try {
        const response = await axios.get("/schedule");
        this.schedules = response.data;
      } catch (err) {
        throwError(err.response, this);
      }
    },
    editSchedule(schedule) {
      this.updateFieldsSchedule = schedule;
      this.ViewUpdateSchedule = true;
    },
    duplicateSchedule(schedule) {
      if(confirm("Deseja duplicar este registro?")){
        try{
          axios.post('/duplicate/schedule', schedule).then(response => {
            if(response.data.success){
              window.location.reload()
            }
          })
        } catch (err){
          throwError(err.response, this);
        }
      }
    },
    updateEvent() {
      this.listSchedules();
      this.ViewUpdateSchedule = false;
    },
    excludeEvent() {
      this.listSchedules();
      this.ViewUpdateSchedule = false;
    },
  },
};
</script>
<style scoped>
* {
  font-family: "Plus Jakarta Sans", sans-serif;
}

.list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cardSchedule {
  display: flex;
  gap: 15px;
  text-align: left;
  width: 300px;
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 4px 4px 0px rgb(223, 219, 219);
  position: relative;
}
.cardSchedule p {
  margin: 7px;
}
.cardSchedule .logo {
  width: 70px;
  object-fit: contain;
}
.cardSchedule .shape {
  position: absolute;
  right: 0;
  bottom: 0;
}

label {
  font-weight: 600;
  text-align: left;
}
.updateModalButton {
  background-color: white;
  border: 1px solid #645e5e;
  border-radius: 5px;
}
.contactList {
  border: 1px solid black;
  border-radius: 3px;
  font-size: 0.8em;
  max-height: 125px;
  overflow-y: scroll;
}

</style>
