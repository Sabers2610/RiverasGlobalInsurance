import { Model, DataTypes } from 'sequelize'
import {SEQUELIZE} from '../config/database/db.js'
import { UserType } from './userType.models.js'
import bcrypt from 'bcrypt'

export class User extends Model {
    // modificamos el metodo de la clase Model del toJson() para eliminar la contraseña del query
    toJSON() {
        let attributes = Object.assign({}, this.get());
        delete attributes.userPassword; // Excluir el campo userPassword
        return attributes;
    }
}

User.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    
    userEnabled:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    },

    userFirstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            is: /^[A-Za-z]+$/i,
            notEmpty: {
                msg: "Please enter a valid first name"
            },
            notNull: {
                msg: "Please enter a valid first name"
            }
        }
    },
    userLastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            is: /^[A-Za-z]+$/i,
            notEmpty: {
                msg: "Please enter a valid last name"
            },
            notNull: {
                msg: "Please enter a valid last name"
            }
        }
    },
    userBirthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: {
                msg: "Please enter a valid last name"
            },
            notNull: {
                msg: "Please enter a valid birthdate"
            },
            isAdult(value) {
                const TODAY = new Date()
                const LOWERLIMIT = new Date().setFullYear(TODAY.getFullYear - 65)
                const UPPERLIMIT = new Date().setFullYear(TODAY.getFullYear - 16)

                if (value < LOWERLIMIT || value > UPPERLIMIT) {
                    throw new Error("The worker must be adult")
                }
            }
        }
    },
    userAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        notEmpty: {
            msg: "Please enter a valid last name"
        },
        validate: {
            notNull: {
                msg: "Please enter a valid address"
            },
        }
    },
    userPhone: {
        type: DataTypes.STRING(18),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Please enter a valid last name"
            },
            notNull: {
                msg: "Please enter a valid phone number"
            }
        }
    },
    userEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Please enter a valid last name"
            },
            notNull: {
                msg: "Please enter a valid email"
            },
            isEmail: true
        }
    },
    userPassword: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please enter a valid password"
            }
        }
    }
}, {
    sequelize: SEQUELIZE,
    modelName: "User",
    hooks: {
        beforeSave: async (user, options) => {
            const HASHPASSWORD = await bcrypt.hash(user.userPassword, 10)
            user.userPassword = HASHPASSWORD
        }
    }
})

UserType.hasMany(User, {
    foreignKey: {
        name: 'userTypeId',
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

User.belongsTo(UserType, {
    foreignKey: "userTypeId",
    as: "UserType"
})

User.syncTable = async () => {
    await User.sync()
}