<template>
    <header>
        <h1>ELEVATOR SYSTEM</h1>
        <div class="control-panel">
            <button @click="plusElevator()">Добавить лифт</button>
            <button @click="plusFloor()">Добавить этаж</button>
            <button @click="minusElevator()">удалить лифт</button>
            <button @click="minusFloor()">удалить этаж</button>
        </div>
        <div class="data-panel">
            <p>кол-во этажей: {{ elevatorStore.floorsCount }}</p>
            <p>кол-во лифтов: {{ elevatorStore.elevatorsCount }}</p>
            <p>кол-во свободных лифтов: {{ elevatorStore.freeElevators.length }}</p>
        </div>
    </header>
</template>

<script setup>
import { useElevatorStore } from '@/stores/elevatorStore';

const elevatorStore = useElevatorStore()

function plusElevator(){
    elevatorStore.countIncrement('elevators')
}
function minusElevator(){
    elevatorStore.countDecrement('elevators')
}
function plusFloor(){
    elevatorStore.countIncrement('floors')
}
function minusFloor(){
    elevatorStore.countDecrement('floors')
}


</script>

<style>
    header{
        width: 100%;
        height: 150px;
        background-color: aqua;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 35px;
    }
    p{
        font-size: 24px;
    }
    .control-panel{
        display: grid;
        grid-template-columns: 75px 75px;
        grid-template-rows: 40px 40px;
        gap: 5px;
    }
</style>