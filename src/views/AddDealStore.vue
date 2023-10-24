<template>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Add Deal</h1>
    </div>

    <button @click="scanmodal(); startscan();" class="btn btn-warning">
        <span>Scan Now</span>
    </button>

    <div v-show="scan" class="modal-container">
    <div class="modal-background" @click="scanmodal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title mx-auto">Please positon your barcode</h5>
        <button type="button" class="close" @click="scanmodal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div ref="pdtscan" class="scanner"></div>
      </div>
    </div>
    </div>


    <form @submit.prevent="upload_deal()">
        
        <div class="row">
            <div class="col-4">
                <label for="barcodeid" class="py-2">Barcode ID</label>
                <input type="number" class="form-control" id="barcodeid" ref="barcodeid" readonly>                    
            </div>
            <div class="col-4">
                <label for="pdtname" class="py-2">Product Name</label>
                <input type="text" class="form-control" id="pdtname" ref="productname" readonly>                    
            </div>
            <div class="col-4">
                <input type="text" ref="foodtag" id="foodtag" v-show="false">
                <label for="pdtcat" class="py-2">Product Category</label>
                <select id="pdtcat" ref="foodcategory" class="form-control mb-2" required="required">
                        <option>Bakery</option>
                        <option>Diary, Chilled & Eggs</option>
                        <option>Drinks</option>
                        <option>Beer, Wine & Spirits</option>
                        <option>Snacks & Confectionery</option>
                        <option>Frozen</option>
                        <option>Fruits and Vegetables</option>
                        <option>Rice, Noodles & Cooking Ingredients</option>
                        <option>Meat & Seafood</option>
                        <option>Food Cupboard</option>
                </select>                   
            </div>         
        </div>
        <div class="row">
            <div class="col-6">
                <label for="dealname" class="py-2">Deal Name</label>
                <input type="text" class="form-control" id="dealname" ref="dealname" placeholder="e.g. Hot deals for soju!"  required>                    
            </div>
            <div class="col-6">
                <label for="deal_type" class="py-2" ref="dealtype">Select Deal Type</label>
                    <select id="deal_type" ref="dealtype" class="form-control mb-2" required="required">
                        <option>Discounts</option>
                        <option>Bundle Deal</option>
                        <option>1 For 1</option>
                    </select>
            </div>

        </div>

            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="dealdescr" class="py-2" >Deal Description</label>
                        <textarea class="form-control" id="dealdescr" ref="dealdescr" rows="6"></textarea>
                    </div>
                </div>
                <div class="col-lg-2 col-sm-4">
                    <label for="dealprice" class="py-2">Price</label>
                    <input type="number" step="0.01" class="form-control" id="dealprice" ref="dealprice" required> 
                    <label for="dealqty" class="py-2">Quantity</label>
                    <input type="text" class="form-control" id="dealqty" ref="dealqty" required>                   
                </div>

            </div>
            <div class="row">
                <label for="dealimg" class="py-2">Upload image</label>
                <input type="file" id="dealimg" name="dealimg" ref="dealimg">
            </div>


            <button class="btn btn-primary my-3" type="submit">Submit form</button>
</form>
    
        
        
</template>

<script>
import  Quagga  from '../assets/quagga.min.js'
import axios from 'axios'
import  { storage, db } from '../firebase/index.js'
import {addDoc, collection} from 'firebase/firestore'
import { ref, uploadBytes} from 'firebase/storage'


export default {
    data () {
        return {
            //var if the modal pops up or not
            scan: false
        }
    },
    methods: {
        async upload_deal () {

            //extracting image
            let dealImgName = this.$refs.dealimg.files[0].name

            //extracting acc details for store from localstorage
            let userEmail = localStorage.getItem('userEmail')
            let userType = localStorage.getItem('userType')
            let userAddr = localStorage.getItem('homeAddress')
            let storename = localStorage.getItem('storeName')

            // add document to products collection (with extracting photo)
            await addDoc(collection(db, "deals"),{
                barcode: this.$refs.barcodeid.value,
                product_name: this.$refs.productname.value,
                product_category: this.$refs.foodcategory.value,
                product_tags: this.$refs.foodtag.value,
                deal_type: this.$refs.dealtype.value,
                deal_name: this.$refs.dealname.value,
                deal_description: this.$refs.dealdescr.value,
                deal_price: this.$refs.dealprice.value,
                deal_quantity: this.$refs.dealqty.value,
                uploaded_by: {email: userEmail, type:userType, name:storename},
                location: userAddr,
                image: dealImgName
            }).then(docRef => {
                const storageRef = ref(storage, `deals/${userEmail}/${docRef.id}/${dealImgName}`)
                uploadBytes(storageRef, this.$refs.dealimg.files[0]).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                });
            })

            this.$router.push({name:'DealListStore'})

        },
        scanmodal () {
            //func if the modal pops up or not
            this.scan = !this.scan
        },
        startscan(){
            // Upon clicking on 'scan now', quagga lib triggers
            //Initialize Quagga
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: this.$refs.pdtscan  //camera to dom using ref
                },
                decoder: {
                    readers: ["ean_reader"] //removed most of the other readers to avoid conflict with ean13
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
            });
        }
        
    },
     mounted(){
        // arrow function used to refer to correct 'this' aka this vue. Using Normal function 'this' refers to quagga lib
        Quagga.onDetected((data) => {
        var barcodeValue = data.codeResult.code;
        this.$refs.barcodeid.value = barcodeValue;
        
        // Stop Quagga after a barcode is detected
        Quagga.stop();


        // Close the modal after a barcode is detected
        if (this.scan) {
            this.scanmodal();
 
        }

        //using axios to get pdt name and cat
        axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcodeValue}.json`)
            .then(response => {
                console.log(response.data.product.categories);
                let fooditem = response.data.product
                let foodcat = response.data.product.categories
                fooditem = fooditem.product_name

                this.$refs.productname.value = fooditem
                this.$refs.foodtag.value = foodcat
                

            })
            .catch( error => {
                console.error(error);
            });
  });
    }


};
</script>


<style>
video  {
    width: 300px;
    height: 300px;
    margin: auto;
}

.drawingBuffer {
    display: none;
}

.scanner {
    display: flex;
    justify-content: center;
    align-items: center;
}

/*---------------------
    Modal
    -----------------------*/
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-background {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent black background */
}

.modal-content {

    background-color: white !important;
    padding: 20px;
    max-width: 600px;
    width: 100%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    /* Ensure it's above other elements */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}


</style>