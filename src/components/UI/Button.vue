<template>
    <div class="btn-container">
        <button @click="elevatorStore.toFloor(props.floor, elevatorStore.elevators[0].currentFloor ,1)">{{ floor }}</button>
    </div>
</template>

<script setup>
import {defineProps} from 'vue';
import { useElevatorStore } from '@/stores/elevatorStore';

const props = defineProps({
    floor: Number
})
const elevatorStore = useElevatorStore()

</script>

<style scoped>
    .btn-container{
        height: 100px;
        width: 100%;

        padding: 20px;
    }
    button{
        background-color: yellow;
        border: none;
        border-radius: 10px;
        height: 50px;
        width: 50px;
    }
</style>
