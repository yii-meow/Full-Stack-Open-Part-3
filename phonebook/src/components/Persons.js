const Button = ({ deletePerson }) => {
    return <button onClick={deletePerson}>delete</button>
}

const Persons = ({ persons, filteredName, isFilter, deletePerson }) => {
    return (
        <div>
            {
                isFilter ?
                    filteredName.map(person => <div>{person.name} {person.number} <Button deletePerson={() => deletePerson(person.id)} /></div>)
                    :
                    persons.map(person => <div>{person.name} {person.number} <Button deletePerson={() => deletePerson(person.id)} /></div>)
            }
        </div >
    )
}

export default Persons