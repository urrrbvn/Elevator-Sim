import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'

export const useElevatorStore = defineStore('elevator', () => {
  
  const elevators = reactive([])
  const floors = reactive([])

  const elevatorsCount = ref(parseInt(localStorage.getItem('elevatorsCount')) ?? 1)
  const floorsCount = ref(parseInt(localStorage.getItem('floorsCount')) ?? 5)


  const floorQueue = reactive(new Set())
  const queueArr = computed(()=>{
    return Array.from(floorQueue)
  })

  const freeElevators = computed(()=>{
    // let freeElevatorsIds = []
    // elevators.forEach(elevator => {
    //   if(elevator.status === 'notMoving'){
    //     freeElevatorsIds.push(elevator.id)
    //   }
    // })
    // return freeElevatorsIds
    return elevators.filter(elevator => elevator.status === 'notMoving')
  })


  watch(elevatorsCount, ()=>setElevators(elevatorsCount.value))
  watch(floorsCount, ()=>setFloors(floorsCount.value))

  watch(queueArr, ()=>{
    if(queueArr.value.length > 0){
      queueArr.value.forEach(elem =>{
        floors[elem-1].status = 'waiting'
      })
      handleQueue()
    }
  })

  function countIncrement(countName){
    if(countName === 'elevators'){
      elevatorsCount.value++
    }
    if(countName === 'floors'){
      floorsCount.value++
    }
  }
  function countDecrement(countName){
    if(countName === 'elevators'){
      elevatorsCount.value = +elevatorsCount.value - 1
    }
    if(countName === 'floors'){
      floorsCount.value = +floorsCount.value - 1
    }
  }

  function saveToLocal(fieldName, value){
    localStorage.setItem(`${fieldName}`, value)
  }

  function setElevators(count){
    console.log('setElevator call', count);
    saveToLocal('elevatorsCount', count)
      const newElevatorArr = []
      for(let i = 0; i < (count); i++){
        newElevatorArr.push(
          {
            id: i+1,
            currentFloor: 1,
            nextFloor: null,
            status: 'notMoving'
          }
        )
      }
      elevators.splice(0, elevators.length, ...newElevatorArr)
      console.log(elevators.value);
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
    floors.splice(0, floors.length, ...newFloors)
    
  }

  function findClosestElevator(arr, nextFloor){
    let freeElevatorsData = []
    let differences = []
    let closestWay = 0
    arr.forEach(elevator => {
      freeElevatorsData.push(
        {
          id:elevator.id,
          path: Math.abs(nextFloor - elevator.currentFloor)
        }
      )
      differences.push(Math.abs(nextFloor - elevator.currentFloor))
    })
    closestWay = Math.min(...differences)
    console.log(freeElevatorsData);
    // console.log(differences);
    console.log(closestWay);
    
    let closestElevator = freeElevatorsData.filter(elevator => elevator.path === closestWay)
    console.log(closestElevator);
    // if(closestElevator.length != 1){
    //   return closestElevator[0].id
    // }else{
    //   return closestElevator[0].id
    // }
    return closestElevator[0].id
  }


  function handleQueue(){
    const nextFloor = queueArr.value[0]

    if(nextFloor){
      const freeElevatorsIds = freeElevators.value

      if(freeElevatorsIds.length > 0){

        const closestElevator = findClosestElevator(freeElevators.value, nextFloor)
        console.log(closestElevator);
        toFloor(nextFloor, closestElevator)
        floorQueue.delete(nextFloor)
      }
    }
  }

  function toFloor(nextFloor, id) {
    if(elevators[id -1].currentFloor === nextFloor || elevators[id-1].status !== 'notMoving'){
      floors[nextFloor-1].status = 'notWaiting'
      return
    }

    elevators[id-1].nextFloor = nextFloor
    elevators[id-1].status = 'moving'
    
    setTimeout(()=>{
      elevators[id-1].currentFloor = nextFloor
      elevators[id-1].nextFloor = null
      elevators[id-1].status = 'rest'
      floorQueue.delete(nextFloor)
      floors[nextFloor-1].status = 'notWaiting'
      setTimeout(()=>{
        elevators[id-1].status = 'notMoving'
        handleQueue()
      }, 3000)
    }, Math.abs(nextFloor - elevators[id-1].currentFloor)*1000)
  }
  
  return { elevators, floors, elevatorsCount, floorsCount, saveToLocal, toFloor, floorQueue, queueArr, countIncrement, countDecrement, setElevators, setFloors, freeElevators}
})
