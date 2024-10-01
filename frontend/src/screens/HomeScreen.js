import React,{ useState,useEffect } from 'react'
import { Row,Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch,useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import Paginate from '../components/Paginate'

//select certain part of state
import { listProducts } from '../actions/productActions'
import { useNavigate,useParams } from 'react-router-dom'
import ProductCarousel from '../components/ProductCarousel'

function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { error,loading,products,page,pages } = productList;

    const location = useLocation(); // Get the current location
    const queryParams = new URLSearchParams(location.search); // Get query parameters
    const keyword = queryParams.get('keyword') || ''; // Extract the keyword
    const currentPage = queryParams.get('page') || ''; // Extract from store doesn't work

    useEffect(() => {
        dispatch(listProducts(keyword,currentPage))

    },[dispatch,keyword,currentPage])


    return (
        <div>
            {!keyword && <ProductCarousel />}
            <h1>Latest products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : Array.isArray(products) ? ( // Check if products is an array
                <div>
                    <Row>
                        {products.map((product) => (
                            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate page={currentPage} pages={pages} keyword={keyword} />
                </div>
            ) : (
                <div>No products to display</div>
            )}
        </div>
    );
}

export default HomeScreen