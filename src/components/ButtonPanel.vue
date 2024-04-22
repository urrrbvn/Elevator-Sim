<template> 
    <div class="btn-panel" :style="panelHeight">
        <ButtonUI v-for="floor in elevatorStore.floors.value" 
                  :floor = floor
                  :class="buttonIndication"
        >
        </ButtonUI>
    </div>
</template>

<script setup>
import { useElevatorStore } from '@/stores/elevatorStore';
import {computed} from 'vue';
import ButtonUI from './UI/Button.vue'


const elevatorStore = useElevatorStore()

const panelHeight = computed(()=>{
    return `height: ${elevatorStore.floorsCount * 100}px`
})


</script>

<style scoped>
    .btn-panel{
        background-color: bisque;
        width: 100px;

        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
    }
</style>