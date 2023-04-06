/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaCheckCircle} from 'react-icons/fa'
import {BiRupee} from 'react-icons/bi'
import Header from '../Header'
import Footer from '../Footer'
import CartItem from '../CartItem'
import './index.css'

const cartStatusConstants = {
  initial: 'INITIAL',
  cartItemsFound: 'SUCCESS',
  noCartItems: 'FAILURE',
  paymentSuccess: 'PAYMENT',
}

const cartEmptyUrl =
  'https://res.cloudinary.com/dppqkea7f/image/upload/v1625831743/cart-no-order_qivsro.png'

class CartRoute extends Component {
  state = {cartData: [], cartStatus: cartStatusConstants.initial, totalValue: 0}

  componentDidMount() {
    this.calculateTheTotalAmount()
    this.getTheCartData()
  }

  updatingWholeCart = () => {
    this.calculateTheTotalAmount()
  }

  getTheCartData = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || []
    if (cartData.length === 0) {
      this.setState({cartStatus: cartStatusConstants.noCartItems})
    } else {
      this.setState({
        cartData,
        cartStatus: cartStatusConstants.cartItemsFound,
      })
    }
  }

  calculateTheTotalAmount = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || []
    if (cartData.length > 0) {
      const cartDataValue = cartData.map(each => each.quantity * each.cost)
      const reduceSum = cartDataValue.reduce((a, b) => a + b)
      this.setState({totalValue: reduceSum}, this.getTheCartData())
    }
  }

  goToHomePage = () => {
    const {history} = this.props
    history.replace('/')
  }

  placeOrder = () => {
    this.setState({cartStatus: cartStatusConstants.paymentSuccess})
    localStorage.clear('cartData')
  }

  cartEmptyView = () => (
    <div className="cart-route-empty-view-container">
      <img
        src={cartEmptyUrl}
        alt="empty cart"
        className="cart-route-empty-view-image"
      />
      <h1 className="cart-route-empty-view-heading">No Order Yet!</h1>
      <p className="cart-route-empty-view-paragraph">
        Your cart is empty. Add something from the menu.
      </p>
      <Link to="/" style={{textDecoration: 'none'}}>
        <button type="button" className="cart-route-empty-view-button">
          Order Now
        </button>
      </Link>
    </div>
  )

  paymentSuccessfulView = () => (
    <div className="cart-route-payment-success-container">
      <FaCheckCircle className="cart-route-payment-success-checkbox" />
      <h1 className="cart-route-payment-success-checkbox-heading">
        Payment Successful
      </h1>
      <p className="cart-route-payment-success-checkbox-paragraph">
        Thank you for ordering Your payment is successfully completed.
      </p>
      <Link to="/" style={{textDecoration: 'none'}}>
        <button
          className="cart-route-payment-success-checkbox-home-button"
          type="button"
        >
          Go To Home Page
        </button>
      </Link>
    </div>
  )

  cartItemsView = () => {
    const {cartData, totalValue} = this.state

    return (
      <>
        <div className="cart-route-main-container-with-footer">
          <div className="cart-container-to-hold-all-item">
            <ul className="cart-route-cart-item-un-order-container">
              {cartData.map(eachItem => (
                <CartItem
                  updatingWholeCart={this.updatingWholeCart}
                  key={eachItem.id}
                  eachCartItem={eachItem}
                />
              ))}
            </ul>
            <hr className="cart-route-horizontal-line" />
            <div className="cart-route-total-order-value-container">
              <h1 className="cart-route-total-order-value">Order Total:</h1>
              <div className="cart-route-total-order-value-rupees">
                <BiRupee className="TotalRupee" />
                <p testid="total-price">{totalValue}.00</p>
              </div>
            </div>
            <button
              className="cart-route-place-order-button"
              type="button"
              onClick={this.placeOrder}
            >
              Place Order
            </button>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  onRenderDisplayCartPage = () => {
    const {cartStatus} = this.state

    switch (cartStatus) {
      case cartStatusConstants.cartItemsFound:
        return this.cartItemsView()
      case cartStatusConstants.noCartItems:
        return this.cartEmptyView()
      case cartStatusConstants.paymentSuccess:
        return this.paymentSuccessfulView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.onRenderDisplayCartPage()}</div>
      </>
    )
  }
}

export default CartRoute