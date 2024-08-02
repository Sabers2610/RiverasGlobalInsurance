import { Model, DataTypes } from 'sequelize'
import { SEQUELIZE } from '../config/database/db.js'

export class ChangeHistory extends Model { } // creamos la clase sin parametros extra

ChangeHistory.init({
    changeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true},

    changeUserEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,},

    changeDateTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
    },

    changeDescription: {
        type: DataTypes.STRING(500),
        allowNull: false,
    }
},{

    sequelize: SEQUELIZE,
    modelName: "ChangeHistory"
})

ChangeHistory.syncTable = async () =>  {
    await ChangeHistory.sync()
}