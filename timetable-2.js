const table = document.getElementById("main-table")
const tableRows = table.querySelectorAll("tr")

const fetchRequests = [
  fetch("./data/importance.json"),
  fetch("./data/links.json"),
  fetch("./data/time.json")
]

// Функція для обчислення поточного тижня року
function getCurrentWeek() {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
}

// Отримуємо поточний тиждень
const currentWeek = getCurrentWeek();

// Визначаємо, який файл з розкладом завантажувати в залежності від поточного тижня
const timetableFile = `./data/timetable-2-${(currentWeek - 1) % 4}.json`;

const fetchWithDynamicTimetable = [
  ...fetchRequests,
  fetch(timetableFile)
];

Promise.all(fetchWithDynamicTimetable)
  .then(response => {
    return Promise.all(response.map(response => response.json()))
  })
  .then(data => {
    updateTable(data)
  })
  .catch(error => {
    alert(`Error: ${error}`)
  })

function updateTable(data) {
  const dataImportance = data[0]
  const dataLinks = data[1]
  const dataTime = data[2]
  const dataTimetable = data[3]

  for (const [day, subjects] of Object.entries(dataTimetable)) {
    let counter = 1
    subjects.forEach(subject => {
      const cell = document.createElement("td")
      cell.classList.add(`imp-lvl-${dataImportance[subject]}`)

      const link = document.createElement("a")
      link.href = dataLinks[subject]
      link.target = "_blank"
      link.innerText = subject

      cell.appendChild(link)

      tableRows[counter].appendChild(cell)
      counter++
    })
  }

  for (let i = 1; i < 9; i++) {
    const cell = document.createElement("td")
    cell.innerText = i
    cell.classList.add("text-center")
    tableRows[i].appendChild(cell)
  }

  for (const [number, time] of Object.entries(dataTime)) {
    const startCell = document.createElement("td")
    startCell.innerText = `${time.start.hour}:${time.start.minute}`
    startCell.classList.add("text-center")
    tableRows[number].appendChild(startCell)

    const endCell = document.createElement("td")
    endCell.innerText = `${time.end.hour}:${time.end.minute}`
    endCell.classList.add("text-center")
    tableRows[number].appendChild(endCell)
  }
}
