const getNLActualDate = () => {
    // natural language full date
    const date = new Date()
    let fulldate = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    })
    let time = date.toTimeString()

    return `Hoy es ${fulldate} y son las ${time}\n`
}


export { getNLActualDate }