module.exports = function(sequelize, DataType){
    const Events = sequelize.define("Events", {
        eventname: {
            type: DataType.STRING,
            allowNull: false
        },
        eventdate: {
            type: DataType.STRING,
            allowNull: false,
            // validate: {
            //     isDate: true
            // }
        },
        eventtime: {
            type: DataType.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            }
        },
        FK_Wineryid:{
            type: DataType.STRING,
        },
        

    });
    // Events.associate = function(models){
    //     Events.belongsTo(models.Wineries,{
    //         foreignKey:{
    //             allowNull: false
    //         }
    //     });
    // };

    return Events;
};