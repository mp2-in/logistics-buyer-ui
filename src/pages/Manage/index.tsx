import TopBar from "@components/TopBar"
import { useAppConfigStore } from "stores/appConfig"
import AddAccount from "./AddAccount"
import { useState } from "react"
import AddUser from "./AddUser"
import addIcon from '@assets/add.png'
import copyIcon from '@assets/copy.png'
import checkbox from '@assets/checkbox.png'
import checkboxSelected from '@assets/checkbox_selected.png'

export default () => {
    const { role, addUser, token, accountId, setToast, createAccount, activity, apiKey } = useAppConfigStore(state => ({
        token: state.token,
        apiKey: state.apiKey,
        role: state.role,
        addUser: state.addUser,
        createAccount: state.createAccount,
        accountId: state.selectedAccount,
        setToast: state.setToast,
        activity: state.activity
    }))

    const [showAddAccount, addAccountDisplay] = useState(false)
    const [showAddUser, addUserDisplay] = useState(false)
    const [showKey, keyDisplayToggle] = useState(false)

    return <div>
        <TopBar title="Manage Account" />
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5  w-[350px] md:w-[650px] lg:w-[850px] mx-auto border my-20 *:m-5 md:my-40 md:py-10`}>
            {/super_admin/.test(role || '') ? <div className="bg-blue-500 flex items-center px-10 py-2 rounded-lg cursor-pointer" onClick={() => addAccountDisplay(true)}>
                <img src={addIcon} className="w-8 mr-5" />
                <p className="text-[18px] text-white">Add Account</p>
            </div> : null}
            {/admin/.test(role || '') ? <div className="bg-blue-500 flex items-center px-10 py-2 rounded-lg cursor-pointer" onClick={() => addUserDisplay(true)}>
                <img src={addIcon} className="w-8 mr-5" />
                <p className="text-[18px] text-white">Add User</p>
            </div> : null}
            {apiKey?<div>
                <p className="font-medium ml-2">Api Key:</p>
                <div className="flex items-center">
                    <input value={!showKey?`${apiKey.substring(0,5)+'* '.repeat(35)+apiKey.substring(apiKey.length-5)}`:apiKey} readOnly className="border text-gray-500 outline-none hidden md:block px-3 py-2 rounded-lg text-sm md:w-[600px] lg:w-[650px]" />
                    <input value={!showKey?`${apiKey.substring(0,5)+'* '.repeat(15)+apiKey.substring(apiKey.length-5)}`:apiKey} readOnly className="border text-gray-500 outline-none md:hidden w-[320px] px-3 py-2 rounded-lg text-sm" />
                    <img src={copyIcon} className="w-6 ml-2 cursor-pointer active:opacity-45" onClick={() => navigator.clipboard.writeText(apiKey)}/>
                </div>
                <div className="flex items-center cursor-pointer mt-2 ml-2" onClick={() => {
                    keyDisplayToggle(!showKey)
                    setTimeout(() => {
                        keyDisplayToggle(false)
                    },10000)
                }}>
                    <img src={showKey?checkboxSelected:checkbox} className="w-6 mr-2"/>
                    <p className="text-sm">Show Key</p>
                </div>
            </div>:null}
        </div>
        <AddAccount open={showAddAccount} onClose={() => addAccountDisplay(false)} createAccount={(accountName, gstin, autoSelectMode, contacts, plan, rtoRequired) => {
            createAccount(token || '', accountName, gstin, autoSelectMode, contacts, plan, rtoRequired, (success, message) => {
                if (success) {
                    setToast(message, 'success')
                    addAccountDisplay(false)
                } else {
                    setToast(message, 'error')
                }
            })
        }} loading={activity.createAccount} />
        <AddUser open={showAddUser} onClose={() => addUserDisplay(false)} addUser={(userName, phoneNumber, email) => {
            addUser(token || '', phoneNumber, userName, email, accountId || '', (success, message) => {
                if (success) {
                    setToast(message, 'success')
                    addUserDisplay(false)
                } else {
                    setToast(message, 'error')
                }
            })
        }} loading={activity.addUser} />
    </div>
}