import { useState } from "react"
import Button from "./Button"
import { useNavigate } from "react-router-dom"

export default ({ onClick, distance, pickupEta, sla, minPrice, maxPrice, loading, reset }: {
    onClick: (callback: (orderId: string) => void) => void,
    distance: number,
    pickupEta: number,
    sla: number,
    minPrice: number,
    maxPrice: number,
    loading: boolean,
    reset: () => void
}) => {
    const [orderId, setOrderId] = useState<string | undefined>(undefined)
    const navigate = useNavigate()

    return <>
        <div className="px-6 py-4 absolute top-[60px] bottom-[200px] overflow-auto flex flex-col items-center w-full">
            {orderId ? <div className="px-6 py-4 absolute top-[60px] bottom-[200px] overflow-auto flex flex-col items-center w-full mt-20">
                <p className="text-3xl text-center">Thank you for placing the order</p>
                <p className="text-3xl text-center mt-4">{`Order Id: ${orderId}`}</p>
                <p className="text-3xl text-center mt-10">Rider will be assigned soon</p>
            </div> : <div className="bg-process-cyan flex justify-between w-full p-4 rounded-3xl border border-black">
                <div>
                    <p className="text-xl font-bold mb-10">Paytm Swift</p>
                    <div>
                        <p>{`Distance: ${distance} kms`}</p>
                        <p>{`Pickup Time < ${pickupEta} mins`}</p>
                        <p>{`ETA: ~${sla} mins`}</p>
                    </div>
                </div>
                <div>
                    <p className="text-xl font-bold mb-3">{`Rs ${parseInt(minPrice.toString())} - ${parseInt(maxPrice.toString())}`}</p>
                    <p>incl taxes</p>
                </div>
            </div>}
        </div>
        {orderId ?
            <div className="absolute bottom-10 w-full px-4 border">
                <div className="flex w-full items-center justify-center my-4 flex-col *:mb-10">
                    <Button title="Place another Order" onClick={() => {
                        reset()
                        navigate('/paytm/home')
                    }} variant="primary" />
                    <Button title="View Orders"  variant="primary" onClick={() => {
                        reset()
                        navigate('/paytm/orders')
                    }}/>
                </div>
            </div> : <div className="absolute bottom-10 w-full px-4 border">
                <p>Available wallet balance: Rs 254</p>
                <div className="flex w-full items-center justify-center my-4">
                    <Button title="Place Order" onClick={() => onClick((orderId) => {
                        setOrderId(orderId)
                    })} variant="primary" loading={loading} />
                </div>
            </div>}
    </>
}