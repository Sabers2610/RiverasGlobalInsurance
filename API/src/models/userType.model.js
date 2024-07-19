import { Model, DataTypes } from 'sequelize'
import {SEQUELIZE} from '../config/database/db.js'

export class UserType extends Model { }

UserType.init({
    userTypeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    userTypeName: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    }
}, {
    sequelize: SEQUELIZE,
    modelName: "UserType"
})

UserType.syncTable = async () => {
    await UserType.sync()
}