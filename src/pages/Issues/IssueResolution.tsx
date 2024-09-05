import Modal from "@components/Modal"
import closeIcon from '@assets/close.png'
import parse from 'html-react-parser';


export default ({ open, onClose, issueResolution }: {
    open: boolean,
    onClose: () => void,
    issueResolution: string
}) => {

    return <Modal open={open} onClose={onClose}>
        <div className={'bg-white rounded py-[10px] px-[20px] md:w-[600px] w-[350px] relative'} onMouseDown={e => e.stopPropagation()}>
            <div className={'flex justify-between w-full items-center mb-[10px]'}>
                <p className="text-lg font-semibold">Resolution</p>
                <img src={closeIcon} onClick={onClose} className="w-6 absolute top-1 right-1 cursor-pointer" />
            </div>
            <div className={'mt-1 border p-3 my-4 rounded-md max-h-[390px] overflow-auto md:max-h-[350px]'}>
                <p className="text-sm">{/<\/?\w+>/.test(issueResolution)?parse(issueResolution):issueResolution}</p>
            </div>
        </div>
    </Modal>
}   