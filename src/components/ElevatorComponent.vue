<template>
    <!-- <h1>ЕДЕМ НА: {{ props.nextFloor }}</h1>
    <h1>НАХОДИМСЯ: {{ props.currentFloor}}</h1> -->
    <div class="elevator-floors" :style="floorsStyles">
        <div class="elevator-cabine" :style="elevatorMove" :class="restIndication">
            {{ status }}
            <img src="../assets/icons/up-svgrepo-com.svg" width="30px" height="30px" v-if="directionIndicator === 'up'">
            <img src="../assets/icons/down-svgrepo-com.svg" width="30px" height="30px" v-if="directionIndicator === 'down'">
        </div>
    </div>
    <!-- <button @click="console.log(elevatorStore.queueArr)">Массив очереди</button>
    <button @click="console.log(elevatorStore.queueArr[0])">первый в оечреди</button> -->
    
</template>

<script setup> 
import {computed, defineProps, ref} from 'vue';
import { useElevatorStore } from '@/stores/elevatorStore';

const elevatorStore = useElevatorStore()

const props = defineProps({
    id: Number,
    status: String,
    currentFloor: Number,
    nextFloor: Number
})

const floorsStyles = computed(()=>{
    const height = `height: ${elevatorStore.floorsCount *100}px`
    return height
})

const elevatorMove = computed(()=>{

    if(props.nextFloor){

        const transition = `margin-bottom ${Math.abs(props.nextFloor - props.currentFloor)}s ease`

        const marginBottom = `${20 + (props.nextFloor-1)*100}px`

        return { marginBottom, transition }
    }else if(props.nextFloor == 1){

        const marginBottom = `20px`

        const transition = `margin-bottom ${Math.abs(props.nextFloor - props.currentFloor)}s ease`

        return { marginBottom, transition }
    }else{
        const marginBottom = `${props.currentFloor-1*100}`
        const transition = `margin-bottom ${Math.abs(props.nextFloor - props.currentFloor)}s ease`

        return { marginBottom, transition }
    }
})

const restIndication = computed(()=>{
        return props.status === 'rest' ? 'rest' : ''
    })

const directionIndicator = computed(()=>{
    if(props.nextFloor === null){
        return ''
    }else if(props.currentFloor > props.nextFloor){
        return 'down'
    }else if(props.currentFloor < props.nextFloor){
        return 'up'
    }
})

</script>

<style>
    .elevator-floors{
        background-color: grey;
        width: 100px;
        /* margin-left: 100px;
        margin-top: 100px; */
        padding: 0 10px 0 10px;

        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    .elevator-cabine{
        width: 80px;
        height: 80px;
        background-color: rgb(59, 59, 59);
        /* margin-bottom: 20px; */
        color: wheat;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    .rest{
        animation: rest 3s ease-in-out 0s infinite;
    }
    @keyframes rest {
        0%{
            background-color: green;
        }
        25%{
            background-color: greenyellow;
        }
        50%{
            background-color: green;
        }
        75%{
            background-color: greenyellow;
        }
        100%{
            background-color: green;
        }
    }
</style>