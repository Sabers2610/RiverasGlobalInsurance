import { User } from '../models/user.model.js'
import { UserType } from '../models/userType.model.js'
import { ChangeHistory } from '../models/changeHistory.model.js'



export async function syncTables() {
    try {
        await UserType.syncTable();
        await User.syncTable();
        await ChangeHistory.syncTable();
    } catch (error) {
        console.log(error)
    }
}