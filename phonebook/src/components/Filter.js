const Filter = ({ handleFilterNameChange }) => {
    return (
        <div>
            filter shown with <input onChange={handleFilterNameChange} />
        </div>
    )
}

export default Filter