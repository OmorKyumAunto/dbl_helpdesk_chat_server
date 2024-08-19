const { connectionMusicLibrarySystemMYSQL } = require('../connections/connection');
const queries = require('../queries/song');
const moment = require("moment");
const isEmpty = require("is-empty");


let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getByTitle = async(title = "") => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.getByTitle(), [title], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getList = async () => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.getList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getByArtistId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.getByArtistId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let updateById = async (id = 0, data = {}) => {
    return new Promise((resolve, reject) => {
        connectionMusicLibrarySystemMYSQL.query(queries.updateById(), [data, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}





module.exports = {
   addNew,
   getByTitle,
   getList,
   getById,
   updateById,
   getByArtistId
     
  
}