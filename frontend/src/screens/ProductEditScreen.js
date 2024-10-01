import React,{ useState,useEffect } from 'react'
import axios from 'axios'
import { Link,useNavigate,useParams } from 'react-router-dom'
import { Form,Button } from 'react-bootstrap' // Import Button from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch,useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer';
import { listProductDetails,updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen() {

    const { id } = useParams(); //user id instead of userId

    const [name,setName] = useState('')
    const [price,setPrice] = useState(0)
    const [image,setImage] = useState('')
    const [brand,setBrand] = useState('')
    const [category,setCategory] = useState('')
    const [countInStock,setCountInStock] = useState(0)
    const [description,setDescription] = useState('')
    const [uploading,setUploading] = useState(false)


    const navigate = useNavigate();

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { error,loading,product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { error: errorUpdate,loading: loadingUpdate,success: successUpdate } = productUpdate

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/productlist')
        } else {
            if (!product || !product.name || product._id !== Number(id)) {
                dispatch(listProductDetails(id)) // render the existing product details that's in db
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }

        }

    },[dispatch,product,id,navigate,successUpdate])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({ //send product details to action
            _id: id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]

        const formData = new FormData()
        //add file to form data
        formData.append('image',file)
        formData.append('product_id',id)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            const { data } = await axios.post('/api/products/upload/',formData,config)

            setImage(data)
            setUploading(false)
        } catch (error) {
            setUploading(false)
        }
    }

    return (
        <div>
            {/* go back to user list */}
            <Link to='/admin/productlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'> {errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler} >

                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    id='price'
                                    type='number'
                                    placeholder='Enter Price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Image</Form.Label>

                                <Form.Control
                                    id='image'
                                    type='text'
                                    placeholder='Enter Image'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.Control
                                    type='file'
                                    id='image-file'
                                    label='Choose File'
                                    onChange={uploadFileHandler}
                                    style={{
                                        display: 'block',
                                        marginTop: '10px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px',
                                        backgroundColor: '#f8f9fa',
                                        transition: 'border-color 0.2s ease-in-out',
                                    }}
                                ></Form.Control>

                                {uploading && <Loader />}

                            </Form.Group>

                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='countInStock'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter Stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Button type='submit' variant='primary'>
                                Update
                            </Button>
                        </Form>
                    )}

            </FormContainer>
        </div>
    )
}

export default ProductEditScreen
