<template>
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Update Deal</h1>
        </div>
        <form @submit.prevent="UpdateDealInfo()">
        <div class="row">
            <img :src="imageURL" alt="" class="extractedpic">
        </div>
        
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


            <button class="btn btn-primary my-3" type="submit">Update Deal</button>
</form>

</template>

<script>
import { db, storage } from "../firebase/index.js"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import {ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage"

export default {
    data(){
        return{
            imageURL: null
        }
    },
    mounted (){
        this.populateDealIndo()
    },
    methods: {
        //async because need to wait for getDoc, function to 
        async populateDealIndo() {
            const docRef = doc(db, "deals", this.$route.params.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const deal_rec = docSnap.data()
                this.$refs.barcodeid.value = deal_rec.barcode
                this.$refs.productname.value = deal_rec.product_name
                this.$refs.foodcategory.value = deal_rec.product_category
                this.$refs.dealtype.value = deal_rec.deal_type
                this.$refs.dealname.value = deal_rec.deal_name
                this.$refs.dealdescr.value = deal_rec.deal_description
                this.$refs.dealprice.value = deal_rec.deal_price
                this.$refs.dealqty.value = deal_rec.deal_quantity
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }

            this.imageURL = await getDownloadURL(ref(storage, `deals/${localStorage.getItem("userEmail")}/${this.$route.params.id}/${docSnap.data().image}`));
        },
        async UpdateDealInfo(){
            const deal_doc = doc(db, "deals", this.$route.params.id)

            //checking image
            const dDoc = await getDoc(deal_doc)
            const doc_rec = dDoc.data()
            let dealImage = "" // initialise image name
            if(this.$refs.dealimg.files[0]){
                dealImage = this.$refs.dealimg.files[0].name
                //upload image if there is an image uploaded
                const newRef = ref(storage, `deals/${localStorage.getItem("userEmail")}/${this.$route.params.id}/${dealImage}`)
                uploadBytes(newRef, this.$refs.dealimg.files[0]).then((snapshot) => {
                    console.log('reuploaded a blob or file!');
                });

                //remove delete old image
                // Create a reference to the file to delete
                const desertRef = ref(storage, `deals/${localStorage.getItem("userEmail")}/${this.$route.params.id}/${doc_rec.image}`);

                // Delete the file
                deleteObject(desertRef).then(() => {
                // File deleted successfully
                }).catch((error) => {
                // Uh-oh, an error occurred!
                })
            } else {
                dealImage = doc_rec.image
            }

            //updating doc
            await updateDoc(deal_doc, {
                deal_name: this.$refs.dealname.value,
                deal_type: this.$refs.dealtype.value,
                deal_description: this.$refs.dealdescr.value,
                deal_price: this.$refs.dealprice.value,
                deal_quantity:this.$refs.dealqty.value,
                product_category: this.$refs.foodcategory.value,
                image: dealImage
            });

            this.$router.push({ name: 'DealListStore'})
        }
    }

}
</script>

<style scoped>
.extractedpic{
    width: 200px;
    border-radius: 50%;
    margin: auto;
}

</style>