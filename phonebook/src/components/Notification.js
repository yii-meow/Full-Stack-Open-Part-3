const Notification = ({ message, errorType }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={errorType === "success" ? "success" : "fail"}>
            {message}
        </div>
    )
}

export default Notification