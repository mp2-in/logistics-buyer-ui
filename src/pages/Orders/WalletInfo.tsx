import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'

export default ({ open, onClose, link }: {
    open: boolean,
    onClose: () => void,
    link: string
}) => {

    return <Modal open={open} onClose={onClose} >
        <div className={`bg-white rounded flex flex-col items-center py-3 px-5 md:h-[600px] w-[370px] h-[600px] relative md:w-[550px]`} onMouseDown={e => e.stopPropagation()}>
            <div className={`flex justify-between w-full items-center mb-3`}>
                <p className="text-xl font-semibold">Wallet</p>
                <img src={closeIcon} onClick={onClose} className="w-6 cursor-pointer absolute right-1 top-1" />
            </div>
            <iframe src={link} height={'500'} width={'500'}/>
        </div>
    </Modal>
}