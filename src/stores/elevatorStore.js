import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'

export const useElevatorStore = defineStore('elevator', () => {
  
  // Elevators и Floors хранят массивы объектов с данными об этажах и лифтах

  const elevators = reactive([])
  const floors = reactive([])

  //Переменные count нужны для того, чтобы setElevators и setFloors могли ориентироваться на них, формируя массив с данными 

  const elevatorsCount = ref(parseInt(localStorage.getItem('elevatorsCount')) || 1)
  const floorsCount = ref(parseInt(localStorage.getItem('floorsCount')) || 5)

 //Очередь вызовов, сразу преобразована в массив, для удобства одбращения к первому элементу
  const floorQueue = reactive(new Set())
  const queueArr = computed(()=>{
    return Array.from(floorQueue)
  })
//Готовые обработать вызов лифты
  const freeElevators = computed(()=>{
    return elevators.filter(elevator => elevator.status === 'notMoving')
  })

// Наблюдение за изменениями различных данных и выполнение соответствующих действий.
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
  watch(elevators, ()=> saveToLocal('elevatorsData', JSON.stringify(elevators)))

  //Небольшой ряд фунций для простой работы с некоторыми состояниями
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
  function getElevatorsFromLocal(){
    let elevatorsData = JSON.parse(localStorage.getItem('elevatorsData'))
    if(elevatorsData){
      elevators.splice(0, elevators.length, ...elevatorsData)
    }
  }
  //Функция отвечает за масштабирование количества лифтов
  //Сравнивает счетчик кол-ва лифтов и длинну текущего массива лифтов, на основе изначального массива формирует новый массив и его значения подставляет в массив elevators
  function setElevators(count){
    // console.log('setElevator call', count);
    saveToLocal('elevatorsCount', count)
      const newElevatorArr = [...elevators]
      // console.log(newElevatorArr);
      if(newElevatorArr.length < 1){
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
        // console.log(newElevatorArr);
      }else if(newElevatorArr.length < count){
        const elevatorsToAdd = count - newElevatorArr.length
        for(let i = 0; i < elevatorsToAdd; i++){
          newElevatorArr.push(
            {
              id: newElevatorArr.length + 1,
              currentFloor: 1,
              nextFloor: null,
              status: 'notMoving'
            }
          )
        }
        console.log(newElevatorArr);
      }else if(newElevatorArr.length > count){
        const elevatorsToDelete = newElevatorArr.length - count
        for(let i =0; i < elevatorsToDelete; i++){
          newElevatorArr.pop() 
        }
        // console.log(newElevatorArr);
      }
      // console.log(newElevatorArr);
      elevators.splice(0, elevators.length, ...newElevatorArr)
      // console.log(elevators);
  }
  //Схожая функция для этажей
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
  //Функция возвращает id самого близкого лифта к этажу. На вход получает массив с лифтами и этаж к которому ищем ближайший лифт
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
    
    let closestElevator = freeElevatorsData.filter(elevator => elevator.path === closestWay)
    console.log(closestElevator);

    return closestElevator[0].id
  }

  //Функция отвечает за обработку очереди вызовов и вызывается в двух случаях: когда какой-то лифт стал свободным, и когда очередь вызовов пополняется (см строки 29 и 181)
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
  //Функция отвечает за цикл движения лифта (движение, отдых и готовность ехать дальше)
  //На вход принимает id лифта который должен поехать и этаж на кторый нужно поехать
  function toFloor(nextFloor, id) {
    if(elevators[id -1].currentFloor === nextFloor || elevators[id-1].status !== 'notMoving'){
      floors[nextFloor-1].status = 'notWaiting'
      return
    }

    elevators[id-1].nextFloor = nextFloor
    elevators[id-1].status = 'moving'
    
    setTimeout(()=>{
      elevators[id-1].currentFloor = nextFloor
      // saveToLocal(`elevator ${id} position`, nextFloor)
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
  
  return { elevators, floors, elevatorsCount, floorsCount, saveToLocal, toFloor, floorQueue, queueArr, countIncrement, countDecrement, setElevators, setFloors, freeElevators, getElevatorsFromLocal}
})
