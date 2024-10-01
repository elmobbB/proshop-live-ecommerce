import React,{ useState } from 'react'
import { Button,Form } from 'react-bootstrap'
import { useNavigate,useLocation } from 'react-router-dom'

function SearchBox() {
    const [keyword,setKeyword] = useState()

    let navigate = useNavigate()
    const location = useLocation();

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`)
        } else {
            navigate(location.pathname)
        }

    }

    return (
        <Form onSubmit={submitHandler} className="d-flex align-items-center">
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => { setKeyword(e.target.value) }}
                style={{ marginRight: '10px' }}             >

            </Form.Control>
            <Button
                type='submit'
                variant='outline-success'
            >Submit</Button>
        </Form>
    )
}

export default SearchBox
