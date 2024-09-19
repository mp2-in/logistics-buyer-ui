import TopBar from "@components/TopBar"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"
import { useEffect, useState } from "react"
import AddUser from "./AddUser"
import addIcon from '@assets/add.png'
import editIcon from '@assets/edit.png'
import copyIcon from '@assets/copy.png'
import checkbox from '@assets/checkbox.png'
import checkboxSelected from '@assets/checkbox_selected.png'
import { User } from "@lib/interfaces"

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
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        setPage('manage')
        getAccountUsers(token || '', accountId || '', (users) => {
            if (users.length > 0) {
                setUsers(users)
            }
        })
    }, [])

    return <div>
        <TopBar title="Manage Account" onAccountSwitch={(newToken, accountId) => {
            getAccountUsers(newToken || '', accountId || '', (users) => {
                setUsers(users)
            })
        }} />
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
        <div className="absolute top-14 bottom-2 left-1 right-1 md:top-20 *:my-2 overflow-auto">
            <div className="flex items-center flex-col *:w-full md:w-[650px] lg:w-[900px] md:*:my-3 *:my-1 px-1 mx-auto">
                <div className="border rounded-xl bg-gray-50">
                    {/super_admin/.test(role || '') ? <div className="flex items-center p-4 active:bg-white rounded-t-xl cursor-pointer" onClick={() => addAccountDisplay(true)}>
                        <div className="bg-blue-500 rounded-full mr-3">
                            <img src={addIcon} className="w-8" />
                        </div>
                        <div>
                            <p className="font-medium">Create Account</p>
                            <p className="text-xs">Create new account</p>
                        </div>
                    </div> : null}
                    {/admin/.test(role || '') ? <div className="flex items-center p-4  rounded-b-xl opacity-25">
                        <div className="bg-blue-500 rounded-full mr-3 p-1">
                            <img src={editIcon} className="w-6" />
                        </div>
                        <div>
                            <p className="font-medium">Edit Config</p>
                            <p className="text-xs">Edit account level configuration</p>
                        </div>
                    </div> : null}
                </div>
                <div className={'relative shadow-3xl rounded-xl py-4 px-2'}>
                    <p className="absolute left-4 top-2 font-semibold">Users</p>
                    <div className="bg-blue-500 rounded-full mr-3 absolute right-1 top-2 cursor-pointer" onClick={() => addUserDisplay(true)}>
                        <img src={addIcon} className="w-8" />
                    </div>
                    <div className={'md:text-base text-xs mt-10 max-h-[400px]  overflow-auto'}>
                        <div className={`flex items-center py-[5px] px-[12px] bg-gray-200 md:rounded-tl-lg md:rounded-tr-lg  *:font-semibold *:px-[10px] justify-between rounded-t-xl w-[600px] sm:w-full`}>
                            <p className="flex-[2]">Phone</p>
                            <p className="flex-[3]">Name</p>
                            <p className="flex-[3]">Email</p>
                            <p className="flex-[2] text-center">Role</p>
                        </div>
                        <div className={'flex flex-col'}>
                            {users.map(e => {
                                return <div key={e.phoneNumber} className="flex items-center sm:w-full py-[5px] px-[10px] border-b md:border-l md:border-r text-xs md:text-sm relative *:px-[10px] justify-between w-[600px]">
                                    <p className="flex-[2]">{e.phoneNumber}</p>
                                    <p className="flex-[3]">{e.username}</p>
                                    <p className="flex-[3]">{e.mailId}</p>
                                    <p className="flex-[2] text-center">{e.role}</p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                {apiKey ? <div className="shadow-3xl rounded-lg border relative p-3 md:p-5">
                    <p className="absolute left-4 top-2 font-semibold">API Key</p>
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
        </div>
    </div>
}