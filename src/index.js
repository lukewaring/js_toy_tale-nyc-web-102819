const addBtn = document.querySelector('#new-toy-btn')
const toyFormContainer = document.querySelector('.container')
const toyForm = document.querySelector('.add-toy-form')
const toyCollectionDiv = document.querySelector('#toy-collection')

let addToy = false

function getToys() {
  fetch('http://localhost:3000/toys')
    .then(function (response) { return response.json() })
    .then(function (toys) { 
      appendToys(toys)

      const likeBtns = document.querySelectorAll('.like-btn')
      const deleteBtns = document.querySelectorAll('.delete-btn')
      const editBtns = document.querySelectorAll('.edit-btn')

      likeBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.target.previousElementSibling.innerText = parseInt(e.target.previousElementSibling.innerText) + 1 + ' Likes'
          
          fetch(`http://localhost:3000/toys/${btn.dataset.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ likes: parseInt(e.target.previousElementSibling.innerText) })
          })
        })
      })

      deleteBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          fetch(`http://localhost:3000/toys/${btn.dataset.id}`, {
            method: 'DELETE'
          })
          .then(function (response) { return response.json() })
          .then(function (toy) {
            e.target.parentNode.remove()
          })
        })
      })

    })
}

function appendToys (toys) {
  toys.forEach(function (toy) {
    const singleToyDiv = document.createElement('div')
    singleToyDiv.setAttribute('class', 'card')
    singleToyDiv.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar"/>
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id=${toy.id}>Like <3</button>
      <button class="delete-btn" data-id=${toy.id}>Delete</button>
      <button class="edit-btn" data-id=${toy.id}>Edit</button>
    `
    toyCollectionDiv.appendChild(singleToyDiv)
  })
}

getToys()

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyFormContainer.style.display = 'block'

    toyForm.addEventListener('submit', function (e) {
      e.preventDefault()

      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          name: `${toyForm.name.value}`,
          image: `${toyForm.image.value}`,
          likes: 0
        })
      })

    const singleToyDiv = document.createElement('div')
    singleToyDiv.setAttribute('class', 'card')
    singleToyDiv.innerHTML = `
      <h2>${toyForm.name.value}</h2>
      <img src=${toyForm.image.value} class="toy-avatar"/>
      <p>0 Likes</p>
      <button class="like-btn">Like <3</button>
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    `
    toyCollectionDiv.appendChild(singleToyDiv)    

    toyForm.reset()
  })

  } else {
    toyFormContainer.style.display = 'none'
  }
})
