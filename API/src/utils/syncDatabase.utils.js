import { User } from '../models/user.models.js'
import {UserType} from '../models/userType.models.js'


export async function syncTables() {
    try {
        await UserType.syncTable();
        await User.syncTable();
    } catch (error) {
        console.log(error)
    }
}