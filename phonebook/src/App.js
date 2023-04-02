import { useState, useEffect } from 'react'
import PersonForm from "./components/PersonForm"
import Filter from "./components/Filter"
import Persons from "./components/Persons"
import phonebooksService from './services/phonebooks'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredName, setFilteredName] = useState([])
  const [isFilter, setIsFilter] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorType, setErrorType] = useState("")

  // Initializing the data of persons
  useEffect(() => {
    phonebooksService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])

  // Filter name, with case insensitive
  const handleFilterNameChange = (event) => {
    // If value is typed in filter bar, then only show eligible name
    if (event.target.value !== "") {
      setIsFilter(true)
    }

    // Regex for any matching character
    let regex = new RegExp(event.target.value, "i")

    // Only return people who match regex
    setFilteredName(persons.filter(person => regex.test(person.name)))
  }

  // Submit Form and add person
  const handleForm = (event) => {
    event.preventDefault()

    // If person name is duplicated
    if (persons.find(p => p.name === newName)) {

      // Asking for confirmation, and replace phone no of the person
      if (window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) {
        // Find the person
        const personToUpdate = persons.find(p => p.name === newName)

        // Modify the person's phone no
        const modifiedPerson = { ...personToUpdate, number: newNumber }
        const personToUpdateId = personToUpdate.id

        phonebooksService
          .replacePhoneNo(personToUpdateId, modifiedPerson)
          .then(returnedPerson => {
            setErrorMessage(`Changed phone number to ${newNumber}`)
            setErrorType("success")
            setPersons(persons.map(p => p.id !== personToUpdateId ? p : returnedPerson))
          })
          // Error while updating phone no
          .catch(err => {
            setErrorType("fail")
            setErrorMessage(`Information of ${personToUpdate.name} has already been removed from server`)
          })
      }
    }
    else {
      // Add new person
      const newPerson = {
        "name": newName,
        'number': newNumber
      }

      phonebooksService
        .addPerson(newPerson)
        .then(createdPerson => {
          setErrorMessage(`Added ${newPerson.name}`)
          setErrorType("success")
          setPersons(persons.concat(createdPerson))
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setErrorType('fail')
        })
    }

    // Clear the message after 5 seconds
    setTimeout(() => {
      setErrorMessage("")
    }, 5000);

    setNewName("")
    setNewNumber("")
  }

  // Delete Person based on id
  const deletePerson = (id) => {
    const personName = persons.find(p => p.id === id).name

    if (window.confirm("Delete " + personName + " ?")) {
      phonebooksService
        .deletePerson(id)
        .then(deletedPerson => {
          setErrorMessage(`Deleted ${personName}`)
          setErrorType("success")
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(err => {
          console.log(err)
        })
    }
    // Clear the message after 5 seconds
    setTimeout(() => {
      setErrorMessage("")
    }, 5000);
  }

  // Handle Name Input Change
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Handle Phone No Input Change
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>

      <h2>Phonebook</h2>

      {/* Display Alert Message */}
      {errorMessage && <Notification message={errorMessage} errorType={errorType} />}

      <Filter handleFilterNameChange={handleFilterNameChange} />

      <PersonForm handleForm={handleForm} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons persons={persons} filteredName={filteredName} isFilter={isFilter} deletePerson={deletePerson} />

    </div>
  )
}

export default App