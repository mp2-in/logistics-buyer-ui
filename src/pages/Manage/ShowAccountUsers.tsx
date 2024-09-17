import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

import { User } from '@lib/interfaces'


export default ({ open, onClose, users}: { 
    open: boolean, 
    onClose: () => void, 
    users: User[], 
}) => {

    return <Modal open={open} onClose={onClose} >
        <div className={'bg-white rounded flex flex-col items-center py-[10px] md:px-[20px] w-[350px] h-[530px] sm:w-[600px] md:w-[800px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-xl font-semibold ml-3">Users</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute top-1 right-1" />
            </div>
            <div className={'absolute top-[60px] md:left-[20px] md:right-[20px] bottom-[90px] md:text-base text-xs left-0 right-0'}>
                <div className={`flex items-center py-[5px] px-[12px] bg-gray-200 md:rounded-tl-lg md:rounded-tr-lg *:text-left *:font-semibold *:px-[10px] justify-between`}>
                    <p className="flex-[2]">Phone</p>
                    <p className="flex-[3]">Name</p>
                    <p className="flex-[1]">Role</p>
                </div>
                <div className={'absolute flex top-[34px] bottom-0 left-0 right-0 flex-col overflow-auto flex-grow'}>
                    {users.map(e => {
                        return <div key={e.phoneNumber} className="flex items-center w-full py-[5px] md:px-[10px] border-b md:border-l md:border-r text-xs md:text-sm relative *:text-left *:px-[10px] justify-between">
                            <p className="flex-[2]">{e.phoneNumber}</p>
                            <p className="flex-[3]">{e.username} min</p>
                            <p className="flex-[1]">{e.role}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </Modal>
}