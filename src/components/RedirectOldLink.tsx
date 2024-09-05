import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default () => {
    const navigate = useNavigate()
    const { component } = useParams() as { component: string };

    useEffect(() => {
        navigate(`/${component}`)
    }, [component])

    return null
}