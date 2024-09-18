import TopBar from "@components/TopBar"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"
import { useEffect, useState } from "react"
import AddUser from "./AddUser"
import addIcon from '@assets/add.png'
import copyIcon from '@assets/copy.png'
import checkbox from '@assets/checkbox.png'
import checkboxSelected from '@assets/checkbox_selected.png'
import { User } from "@lib/interfaces"
import ShowAccountUsers from "./ShowAccountUsers"

export default () => {
    const { role, addUser, token, accountId, setToast, createAccount, activity, apiKey, setPage, getAccountUsers } = useAppConfigStore(state => ({
        token: state.token,
        apiKey: state.apiKey,
        role: state.role,
        addUser: state.addUser,
        createAccount: state.createAccount,
        accountId: state.selectedAccount,
        setToast: state.setToast,
        activity: state.activity,
        setPage: state.setPage,
        getAccountUsers: state.getAccountUsers
    }))

    const [showAddAccount, addAccountDisplay] = useState(false)
    const [showAddUser, addUserDisplay] = useState(false)
    const [showKey, keyDisplayToggle] = useState(false)
    const [showUsers, usersDisplay] = useState(false)
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        setPage('manage')
    }, [])

    return <div>
        <TopBar title="Manage Account" />
        <AddAccount open={showAddAccount} onClose={() => addAccountDisplay(false)} createAccount={(accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, orderCategory, maxRadius) => {
            createAccount(token || '', accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, orderCategory, maxRadius, (success, message) => {
                if (success) {
                    setToast(message, 'success')
                    addAccountDisplay(false)
                } else {
                    setToast(message, 'error')
                }
            })
        }} loading={activity.createAccount} />
        <AddUser open={showAddUser} onClose={() => addUserDisplay(false)} addUser={(userName, phoneNumber, email, role) => {
            addUser(token || '', phoneNumber, userName, email, role, accountId || '', (success, message) => {
                if (success) {
                    setToast(message, 'success')
                    addUserDisplay(false)
                } else {
                    setToast(message, 'error')
                }
            })
        }} loading={activity.addUser} />
        <ShowAccountUsers open={showUsers} onClose={() => usersDisplay(false)} users={users}/>
        {/super_admin/.test(role || '') ? <div className="shadow-3xl m-3 rounded-lg border relative md:m-10 p-3 md:p-5">
            <p className="absolute left-2 top-1 font-medium text-lg">Create Account</p>
            <p className="mt-8 mb-16">Create new account</p>
            <div className="bg-sky-600 flex items-center px-4 py-2 cursor-pointer absolute right-3 bottom-3" onClick={() => addAccountDisplay(true)}>
                <img src={addIcon} className="w-6 mr-2" />
                <p className="text-md text-white">Create Account</p>
            </div>
        </div> : null}
        {/admin/.test(role || '') ? <div className="shadow-3xl m-3 rounded-lg border relative md:m-10 p-3 md:p-5">
            <p className="absolute left-2 top-1 font-medium text-lg">Add user</p>
            <p className="mt-8 mb-16">Add new user to account</p>
            <div className="bg-sky-600 flex items-center px-4 py-2 cursor-pointer absolute right-3 bottom-3" onClick={() => addUserDisplay(true)}>
                <img src={addIcon} className="w-6 mr-2" />
                <p className="text-md text-white">Add User</p>
            </div>
        </div> : null}
        <div className="shadow-3xl m-3 rounded-lg border relative md:m-10 p-3 md:p-5">
            <p className="absolute left-2 top-1 font-medium text-lg">View Users</p>
            <p className="my-8">List of users with access to the account.</p>
            <p className="text-center underline text-blue-700 font-semibold cursor-pointer" onClick={() => getAccountUsers(token || '', accountId || '', (users) => {
                if(users.length > 0) {
                    usersDisplay(true)
                    setUsers(users)
                }
            })}>View Users</p>
        </div>
        {apiKey ? <div className="shadow-3xl m-3 rounded-lg border relative md:m-10 p-3 md:p-5">
            <p className="absolute left-2 top-1 font-medium text-lg">API Key</p>
            <div className="mt-10 mb-6">
                <div className="flex items-center">
                    <input value={!showKey ? `${apiKey.substring(0, 5) + '* '.repeat(35) + apiKey.substring(apiKey.length - 5)}` : apiKey} readOnly className="border text-gray-500 outline-none hidden md:block px-3 py-2 rounded-lg text-sm md:w-[600px] lg:w-[650px]" />
                    <input value={!showKey ? `${apiKey.substring(0, 5) + '* '.repeat(15) + apiKey.substring(apiKey.length - 5)}` : apiKey} readOnly className="border text-gray-500 outline-none md:hidden w-[320px] px-3 py-2 rounded-lg text-sm" />
                    <img src={copyIcon} className="w-6 ml-2 cursor-pointer active:opacity-45" onClick={() => navigator.clipboard.writeText(apiKey)} />
                </div>
                <div className="flex items-center cursor-pointer mt-2 ml-2" onClick={() => {
                    keyDisplayToggle(!showKey)
                    setTimeout(() => {
                        keyDisplayToggle(false)
                    }, 10000)
                }}>
                    <img src={showKey ? checkboxSelected : checkbox} className="w-6 mr-2" />
                    <p className="text-sm">Show Key</p>
                </div>
            </div>
        </div> : null}
    </div>
}