<template>
  <Header></Header>
  <h1>{{ elevatorStore.getFreeElevator }}</h1>
  <div class="page-wrapper">
    <Elevator v-for="elevator in elevatorStore.elevators"
    :id = elevator.id
    :status = elevator.status
    :currentFloor = elevator.currentFloor
    :nextFloor = elevator.nextFloor
    ></Elevator>
    <ButtonPanel></ButtonPanel>
  </div>  
</template>

<script setup>
import Header from './components/Header.vue';
import Elevator from './components/ElevatorComponent.vue';
import ButtonPanel from './components/ButtonPanel.vue';

import { useElevatorStore } from './stores/elevatorStore';
import { onMounted } from 'vue';
const elevatorStore = useElevatorStore()

onMounted(()=>{
  console.log('Mount set');
  const startElevatorCount = parseInt(localStorage.getItem('elevatorsCount'))
  const startFloorsCount = parseInt(localStorage.getItem('floorsCount'))

  elevatorStore.setElevators(startElevatorCount)
  elevatorStore.setFloors(startFloorsCount)
  
})

</script>

<style>
  .page-wrapper{
    display: flex;
    gap: 10px;
    align-items: center;

    padding-left: 100px;
    padding-top: 100px;
  }
</style>