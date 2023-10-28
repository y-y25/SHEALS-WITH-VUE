<template>
    <HeaderSection/>

    <!-- Modal to show compiled QR code -->
    <div v-if="qrModal" class="modal-container">
        <div class="modal-background" @click="qrModal=false"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Let Cashier Staff Scan</h5>
                    <button type="button" class="close" @click="qrModal=false">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
        <div class="modal-body">
            <div class="qrcode"><qrcode-vue :value="qrValue"  v-if="qrValue"></qrcode-vue></div>
        </div>
    </div>
    </div>

    <div class="container padding-bottom-3x mb-1 cartcontent">

    <!-- Drop down list to select store -->
    <select class="form-select my-4" ref="storeChosen" @change="filterByStore">
        <option v-for="store in store_list" :key="store">{{store}}</option>
    </select>
    
    <!-- Shopping Cart-->
    <div class="table-responsive shopping-cart">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="text-center col-5">Deal and Product Information</th>
                    <th class="text-center">Type</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-center">Price/Unit</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="deal in display_list" :key="deal.id">
                    <td>
                        <div class="product-item" >
                            <a class="product-thumb" href="#"><img :src="deal.url" alt="Product"></a>
                            <h4 class="product-title"><a href="#">{{ deal.deal_name }}</a></h4>
                            <span><em>Product: {{ deal.product_name }}</em></span>
                        </div>
                    </td>
                    <td>{{ deal.type }}</td>
                    <td class="qtycol">
                            <div class="row justify-content-center">
                            <div class="col-6 qtyalign">{{ deal.cart_qty}}</div>
                            <div class="col-6">
                                <input class="btn bg-secondary increment col-12 my-1"  value="+" @click="changeQty('+', deal.id)" readonly>
                                <input class="btn btn-secondary increment col-12 my-1"  value="-" @click="changeQty('-', deal.id)" readonly>
                            </div>
                            </div>
                    </td>
                           
                    <td class="text-center text-lg text-medium">${{ deal.perunit }}</td>
                    <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" @click="deleteCartItem(deal.id)"><i class="fa fa-trash"></i></a></td>
                </tr>


            </tbody>
        </table>
    </div>
    <!-- <div class="shopping-cart-footer">
        <div class="column text-lg">Subtotal: <span class="text-medium">$289.68</span></div>
    </div> -->
    <div class="shopping-cart-footer">
        <router-link :to="{name:'Home'}"><div class="homeleft"><a class="btn btn-secondary">Back To Home</a></div></router-link>
        <div class="redeemright"><a class="btn btn-success" href="#" @click="qrGenerate()">Reedem Deals</a></div>
    </div>
</div>
</template>

<script>
 import QrcodeVue from 'qrcode.vue'
 import HeaderSection from '../components/headerSection.vue'
 import  { db } from '../firebase/index.js'
 import {doc, getDoc, updateDoc} from "firebase/firestore"
 
export default {
    components: {
        QrcodeVue, HeaderSection
    },
    data(){
        return {
            qrModal: false,
            qrValue: null,
            cart_arr: null, //imitates cart arr in firebase (to update)
            store_list:[], //used for drop down to track
            cart_list:[], //used for mainset to filter
            display_list:[] //usde for the result of filter
        }
    },
    created() {
        this.fetchCart()
    },
    methods: {
        async fetchCart(){
            //fetch all cart items, localstorage used over vue store due to loading of store
            const userRef = doc(db,"users",localStorage.getItem("userID"))

            //retrieve cart array
            const userDoc = (await getDoc(userRef)).data() //retrieve fields
            this.cart_arr = userDoc.cart

            //remove cart deals which no longer exist
            this.cart_arr = this.cart_arr.filter(async(item)=>{
                let dealdoc = doc(db, "deals", item.pdt)
                let docsnap = await getDoc(dealdoc)
                if(!docsnap.exists()){
                    await updateDoc(userRef,{
                        cart: arrayRemove(item)     
                    })
                }
            })

            //packing pdt id in the list to use as condition later
            for (var item of this.cart_arr){
                //populate store list for drop down selection
                if(this.store_list.indexOf(item.storename) == -1){
                    this.store_list.push(item.storename)
                }

                //for each item, there is a unique product id
                let dealRef = doc(db, "deals", item.pdt)
                let deal_rec = (await getDoc(dealRef)).data()

                this.cart_list.push({ //main copy
                    id:item.pdt,
                    cart_qty: item.qty,
                    store: item.storename,
                    deal_name: deal_rec.deal_name,
                    product_name: deal_rec.product_name,
                    url: deal_rec.image,
                    perunit: deal_rec.deal_price,
                    type: deal_rec.deal_type })
            }

            this.display_list = this.cart_list.filter((item) => {
                return item.store == this.store_list[0]
            })
            // console.log(this.cart_list)
            // console.log(this.display_list)


        },
        filterByStore(){
            this.display_list = this.cart_list.filter((item) => {
                return item.store == this.$refs.storeChosen.value
            })

        },
        async deleteCartItem(id){
            //fetch all cart items, localstorage used over vue store due to loading of store
            const userRef = doc(db,"users",localStorage.getItem("userID"))

            //update in car_list since it is permanent deletion instead of filtering
            this.cart_list = this.cart_list.filter((item) => {
                return item.id != id
            })

            // run function filterstore to get updated display_list
            this.filterByStore()

            //arrow functions to remove cart_arr items (identical copy in db) and update in firebase
            this.cart_arr = this.cart_arr.filter((item)=>!(item.pdt == id))

            await updateDoc(userRef,{cart:this.cart_arr})

            alert("Item Removed!")
        },

        async changeQty(operation,dealid){

            for(var item of this.cart_list){
                if (item.id === dealid){
                    item.cart_qty = eval(item.cart_qty + operation + 1)
                    if(item.cart_qty === 0){
                        this.deleteCartItem(item.id)
                    }
                }
            }

            for(var deal of this.cart_arr){
                if (deal.pdt === dealid){
                    deal.qty = eval(deal.qty + operation + 1)
                    if(deal.qty === 0){
                        this.cart_arr.pop(deal)
                    }
                }
            }

            const userRef = doc(db, "users", localStorage.getItem("userID"))
            await updateDoc(userRef,{
                cart: this.cart_arr
            })

        },
        qrGenerate(){
            //open up the modal
            this.qrModal = true
            var selectedCart = []
            //cart_arr is all cart from user cart field
            selectedCart = this.cart_arr.filter((element)=>{
                return (element.storename == this.$refs.storeChosen.value)
            })
            //assign items in cart to qrValue
            this.qrValue = JSON.stringify(selectedCart) + `+${localStorage.getItem("userID")}`
        }
    }
}
</script>

<style scoped>
.qtyalign {
    display: flex;
    align-items: center;
}

.qtycol {
    width:20px
}

.cartcontent{
    margin-top: 200px;
}

.homeleft{
    float: left;
}

.redeemright{
    float: right;
}

.qrcode {
    width: 200px;
    margin: auto;
    text-align: center;
}

.increment {
    width: 40px;
    margin-bottom: 10px;
    box-sizing: content-box;
}

.form-select {
    width: 40% !important;
}

.shopping-cart,
.order-table {
    margin-bottom: 20px
}

.shopping-cart .table,
.order-table .table {
    margin-bottom: 0
}

.shopping-cart .btn,
.order-table .btn {
    margin: 0
}

.shopping-cart>table>thead>tr>th,
.shopping-cart>table>thead>tr>td,
.shopping-cart>table>tbody>tr>th,
.shopping-cart>table>tbody>tr>td,
.order-table>table>thead>tr>th,
.order-table>table>thead>tr>td,
.order-table>table>tbody>tr>th,
.order-table>table>tbody>tr>td {
    vertical-align: middle !important;
    border-left: none; /* Remove left border */
    border-right: none; /* Remove right border */
}

.shopping-cart>table thead th,
.order-table>table thead th {
    padding-top: 17px;
    padding-bottom: 17px;
    border-width: 1px
}

.shopping-cart .remove-from-cart,
.order-table .remove-from-cart {
    display: inline-block;
    color: #ff5252;
    font-size: 18px;
    line-height: 1;
    text-decoration: none
}

.shopping-cart .count-input,
.order-table .count-input {
    display: inline-block;
    width: 100%;
    width: 86px
}

.shopping-cart .product-item,
.order-table .product-item {
    display: table;
    min-width: 150px;
    margin-top: 5px;
    margin-bottom: 3px
}

.shopping-cart .product-item .product-thumb,
.shopping-cart .product-item .product-info,
.order-table .product-item .product-thumb,
.order-table .product-item .product-info {
    display: table-cell;
    vertical-align: top
}

.shopping-cart .product-item .product-thumb,
.order-table .product-item .product-thumb {
    width: 130px;
    padding-right: 20px
}

.shopping-cart .product-item .product-thumb>img,
.order-table .product-item .product-thumb>img {
    display: block;
    width: 100%
}

@media screen and (max-width: 860px) {
    .shopping-cart .product-item .product-thumb,
    .order-table .product-item .product-thumb {
        display: none
    }
}

.shopping-cart .product-item .product-info span,
.order-table .product-item .product-info span {
    display: block;
    font-size: 13px;
}

.shopping-cart .product-item .product-info span>em,
.order-table .product-item .product-info span>em {
    font-weight: 500;
    font-style: normal
}

.shopping-cart .product-item .product-title,
.order-table .product-item .product-title {
    margin-bottom: 6px;
    padding-top: 5px;
    font-size: 16px;
    font-weight: 500
}

.shopping-cart .product-item .product-title>a,
.order-table .product-item .product-title>a {
    transition: color .3s;
    color: #374250;
    line-height: 1.5;
    text-decoration: none
}

.shopping-cart .product-item .product-title>a:hover,
.order-table .product-item .product-title>a:hover {
    color: #0da9ef
}

.shopping-cart .product-item .product-title small,
.order-table .product-item .product-title small {
    display: inline;
    margin-left: 6px;
    font-weight: 500
}


.shopping-cart-footer {
    display: table;
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #e1e7ec
}

.shopping-cart-footer>.column {
    display: table-cell;
    padding: 5px 0;
    vertical-align: middle
}

.shopping-cart-footer>.column:last-child {
    text-align: right
}

.shopping-cart-footer>.column:last-child .btn {
    margin-right: 0;
    margin-left: 15px
}

@media (max-width: 768px) {
    .shopping-cart-footer> {
        display: block;
        width: 100%
    }
    .shopping-cart-footer>.column:last-child {
        text-align: center
    }
    .shopping-cart-footer>.column .btn {
        width: 100%;
        margin: 12px 0 !important
    }
}



</style>