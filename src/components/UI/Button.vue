<template>
    <div class="btn-container">
        <button @click="floorHandler()">{{ floor.id }}</button>
    </div>
</template>

<script setup>
import {defineProps} from 'vue';
import { useElevatorStore } from '@/stores/elevatorStore';

const props = defineProps({
    floor: Object
})
const elevatorStore = useElevatorStore()

function floorHandler() {
    elevatorStore.floorQueue.add(props.floor.id)
}

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
