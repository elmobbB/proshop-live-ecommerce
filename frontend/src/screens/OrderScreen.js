import React,{ useState,useEffect,} from 'react'
import { Button,Row,Col,ListGroup,Image,Card } from 'react-bootstrap'
import { Link,useNavigate,useParams } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { PayPalButton } from "react-paypal-button-v2";
import Message from '../components/Message'
import Loader from '../components/Loader'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { getOrderDetails,payOrder,deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../constants/orderConstants';

function OrderScreen() {
    const { id: orderId } = useParams();
    const dispatch = useDispatch()

    const [sdkReady,setSdkReady] = useState(false)  // software development kit is not ready for paypal , once loaded = true

    const orderDetails = useSelector(state => state.orderDetails)
    const { order,error,loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay,success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver,success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const navigate = useNavigate()

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc,item) => acc + item.price * item.qty,0).toFixed(2)
    }
    //client id
    //AZGN4Q7BSD0iCnfYw2vNdGb8qMK4qkWHaf0JL4dM7NoXjfYlM5PsNMQPM6Apfjq-7tKLJ0i0CthhWUqF

    const addPaypalScript = () => {  //this functionis dependent on order status
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = "https://www.paypal.com/sdk/js?client-id=AZGN4Q7BSD0iCnfYw2vNdGb8qMK4qkWHaf0JL4dM7NoXjfYlM5PsNMQPM6Apfjq-7tKLJ0i0CthhWUqF"
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) { //if those info is not fetched, dispatches the getOrderDetails action to fetch the order details.
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPaypalScript() //if window doesnt have it, add paypalscript
            } else {
                setSdkReady(true)
            }
        }
    },[dispatch,order,orderId,successPay,successDeliver])

    const succesPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId,paymentResult)) //payOrder send an API call , then update db
    }

    const succesDeliverHandler = () => {
        dispatch(deliverOrder(order)) //payOrder send an API call , then update db
    }

    return loading ? (
        <Loader />) : error ? (
            <Message variant='danger'>{error}</Message>
        ) : (
        <div>
            <Row>
                <h1>Order: {order._d}</h1>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            {/* in serializer.py we have the user serializer */}
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address},  {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},
                                {'  '}
                                {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt && order.deliveredAt.substring(0,10)}</Message>
                            ) : (<Message variant='warning'>Not Delivered </Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt && order.paidAt.substring(0,10)}</Message>
                            ) : (<Message variant='warning'>Not Paid {order.paidAt && order.paidAt.substring(0,10)}</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Order is empty
                            </Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item,index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                    </ListGroup>

                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={succesPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}

                        </ListGroup>

                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn w-100'
                                    onClick={succesDeliverHandler}
                                >
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}

                    </Card>
                </Col>
            </Row>
        </div >
    )
}

export default OrderScreen