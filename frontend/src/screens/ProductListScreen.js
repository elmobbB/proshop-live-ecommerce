import React,{ useState,useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table,Button,Row,Col } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate,useParams,useLocation } from 'react-router-dom'
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { createProduct,deleteProduct,listProducts } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

function ProductListScreen() {
    const { id } = useParams()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading,error,products,page,pages } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete,error: errorDelete,success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate,error: errorCreate,success: successCreate,product: createdProduct } = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // const queryString = window.location.search;
    const location = useLocation(); // Get the current location

    const params = new URLSearchParams(location.search);
    const keyword = params.get('keyword') || ''
    const currentPage = params.get('page') || ''
    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })


        if (!userInfo.isAdmin) {
            navigate('/login') //redirect to the homepage
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
            console.log("success")
        } else {
            dispatch(listProducts(keyword,currentPage))
            console.log("else")
        }

    },[dispatch,navigate,userInfo,successDelete,successCreate,createdProduct,keyword,currentPage])

    const deleteHandler = (id) => {

        if (window.confirm('Are ypu sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = (product) => {
        dispatch(createProduct())
    }

    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>

                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'> Create Product</i>
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div>

                            <Table striped bordered hover responsive className='table-sm'>
                                {/* striped --> the rows will be rendered in grey and white */}
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>BRAND</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {products && products.length > 0 ? (
                                    <tbody>
                                        {products.map(products => (
                                            <tr key={products._id}>
                                                <td>{products._id}</td>
                                                <td>{products.name}</td>
                                                <td>${products.price}</td>
                                                <td>{products.category}</td>
                                                <td>{products.brand}</td>


                                                <td>
                                                    <LinkContainer to={`/admin/product/${products._id}/edit`}>
                                                        <Button variant='light' className='btn-sm'>
                                                            <i className='fas fa-edit'></i>
                                                        </Button>
                                                    </LinkContainer>

                                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(products._id)}>
                                                        <i className='fas fa-trash'></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan={5}>No users found</td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                            <Paginate pages={pages} page={currentPage} isAdmin={true} />
                        </div>
                    )}
        </div>
    )
}

export default ProductListScreen
