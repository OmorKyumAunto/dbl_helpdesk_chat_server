const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/employee');
const moment = require("moment");
const isEmpty = require("is-empty");
const e = require('express');





let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByExistsEmployee = async(employee_id = "") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByEmployee(), [employee_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




let getList = async (offset, limit, key,unit,type) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getList(offset, limit, key,unit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

  let getTotalList = async (key, unit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalList(key, unit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
   

  
  let getList22 = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalList(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getDataByEmployeeId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getDataByEmployeeId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let me = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.me(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}









let getByArtistId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByArtistId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let updateById = async (id = 0, data = {}) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.updateById(), [data, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}


// update
let updateByAlbum = (id = 0, updateData = {}, addedArr = [], deletedArr = [], conn = undefined) => {

    return new Promise((resolve, reject) => {
        connectionDblystem.getConnection((err, conn) => {
            conn.beginTransaction(async(error) => {
                if (error) {
                    return conn.rollback(() => {
                        conn.release();
                        resolve([]);
                    });
                }

                let result;

                if (Object.keys(updateData).length > 0) {
                    const keysOfUpdateData = Object.keys(updateData);
                    const dataParameterUpdateData = keysOfUpdateData.map((key) => updateData[key]);
                
                    result = await new Promise((resolve, reject) => {
                
                        const updatedDataObject = keysOfUpdateData.reduce((acc, key, index) => {
                            acc[key] = dataParameterUpdateData[index];
                            return acc;
                        }, {});
                
                        conn.query(
                            queries.updateByAlbum(), [updatedDataObject,id],
                            (error, result, fields) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                    });
                }

                // Set status to 0 for deletedArr
                for (let i = 0; i < deletedArr.length; i++) {
                    let updateData = {
                        album_id: id,
                        status: 0
                    }

                    let deleteTestId = await albumWiseArtistModel.updateById(deletedArr[i].id, updateData,
                        conn
                    );


                    if (
                        isEmpty(deleteTestId) ||
                        deleteTestId.affectedRows === undefined ||
                        deleteTestId.affectedRows < 1
                    ) {

                        return conn.rollback(() => {
                            conn.release();
                            resolve([]);
                        });
                    }

                }


                // Set status to 1 for addedArr
                for (let index = 0; index < addedArr.length; index++) {
                    let addData = {
                        album_id: id,
                        artist_id: addedArr[index],
                        status: 1
                    }
                    let addTestId = await albumWiseArtistModel.addNew(addData, conn);


                    if (
                        isEmpty(addTestId) ||
                        addTestId.affectedRows === undefined ||
                        addTestId.affectedRows < 1
                    ) {
                        return conn.rollback(() => {
                            conn.release();
                            resolve([]);
                        });
                    }
                }

                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            conn.release();
                            resolve([]);
                        });
                    }

                    conn.release();
                    return resolve(result);
                });
            });
        });
    });
};


let getArtistListByAlbumId = async (artist_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getArtistListByAlbumId(), [artist_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
   addNew,
   getByExistsEmployee,
   getList,
   getById,
   updateById,
   getByArtistId,
   updateByAlbum,
   getArtistListByAlbumId,
   me,
   getList22,
   getTotalList,
   getDataByEmployeeId
   
  
}