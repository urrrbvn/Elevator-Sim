<template>
    <div class="btn-container">
        <button @click="floorHandler()"
                :class="buttonIndication"        
        >{{ floor.id }}
        </button>
    </div>
</template>

<script setup>
import {defineProps, computed} from 'vue';
import { useElevatorStore } from '@/stores/elevatorStore';

const props = defineProps({
    floor: Object
})
const elevatorStore = useElevatorStore()
//Добавляем этаж в очередь вызовов
function floorHandler() {
    elevatorStore.floorQueue.add(props.floor.id)
}
//Индикация ожидания лифта на этаже
const buttonIndication = computed(()=>{
    return props.floor.status === 'waiting' ? 'waiting' : ''
})

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
    .waiting{
        background-color: red;
    }
</style>
