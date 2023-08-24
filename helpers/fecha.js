const fechaActual = () => {
    let date = new Date()
    console.log(date);
    let day = `${(date.getDate())}`.padStart(2, '0');
    let month = `${(date.getMonth() + 1)}`.padStart(2, '0');
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
}


module.exports = fechaActual;