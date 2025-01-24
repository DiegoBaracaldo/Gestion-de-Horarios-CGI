class FranjaRepo{
    constructor(bd){
        this.bd = bd;
    }

    GetAll(){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM franjas";
            this.bd.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }
}

module.exports = FranjaRepo;