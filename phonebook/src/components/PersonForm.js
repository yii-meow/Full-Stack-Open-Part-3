const PersonForm = ({ handleForm, newName, newNumber,
    handleNameChange, handleNumberChange }) => {
    return (
        <div>
            <form onSubmit={handleForm}>

                <h1>add a new</h1>

                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>

                <div>
                    number: <input value={newNumber} onChange={handleNumberChange} />
                </div>

                <div>
                    <button type="submit">add</button>
                </div>

            </form>
        </div>
    )
}

export default PersonForm