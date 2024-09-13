const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/asset');
const moment = require("moment");
const isEmpty = require("is-empty");
const e = require('express');
const assetAssignModel = require('../models/asset-assign');

let addNew = async (reqData = {}, assignData = {}) => {

    return new Promise((resolve, reject) => {
        connectionDblystem.getConnection(async (err, conn) => {
            if (err) {
                console.error("Connection Error:", err);
                return reject(err);
            }

            try {
                await conn.beginTransaction();

                // Destructuring result correctly
                const [result] = await conn.query(queries.addNew(), [reqData]);

            

        

                let finalResult = result;

                const current_date = new Date();
                const current_time = moment(current_date).format("YYYY-MM-DD HH:mm:ss");
                const created_at = current_time;

                const assetdata = {
                    asset_id: finalResult.insertId,
                    employee_id: assignData.employee_id,
                    unit_name: assignData.unit_name,
                    assign_date: assignData.assign_date,
                    created_at: created_at
                };
  

                const assetData = await assetAssignModel.addNew(assetdata, conn);

                await conn.commit();
                conn.release();
                resolve(finalResult);

            } catch (error) {
                console.error("Error during transaction:", error);
                await conn.rollback();
                conn.release();
                resolve([]);
            }
        });
    });
};




let addNew2 = async (info) => {
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
      connectionDblystem.query(queries.getList(offset, limit, key,unit,type), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  


let getTotalList = async (key, unit, type) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalList(key, unit, type), (error, result, fields) => {
        if (error) reject(error)
        else resolve(result);
      });
  });
}
  


  let distributedAssetList = async (offset, limit, key, unit ,type) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.distributedAssetList(offset, limit, key, unit,type), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  
  let distributedAssetTotalList = async (key, unit,type) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.distributedTotalAssetList(key, unit,type), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

let getLastData = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getLastData(), (error, result, fields) => {
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

let getDuplicateSerialNumber = async (serial_number = 0) => {
  return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getDuplicateSerialNumber(), [serial_number], (error, result, fields) => {
          if (error) reject(error)
          else resolve(result)
      });
  });
}



let getByEmployeeId = async (id = 0) => {
  return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getByEmployeeId(), [id], (error, result, fields) => {
          if (error) reject(error)
          else resolve(result)
      });
  });
}


let getByIdAssign = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByIdAssign(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAssetList = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(queries.getAssetList(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}





let getListOfDashboard = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListOfDashboard(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  let getListOfDashboard2 = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListOfDashboard2(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  let getListOfDashboard3 = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListOfDashboard3(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  
  


  let getListOfDashboardGraph = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListOfDashboardGraph(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
  

  let getListOfDashboardGraph2 = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListOfDashboardGraph2(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
  




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



let laptopCountData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(queries.laptopCountData(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

let desktopCountData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(queries.desktopCountData(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}



let printerCountData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(queries.printerCountData(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}


let accessoriesCountData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(queries.accessoriesCountData(), (error, result, fields) => {
      if (error) reject(error);
      else resolve(result);
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
   addNew2,
   getLastData,
   distributedAssetList,
   getByIdAssign,
   getListOfDashboard,
   getListOfDashboard2,
   getListOfDashboard3,
   getListOfDashboardGraph,
   getListOfDashboardGraph2,
   getTotalList,
   distributedAssetTotalList,
   getByEmployeeId,
   laptopCountData,
   printerCountData,
   desktopCountData,
   accessoriesCountData,
   getAssetList,
   getDuplicateSerialNumber
   
   
  
}