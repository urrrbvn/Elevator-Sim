import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'

export const useElevatorStore = defineStore('elevator', () => {
  
  const elevators = reactive([])
  const floors = reactive([])

  const elevatorsCount = ref(localStorage.getItem('elevatorsCount') ?? 1)
  const floorsCount = ref(localStorage.getItem('floorsCount') ?? 5)


  const floorQueue = reactive(new Set())
  const queueArr = computed(()=>{
    return Array.from(floorQueue)
  })

  const freeElevators = computed(()=>{
    let freeElevatorsIds = []
    elevators.forEach(elevator => {
      if(elevator.status === 'notMoving'){
        freeElevatorsIds.push(elevator.id)
      }
    })
    return freeElevatorsIds
  })


  watch(elevatorsCount, setElevators(elevatorsCount.value))
  watch(floorsCount, setFloors(floorsCount.value))

  watch(queueArr, ()=>{
    if(queueArr.value.length > 0){
      queueArr.value.forEach(elem =>{
        floors.value[elem-1].status = 'waiting'
      })
      handleQueue()
    }
  })

  function saveToLocal(fieldName, value){
    localStorage.setItem(`${fieldName}`, value)
  }

  function setElevators(count){
    saveToLocal('elevatorsCount', count)
    for(let i = 0; i < count; i++){
      elevators.push(
        {
          id: i+1,
          currentFloor: 1,
          nextFloor: null,
          status: 'notMoving'
        }
      )
    }
  }

  function setFloors(count){

  saveToLocal('floorsCount', count)

  let newFloors = []
    for(let i = 0; i < count; i++){
      newFloors.push(
        {
          id: i+1,
          status: 'notWaiting'
        }
      )
    }
    floors.value = newFloors
    
  }

  function handleQueue(){
    const nextFloor = queueArr.value[0]

    if(nextFloor){
      const freeElevatorsIds = freeElevators.value

      if(freeElevatorsIds.length > 0){

        const freeElevatorId = freeElevatorsIds[0]
        toFloor(nextFloor, freeElevatorId)
        floorQueue.delete(nextFloor)
      }
    }
  }

  function toFloor(nextFloor, id) {
    if(elevators[id -1].currentFloor === nextFloor || elevators[id-1].status !== 'notMoving'){
      floors.value[nextFloor-1].status = 'notWaiting'
      return
    }

    elevators[id-1].nextFloor = nextFloor
    elevators[id-1].status = 'moving'
    
    setTimeout(()=>{
      elevators[id-1].currentFloor = nextFloor
      elevators[id-1].nextFloor = null
      elevators[id-1].status = 'rest'
      floorQueue.delete(nextFloor)
      floors.value[nextFloor-1].status = 'notWaiting'
      setTimeout(()=>{
        elevators[id-1].status = 'notMoving'
        handleQueue()
      }, 3000)
    }, Math.abs(nextFloor - elevators[id-1].currentFloor)*1000)
  }
  
  return { elevators, floors, elevatorsCount, floorsCount, saveToLocal, toFloor, floorQueue, queueArr}
})
