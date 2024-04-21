import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'

export const useElevatorStore = defineStore('elevator', () => {
  
  const elevators = reactive([])
  const floors = reactive([])

  const elevatorsCount = ref(localStorage.getItem('elevatorsCount') ?? 1)
  const floorsCount = ref(localStorage.getItem('floorsCount') ?? 5)


  watch(elevatorsCount, setElevators(elevatorsCount.value))
  watch(floorsCount, setFloors(floorsCount.value))

  function saveToLocal(fieldName, value){
    localStorage.setItem(`${fieldName}`, value)
  }

  function setElevators(count){
    elevators.push(
      {
        id: count,
        currentFloor: 1,
        nextFloor: null,
        status: 'notMoving'
      }
    )
  }

  function setFloors(count){

  saveToLocal('floorsCount', floorsCount.value)

  let newFloors = []
    for(let i = 1; i <= count; i++){
      newFloors.push(i)
    }
    floors.value = newFloors
    
  }

  function toFloor(nextFloor, currentFloor, elevatorId) {
    elevators[elevatorId-1].nextFloor = nextFloor
    elevators[elevatorId-1].status = 'moving'
    
    setTimeout(()=>{
      elevators[elevatorId-1].currentFloor = nextFloor
      elevators[elevatorId-1].nextFloor = null
      elevators[elevatorId-1].status = 'notMoving'
    }, Math.abs(nextFloor - currentFloor)*1000)
  }

  return { elevators, floors, elevatorsCount, floorsCount, saveToLocal, toFloor, getFreeElevator }
})
