require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Logging
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// Special logging format for post method
morgan.token('post_object', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return '';
})

// Logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_object'))

// Use Phonebook model in MongoDB
const Phonebook = require('./models/phonebook')

// PORT provided in env file
const PORT = process.env.PORT

// Display all the persons
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })
})

// Get a person data using its id
app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// List out the info
app.get('/info', (request, response) => {
  let length
  Phonebook.find({})
    .then(persons => {
      length = persons.length
    })
    .then(result =>
      response.send(`
        <div>
            Phonebook has info for ${length} people<br/>
            ${new Date()}
        </div>
    `))
})

// Create or update a person
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  // Missing name or number
  if (name === undefined || number === undefined) {
    return response.status(400).json({
      error: 'Missing content'
    })
  }

  Phonebook.find({}).then(persons => {
    let id = ""

    // If the name contains in the list, updated the phone number
    if (persons.find(person => {
      id = person.id
      return person.name === name
    }
    )) {
      Phonebook.findByIdAndUpdate(id, { name, number }, {
        new: true, runValidators: true, context: 'query'
      })
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
    }

    // Create a new person
    else {
      const person = new Phonebook({
        name,
        number
      })
      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
    }
  })
})

// Delete person by ID
app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Middleware for unknown end point
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Middleware for wrong id in MongoDB format provided
const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})