import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const navigate = useNavigate()
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = []
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2
    }
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url)
    } else {
      alert("Error")
    }
  }
  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required type="text" placeholder='First Name' value={data.firstName} onChange={onChangeHandler} name='firstName' />
          <input required type="text" placeholder='Last Name' value={data.lastName} onChange={onChangeHandler} name='lastName' />
        </div>
        <input required type="email" placeholder='email address' onChange={onChangeHandler} value={data.email} name='email' />
        <input required type="text" placeholder='Street' onChange={onChangeHandler} value={data.street} name='street' />
        <div className="multi-fields">
          <input required type="text" placeholder='City' onChange={onChangeHandler} value={data.city} name='city' />
          <input required type="text" placeholder='State' onChange={onChangeHandler} value={data.state} name='state' />
        </div>
        <div className="multi-fields">
          <input required type="text" placeholder='Zip code' onChange={onChangeHandler} value={data.zipcode} name='zipcode' />
          <input required type="text" placeholder='Country' onChange={onChangeHandler} value={data.country} name='country' />
        </div>
        <input required type="text" placeholder='Phone' onChange={onChangeHandler} value={data.phone} name='phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() > 0 ? 2 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() > 0 ? getTotalCartAmount() + 2 : 0}</b>
            </div>
            <br />
            <button type='submit'>PROCEED TO PEYMENT</button>
          </div>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder