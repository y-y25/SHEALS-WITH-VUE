<template>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">SCAN QR CODE</h1>
    </div>
    <div class="qrscanner">
        <qrcode-stream @decode="onDecode" ></qrcode-stream>
        
<div v-if="resultmodal" class="modal-container">
    <div class="modal-background" @click="resultmodal=false"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">List of Cart Items Redeemed</h5>
        <button type="button" class="close" @click="resultmodal=false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <ul>
            <li v-for="item in redeemItems" :key="item.pdt">{{ item.pdtname }} x {{ item.qty }}</li>
        </ul>
      </div>
    </div>
  </div>
    </div>
</template>

<script>
 import  { db } from '../firebase/index.js'
 import {doc, updateDoc, increment, arrayRemove, getDoc} from "firebase/firestore"
import { QrcodeStream } from 'vue3-qrcode-reader'
export default {
    components: {
        QrcodeStream
    },
    data() {
        return {
            resultmodal: false,
            redeemItems: []
        }
    },
    methods: {
        //on detection of qr code
        async onDecode (decodedString) {
            let resArr = decodedString.split("+")
            let userId = resArr[1]
            let cartArr = JSON.parse(resArr[0])

            //get user reference
            const userRef = doc(db, "users", userId)

            //get deal list and update
            for (const element of cartArr) {
                let dealDoc = doc(db, "deals", element.pdt);

                // Remove from user cart
                await updateDoc(userRef, {
                    cart: arrayRemove(element),
                });

                let deal_rec = (await getDoc(dealDoc)).data();
                element["pdtname"] = deal_rec.product_name;

                // Update deal qty
                await updateDoc(dealDoc, {
                    deal_quantity: increment(-element.qty),
                });
            }

            this.redeemItems = cartArr
            this.resultmodal = true

            
        }
    }
}
</script>

<style>
.qrcode-stream-camera,
.qrcode-stream-overlay,
.qrcode-stream-wrapper {
    width: 500px !important;
    height: 400px !important;
}


.qrscanner {
    display: flex; /* Use flexbox to center content */
    justify-content: center; /* Horizontally center content */
    height: 100vh; /* Optionally, set a fixed or relative height for the container */
}
    
</style>